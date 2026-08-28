# Sync W:\wwwroot\ElastycNet\clientweb-templates to origin/main when behind.
# Called by Cursor agent over SSH right after push to main.
# Log: W:\wwwroot\backup\clientweb-templates-sync.log

$ErrorActionPreference = 'Continue'

$RepoRoot = 'W:\wwwroot\ElastycNet\clientweb-templates'
$GitExe = 'C:\Program Files\Git\cmd\git.exe'
$LogFile = 'W:\wwwroot\backup\clientweb-templates-sync.log'
$LockFile = 'W:\wwwroot\backup\clientweb-templates-sync.lock'
$SafeDir = 'W:/wwwroot/ElastycNet/clientweb-templates'

function Write-Log([string]$Message) {
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Add-Content -LiteralPath $LogFile -Value $line -Encoding utf8
}

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $out = & $GitExe -c "safe.directory=$SafeDir" @GitArgs 2>&1
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev
    $text = ($out | ForEach-Object { "$_" }) -join "`n"
    if ($text.Trim()) {
        Write-Log (("git {0}: {1}" -f ($GitArgs -join ' '), $text.Trim()))
    }
    if ($code -ne 0) {
        throw ("git {0} failed (exit {1})" -f ($GitArgs -join ' '), $code)
    }
    return $text
}

try {
    if (-not (Test-Path -LiteralPath 'W:\wwwroot\backup')) {
        New-Item -ItemType Directory -Path 'W:\wwwroot\backup' -Force | Out-Null
    }

    if (Test-Path -LiteralPath $LockFile) {
        $age = (Get-Date) - (Get-Item -LiteralPath $LockFile).LastWriteTime
        if ($age.TotalMinutes -lt 30) {
            Write-Log 'Skip: lock present (another sync running or stale < 30m).'
            exit 0
        }
        Remove-Item -LiteralPath $LockFile -Force -ErrorAction SilentlyContinue
    }
    Set-Content -LiteralPath $LockFile -Value $PID -Encoding ascii

    if (-not (Test-Path -LiteralPath $GitExe)) {
        throw "git.exe not found: $GitExe"
    }
    if (-not (Test-Path -LiteralPath $RepoRoot)) {
        throw "repo not found: $RepoRoot"
    }

    Set-Location -LiteralPath $RepoRoot

    Invoke-Git fetch origin main | Out-Null

    $local = (& $GitExe -c "safe.directory=$SafeDir" rev-parse HEAD).Trim()
    $remote = (& $GitExe -c "safe.directory=$SafeDir" rev-parse origin/main).Trim()

    if ($local -eq $remote) {
        Write-Log ("OK up-to-date {0}" -f $local.Substring(0, 7))
        exit 0
    }

    Write-Log ("Updating {0} -> {1}" -f $local.Substring(0, 7), $remote.Substring(0, 7))
    Invoke-Git reset --hard origin/main | Out-Null
    $after = (& $GitExe -c "safe.directory=$SafeDir" rev-parse HEAD).Trim()
    Write-Log ("Done HEAD={0}" -f $after.Substring(0, 7))
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
