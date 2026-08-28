# Flush queued web-template git commits as the Windows git account,
# not as IIS IUSR. Called by scheduled task ElastycClientWebGitFlush.
#
# Queue JSON files: tools/git-queue/<id>.json
# Result:           tools/git-queue/<id>.result.json

$ErrorActionPreference = 'Continue'

$RepoRoot = 'W:\wwwroot\ElastycNet\clientweb-templates'
$GitExe = 'C:\Program Files\Git\cmd\git.exe'
$SafeDir = 'W:/wwwroot/ElastycNet/clientweb-templates'
$QueueDir = Join-Path $RepoRoot 'tools\git-queue'
$LockFile = Join-Path $QueueDir '_flush.lock'
$LogFile = 'W:\wwwroot\backup\clientweb-git-flush.log'

function Write-Log([string]$Message) {
    try {
        $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
        Add-Content -LiteralPath $LogFile -Value $line -Encoding utf8
    } catch {
        # ignore log failures
    }
}

function Invoke-Git {
    param([string[]]$GitArgs)
    $out = & $GitExe -c "safe.directory=$SafeDir" -c 'user.name=Elastyc Net' -c 'user.email=office@elastyc.net' @GitArgs 2>&1
    $code = $LASTEXITCODE
    $text = ($out | ForEach-Object { "$_" }) -join "`n"
    return @{ Code = $code; Text = $text }
}

function Write-Result([string]$ResultPath, [hashtable]$Payload) {
    $json = $Payload | ConvertTo-Json -Compress
    Set-Content -LiteralPath $ResultPath -Value $json -Encoding utf8
}

if (-not (Test-Path -LiteralPath $QueueDir)) {
    New-Item -ItemType Directory -Path $QueueDir -Force | Out-Null
}

if (Test-Path -LiteralPath $LockFile) {
    $age = (Get-Date) - (Get-Item -LiteralPath $LockFile).LastWriteTime
    if ($age.TotalMinutes -lt 10) {
        Write-Log 'Skip: lock present'
        exit 0
    }
    Remove-Item -LiteralPath $LockFile -Force -ErrorAction SilentlyContinue
}
Set-Content -LiteralPath $LockFile -Value $PID -Encoding ascii

try {
    if (-not (Test-Path -LiteralPath $GitExe)) {
        throw "git.exe not found: $GitExe"
    }
    Set-Location -LiteralPath $RepoRoot
    $env:GIT_TERMINAL_PROMPT = '0'
    $env:ELASTYC_SYNC_SKIP = '1'

    $jobs = Get-ChildItem -LiteralPath $QueueDir -Filter '*.json' -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notlike '*.result.json' -and $_.Name -notlike '_*' }

    if (-not $jobs) {
        exit 0
    }

    foreach ($job in $jobs) {
        $resultPath = Join-Path $QueueDir ($job.BaseName + '.result.json')
        try {
            $raw = Get-Content -LiteralPath $job.FullName -Raw -Encoding utf8
            $data = $raw | ConvertFrom-Json
            $paths = @()
            if ($data.relPaths) {
                $paths = @($data.relPaths)
            }
            $message = [string]$data.message
            if (-not $message) {
                $message = 'Export web template pack to git'
            }
            if ($paths.Count -lt 1) {
                Write-Result $resultPath @{ ok = $false; error = 'queue missing relPaths' }
                Remove-Item -LiteralPath $job.FullName -Force -ErrorAction SilentlyContinue
                continue
            }

            foreach ($rel in $paths) {
                $rel = ([string]$rel).Replace('\', '/')
                $add = Invoke-Git -GitArgs @('add', '--', $rel)
                if ($add.Code -ne 0) {
                    Write-Log ("git add failed {0}: {1}" -f $rel, $add.Text)
                }
            }

            $cached = Invoke-Git -GitArgs @('diff', '--cached', '--name-only')
            $dirty = $false
            foreach ($line in ($cached.Text -split "`n")) {
                if ($line.Trim()) { $dirty = $true; break }
            }
            if (-not $dirty) {
                # Already committed (or no file change) — still push if origin is behind.
                $push = Invoke-Git -GitArgs @('push', 'origin', 'main')
                $hash = Invoke-Git -GitArgs @('rev-parse', '--short', 'HEAD')
                $short = ($hash.Text -split "`n")[0].Trim()
                $ok = ($push.Code -eq 0)
                Write-Result $resultPath @{
                    ok = $ok
                    commit = $short
                    push = $ok
                    message = 'Nema novih promena za commit.'
                    error = $(if ($ok) { $null } else { 'git push failed' })
                    stdout = $push.Text
                }
                if ($ok) {
                    Remove-Item -LiteralPath $job.FullName -Force -ErrorAction SilentlyContinue
                    Write-Log ("OK push-only {0}" -f $short)
                } else {
                    Write-Log ("push failed: {0}" -f $push.Text)
                }
                continue
            }

            $commit = Invoke-Git -GitArgs @('commit', '-m', $message)
            if ($commit.Code -ne 0) {
                Write-Result $resultPath @{ ok = $false; error = 'git commit failed'; stdout = $commit.Text }
                Write-Log ("commit failed: {0}" -f $commit.Text)
                continue
            }

            $push = Invoke-Git -GitArgs @('push', 'origin', 'main')
            $hash = Invoke-Git -GitArgs @('rev-parse', '--short', 'HEAD')
            $short = ($hash.Text -split "`n")[0].Trim()
            $ok = ($push.Code -eq 0)
            Write-Result $resultPath @{
                ok = $ok
                commit = $short
                push = $ok
                error = $(if ($ok) { $null } else { 'git push failed' })
                stdout = ($commit.Text + "`n" + $push.Text)
            }
            if ($ok) {
                Remove-Item -LiteralPath $job.FullName -Force -ErrorAction SilentlyContinue
                Write-Log ("OK {0} {1}" -f $short, $message)
            } else {
                Write-Log ("push failed: {0}" -f $push.Text)
            }
        } catch {
            Write-Log ("ERROR {0}: {1}" -f $job.Name, $_.Exception.Message)
            Write-Result $resultPath @{ ok = $false; error = $_.Exception.Message }
        }
    }
    exit 0
}
catch {
    Write-Log ("ERROR: " + $_.Exception.Message)
    exit 1
}
finally {
    if (Test-Path -LiteralPath $LockFile) {
        Remove-Item -LiteralPath $LockFile -Force -ErrorAction SilentlyContinue
    }
}
