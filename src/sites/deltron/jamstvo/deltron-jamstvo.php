<?php
/** Deltron-only adapter. Deploy only to the Deltron web root; no library registration. */
final class DeltronJamstvo
{
    const PROCESS = 'Prijava uređaja za jamstvo';
    const MAX_FILE = 8388608;
    private $con;
    public function __construct($con) { $this->con = $con; }
    private function query($sql, array $params = array())
    {
        $statement = sqlsrv_query($this->con, $sql, $params);
        if ($statement === false) { throw new RuntimeException('Jamstvo database operation failed.'); }
        return $statement;
    }
    private function rows($sql, array $params = array())
    {
        $statement = $this->query($sql, $params); $rows = array();
        while (($row = sqlsrv_fetch_array($statement, SQLSRV_FETCH_ASSOC)) !== null) {
            if ($row === false) { throw new RuntimeException('Jamstvo database result failed.'); }
            $rows[] = $row;
        }
        sqlsrv_free_stmt($statement); return $rows;
    }
    public function fields()
    {
        $rows = $this->rows("SELECT p.[key],p.naziv,p.tip,p.obavezno,p.tooltip,p.connectedfield,p.connectedfieldvalue,
            CONVERT(nvarchar(max),o.query) AS optionsJson FROM dbo._customformpoz p
            JOIN dbo._customform f ON f.id=p.id LEFT JOIN dbo._opisvrednostiform o ON o.opisid=p.id AND o.opispoz=p.poz
            WHERE f.naziv=? AND p.front='T' ORDER BY p.sort", array(self::PROCESS));
        if (count($rows) < 15 || count($rows) > 50) { throw new RuntimeException('Jamstvo schema unavailable.'); }
        $keys = array();
        foreach ($rows as &$row) {
            if (!preg_match('/^field[0-9]+$/D', $row['key']) || isset($keys[$row['key']])
                || !in_array($row['tip'], array('label','text','numeric','datum','file','select','checkbox'), true)
                || trim((string)$row['connectedfield']) !== '' || trim((string)$row['connectedfieldvalue']) !== '') {
                throw new RuntimeException('Jamstvo schema needs review.');
            }
            $keys[$row['key']] = true;
            if ($row['key'] === 'field1801') { $row['obavezno'] = 'T'; }
            if ($row['tip'] === 'select') {
                $options = json_decode($row['optionsJson'], true);
                if (!is_array($options) || !$options) { throw new RuntimeException('Jamstvo options unavailable.'); }
                $row['options'] = array();
                foreach ($options as $option) {
                    if (!isset($option['val'],$option['name']) || !is_string($option['val']) || !is_string($option['name'])) { throw new RuntimeException('Jamstvo options invalid.'); }
                    $row['options'][] = array('value'=>$option['val'],'label'=>$option['name']);
                }
            }
            unset($row['optionsJson']);
        }
        unset($row);
        foreach (array('field1324','field1330','field1331','field1801') as $required) {
            if (!isset($keys[$required])) { throw new RuntimeException('Jamstvo schema incomplete.'); }
        }
        return $rows;
    }
    public static function schemaHash(array $fields) { return hash('sha256',json_encode($fields,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)); }
    public function identity()
    {
        if (!empty($_COOKIE['elastyc_front_access']) || !empty($_COOKIE['elastyc_front_refresh'])) {
            $helper=__DIR__.'/incKomponente/auth/FrontAuthSession.php';
            if (!is_file($helper)) { throw new RuntimeException('Jamstvo session helper unavailable.'); }
            // The installed public helper verifies the isolated auth service's session.
            require_once $helper;
            $user=\Elastyc\FrontAuth\FrontAuthSession::resolve($this->con);
            if ($user!==null && ctype_digit((string)($user['userid']??'')) && (int)$user['userid']>0) { return (int)$user['userid']; }
            throw new DomainException('Vaša prijava je istekla. Prijavite se ponovo i sačuvajte unos.');
        }
        $rows = $this->rows('SELECT a.anonimous FROM dbo._el_appsettings a JOIN dbo._userspp u ON u.user_id=a.anonimous');
        if (count($rows) !== 1 || (int)$rows[0]['anonimous'] <= 0) { throw new RuntimeException('Jamstvo anonymous identity unavailable.'); }
        return (int)$rows[0]['anonimous'];
    }
    public function validate(array $fields, array $input, array $files)
    {
        $values = array(); $errors = array();
        foreach ($fields as $field) {
            $key = $field['key']; $type = $field['tip'];
            if ($type === 'label') { continue; }
            $value = $input[$key] ?? '';
            if (!is_string($value)) { $errors[$key]='Provjerite unos.'; continue; }
            $value = trim($value);
            if ($type === 'file') {
                $file = $files[$key] ?? null;
                if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                    if ($field['obavezno'] === 'T') { $errors[$key]='Priložite datoteku.'; }
                } elseif (!is_scalar($file['error']) || $file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])
                    || $file['size'] < 1 || $file['size'] > self::MAX_FILE) { $errors[$key]='Datoteka nije prenesena. Najveća veličina je 8 MB.'; }
                else {
                    $ext = strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));
                    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
                    $allowed = array('pdf'=>'application/pdf','jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png');
                    if (!isset($allowed[$ext]) || $allowed[$ext] !== $mime) { $errors[$key]='Priložite valjanu PDF, JPG ili PNG datoteku.'; }
                    elseif ($ext !== 'pdf' && @getimagesize($file['tmp_name']) === false) { $errors[$key]='Slika nije ispravna.'; }
                }
                // File names are assigned by this server after validation, never accepted from POST.
                $values[$key]=''; continue;
            }
            if (mb_strlen($value,'UTF-8') > 500 || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/',$value)
                || preg_match('/!(?:@|x|splitter)!/i',$value)) { $errors[$key]='Provjerite unos (najviše 500 znakova).'; }
            elseif ($field['obavezno']==='T' && ($value==='' || $type==='checkbox' && $value!=='T')) { $errors[$key]='Ovo polje je obavezno.'; }
            elseif ($value!=='' && $type==='numeric' && (!preg_match('/^\d{1,10}(?:\.\d{1,2})?$/D',$value))) { $errors[$key]='Unesite ispravnu cijenu.'; }
            elseif ($value!=='' && $type==='datum') {
                $date=DateTimeImmutable::createFromFormat('!Y-m-d',$value);
                if (!$date || $date->format('Y-m-d')!==$value || $value>date('Y-m-d')) { $errors[$key]='Provjerite datum kupnje.'; }
            } elseif ($value!=='' && $type==='select' && !in_array($value,array_column($field['options'],'value'),true)) { $errors[$key]='Odaberite dozvoljenu vrijednost.'; }
            elseif ($type==='checkbox' && !in_array($value,array('T','F'),true)) { $errors[$key]='Provjerite odabir.'; }
            if ($key==='field1330' && !filter_var($value,FILTER_VALIDATE_EMAIL)) { $errors[$key]='Unesite ispravnu email adresu.'; }
            if ($key==='field1331' && $value!=='') {
                try { $value=$this->phone($value); }
                catch (InvalidArgumentException $error) { $errors[$key]='Unesite ispravan kontakt broj.'; }
            }
            $values[$key]=$value;
        }
        return array('values'=>$values,'errors'=>$errors);
    }
    private function phone($value)
    {
        // Reuse the installed common vendor; do not require a newer registration package.
        if (!class_exists('libphonenumber\\PhoneNumberUtil')) {
            foreach (array(dirname(__DIR__,5).'/common','W:/wwwroot/ElastycNet/common') as $common) {
                $loader=$common.'/Elastyc/CaseForm/vendor/libphonenumber/autoload.php';
                if (is_file($loader)) { require_once $loader; break; }
            }
        }
        if (!class_exists('libphonenumber\\PhoneNumberUtil')) { throw new RuntimeException('Zajednicka validacija telefona nije dostupna.'); }
        if (strlen($value)>100 || !preg_match('/^[+0-9\s().-]+$/D',$value)) { throw new InvalidArgumentException('Provjerite kontakt broj.'); }
        try {
            $util=\libphonenumber\PhoneNumberUtil::getInstance();$number=$util->parse($value,'HR');
            if (!$util->isValidNumber($number)||$number->hasExtension()) { throw new InvalidArgumentException('Provjerite kontakt broj.'); }
            return $util->format($number,\libphonenumber\PhoneNumberFormat::E164);
        } catch (\libphonenumber\NumberParseException $error) { throw new InvalidArgumentException('Provjerite kontakt broj.'); }
    }
    /** Caller owns an outer transaction. Existing procedure, aftercase and custom rules stay intact. */
    public function create(array $fields, array $values, array $files, $userid, $sessionKey, array &$moved, $description = '')
    {
        $documents=array();
        foreach ($fields as $field) {
            $key=$field['key'];
            if ($field['tip']!=='file' || empty($files[$key]) || $files[$key]['error']===UPLOAD_ERR_NO_FILE) { continue; }
            $file=$files[$key]; $ext=strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));
            $filename='dynuploaded-jamstvo-'.bin2hex(random_bytes(20)).'.'.$ext;
            $path=__DIR__.'/docs/'.$filename;
            if (!move_uploaded_file($file['tmp_name'],$path)) { throw new RuntimeException('Jamstvo file storage failed.'); }
            $moved[]=$path; $values[$key]=$filename;
            $row=$this->rows('SELECT ISNULL(MAX(fileid),0)+1 AS nextid FROM dbo._docs WITH (TABLOCKX,HOLDLOCK)')[0];
            $title=mb_substr(pathinfo(basename($file['name']),PATHINFO_FILENAME),0,100,'UTF-8');
            $this->query("INSERT INTO dbo._docs (fileid,title,ext,size,uploader,doc,datum,oddelek,[field],keyfield,filename,[path])
                VALUES (?,?,?,?,?,'0',GETDATE(),?,?,?,?,'docs/')",array($row['nextid'],$title,$ext,(int)$file['size'],$userid,self::PROCESS,$key,$key,$filename));
            $documents[]=$filename;
        }
        $names=array();$encoded=array();
        foreach ($values as $key=>$value) {
            // Delimiter recipe used by New case front. A space preserves an empty slot on old SQL splitters.
            $names[]=$key; $encoded[]=($value===''?' ':str_replace(',','!@!',$value));
        }
        $statement=$this->query('EXEC dbo._el_client_newcase_newapp ?,?,?,?,?,?,?,?,?,?,?,?,?',array(self::PROCESS,$userid,$description,implode(',',$names),implode(',',$encoded),'F',$sessionKey,0,'','','','',''));
        $result=null;
        do {
            if (sqlsrv_num_fields($statement)>0) {
                while (($row=sqlsrv_fetch_array($statement,SQLSRV_FETCH_ASSOC))!==null) {
                    if ($row===false) { throw new RuntimeException('Jamstvo create result failed.'); }
                    if (isset($row['acckey'],$row['postid'])) { $result=$row; }
                }
            }
            $next=sqlsrv_next_result($statement);
            if ($next===false) { throw new RuntimeException('Jamstvo create failed.'); }
        } while ($next===true);
        if (!$result || !preg_match('/^[A-Za-z0-9]{1,30}$/D',$result['acckey'])) { throw new RuntimeException('Jamstvo create receipt unavailable.'); }
        foreach ($documents as $filename) { $this->query('UPDATE dbo._docs SET acckey=? WHERE filename=? AND oddelek=?',array($result['acckey'],$filename,self::PROCESS)); }
        // Verify every submitted field before committing: catches incompatible legacy splitter versions.
        $saved=$this->rows('SELECT nam,val FROM dbo._serviceform WHERE acckey=?',array($result['acckey']));
        $map=array();foreach($saved as $row){$map[$row['nam']]=$row['val'];}
        foreach($values as $key=>$value){if(!array_key_exists($key,$map)||trim((string)$map[$key])!==trim($value)){throw new RuntimeException('Jamstvo field persistence mismatch.');}}
        return array('ok'=>true,'acckey'=>$result['acckey'],'postid'=>(int)$result['postid']);
    }

    public function policy()
    {
        $path=__DIR__.'/incConn/deltron-jamstvo-live.php';
        clearstatcache(true,$path);
        if (!is_file($path)) { return false; }
        if (function_exists('opcache_invalidate')) { opcache_invalidate($path,true); }
        return require $path;
    }
    public static function trialAllowed($policy, $requestId, $email = null)
    {
        return is_array($policy) && ($policy['testOnly']??false)===true
            && is_string($requestId) && strlen($requestId)===48
            && is_string($policy['requestHash']??null)
            && hash_equals($policy['requestHash'],hash('sha256',$requestId))
            && is_int($policy['expires']??null) && $policy['expires']>=time() && $policy['expires']<=time()+1200
            && ($email===null || is_string($policy['email']??null) && strtolower(trim($policy['email']))===strtolower(trim($email)));
    }
    /** Same fixed post-create destinations as New case front. No browser-selected recipient/index. */
    public function complete(array $receipt, $userid, $transport = null)
    {
        if (!preg_match('/^[A-Za-z0-9]{1,30}$/D',$receipt['acckey']??'') || (int)($receipt['postid']??0)<1 || (int)$userid<1) {
            throw new InvalidArgumentException('Invalid trusted completion receipt.');
        }
        $transport = $transport ?: array($this,'http');
        $base='https://b2b.deltron.hr'; $errors=array();
        $context=array('acckey'=>$receipt['acckey'],'postid'=>(int)$receipt['postid'],'userid'=>(int)$userid);
        $states=array('email'=>'pending','push'=>'pending','index'=>'pending');
        try {
            $params=array_merge($context,array('action'=>'newkom','primalac'=>'T','strpath'=>$base.'/'));
            $response=call_user_func($transport,'POST',$base.'/mailgun/sendmail.aspx?'.http_build_query($params,'','&',PHP_QUERY_RFC3986),'','text/html');
            if ($response['status']!==200 || stripos(ltrim($response['body']),'Nije poslato')===0) { throw new RuntimeException('Legacy mail request failed.'); }
            // HTTP acceptance is not proof of arrival; the controlled mailbox trial remains required.
            $states['email']='requested';
        } catch (Throwable $error) { $errors[]='email'; }
        try {
            $response=call_user_func($transport,'GET',$base.'/mobile/getdeviceids.asp?'.http_build_query($context,'','&',PHP_QUERY_RFC3986),'','text/html');
            $parts=explode('|',$response['body']);
            if ($response['status']!==200 || count($parts)<3) { throw new RuntimeException('Legacy push lookup failed.'); }
            if (trim($parts[1])==='') { $states['push']='not-required'; }
            else {
                $body=http_build_query(array('regid'=>$parts[1],'title'=>$parts[0],'message'=>$parts[2],'acckey'=>$receipt['acckey'],'instance'=>$base.'/'),'','&',PHP_QUERY_RFC3986);
                $response=call_user_func($transport,'POST',$base.'/mobile/sendnotification.php',$body,'application/x-www-form-urlencoded');
                if ($response['status']!==200) { throw new RuntimeException('Legacy push request failed.'); }
                $states['push']='requested';
            }
        } catch (Throwable $error) { $errors[]='push'; }
        try {
            $body=json_encode(array('acckey'=>$receipt['acckey'],'instance'=>'deltron','nosql_aggstype'=>'Keyfield'));
            $response=call_user_func($transport,'POST',$base.'/elasticsearch-api/elasticsearch-insert.php',$body,'application/json');
            $result=json_decode($response['body'],true);
            if ($response['status']!==200 || !is_array($result) || isset($result['error']) || !in_array($result['result']??'',array('created','updated','noop'),true)) {
                throw new RuntimeException('Legacy index sync failed.');
            }
            $states['index']='synchronized';
        } catch (Throwable $error) { $errors[]='index'; }
        return array('states'=>$states,'errors'=>$errors);
    }
    private function http($method,$url,$body,$contentType)
    {
        if (!function_exists('curl_init')) { throw new RuntimeException('Jamstvo completion transport unavailable.'); }
        $handle=curl_init($url); $response='';
        curl_setopt_array($handle,array(CURLOPT_CUSTOMREQUEST=>$method,CURLOPT_FOLLOWLOCATION=>false,
            CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>15,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,
            CURLOPT_HTTPHEADER=>array('Content-Type: '.$contentType,'Accept: application/json, text/plain, */*'),
            CURLOPT_USERAGENT=>'Elastyc-Deltron-Warranty/1.0',
            CURLOPT_WRITEFUNCTION=>function($handle,$chunk)use(&$response){if(strlen($response)+strlen($chunk)>4194304)return 0;$response.=$chunk;return strlen($chunk);}));
        if($method==='POST'){curl_setopt($handle,CURLOPT_POSTFIELDS,$body);}
        $ok=curl_exec($handle);$status=(int)curl_getinfo($handle,CURLINFO_HTTP_CODE);curl_close($handle);
        if($ok===false){throw new RuntimeException('Jamstvo completion transport failed.');}
        return array('status'=>$status,'body'=>$response);
    }

}
if (PHP_SAPI === 'cli') { return; }
header('Content-Type: application/json; charset=UTF-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
function djReply(array $body,$status=200){http_response_code($status);echo json_encode($body,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
$transaction=false;$moved=array();
try {
    if (strtolower($_SERVER['HTTP_HOST']??'')!=='b2b.deltron.hr' || strtolower($_SERVER['SERVER_NAME']??'')!=='b2b.deltron.hr'
        || (strtolower($_SERVER['HTTPS']??'')!=='on' && ($_SERVER['SERVER_PORT']??'')!='443')) { djReply(array('ok'=>false),404); }
    $method=$_SERVER['REQUEST_METHOD']??'';
    if (!in_array($method,array('GET','POST'),true)) { header('Allow: GET, POST');djReply(array('ok'=>false),405); }
    if ($method==='POST' && ($_SERVER['HTTP_ORIGIN']??'')!=='https://b2b.deltron.hr') { djReply(array('ok'=>false),403); }
    ini_set('session.use_strict_mode','1');session_name('DELTRON_JAMSTVO');
    session_set_cookie_params(array('lifetime'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax'));
    if (!session_start()) { throw new RuntimeException('Jamstvo session unavailable.'); }
    require __DIR__.'/incConn/CreateConnection2.php';
    $adapter=new DeltronJamstvo($con);$fields=$adapter->fields();$schema=DeltronJamstvo::schemaHash($fields);
    if ($method==='GET') {
        if (empty($_SESSION['csrf'])) { $_SESSION['csrf']=bin2hex(random_bytes(32)); }
        if (empty($_SESSION['requestId']) || isset($_SESSION['receipt'])) {
            $_SESSION['requestId']=bin2hex(random_bytes(24));unset($_SESSION['receipt'],$_SESSION['pending']);
        }
        djReply(array('ok'=>true,'fields'=>$fields,'schemaHash'=>$schema,'csrf'=>$_SESSION['csrf'],'requestId'=>$_SESSION['requestId'],'trialAllowed'=>DeltronJamstvo::trialAllowed($adapter->policy(),$_SESSION['requestId'])));
    }
    foreach(array('csrf','schemaHash','requestId') as $key){if(!isset($_POST[$key])||!is_string($_POST[$key]))djReply(array('ok'=>false,'message'=>'Osvježite obrazac.'),400);}
    if(empty($_SESSION['csrf'])||!hash_equals($_SESSION['csrf'],$_POST['csrf'])||!hash_equals($_SESSION['requestId']??'',$_POST['requestId'])){djReply(array('ok'=>false,'message'=>'Obrazac je istekao. Sačuvajte unos i osvježite stranicu.'),403);}
    if(!hash_equals($schema,$_POST['schemaHash'])){djReply(array('ok'=>false,'message'=>'Definicija obrasca je promijenjena. Sačuvajte unos i osvježite stranicu.'),409);}
    if(isset($_SESSION['receipt'])){djReply($_SESSION['receipt']);}
    if(!empty($_SESSION['pending'])){djReply(array('ok'=>false,'message'=>'Prethodna prijava se provjerava. Nemojte slati novu prijavu; kontaktirajte Deltron radi provjere ishoda.'),409);}
    $checked=$adapter->validate($fields,$_POST,$_FILES);
    if($checked['errors']){djReply(array('ok'=>false,'fields'=>$checked['errors'],'message'=>'Provjerite označena polja.'),422);}
    $userid=$adapter->identity();
    // Separate operator activation after Candidate review and a controlled end-to-end trial.
    // No public request can enable live writes. The flag is intentionally absent in this delivery.
    $policy=$adapter->policy();
    $testOnly=DeltronJamstvo::trialAllowed($policy,$_SESSION['requestId'],$checked['values']['field1330']??'');
    if($policy!==true&&!$testOnly){djReply(array('ok'=>false,'message'=>'Nova forma još nije otvorena za slanje. Koristite postojeću stranicu Produljeno jamstvo.'),503);}
    $_SESSION['pending']=true;
    if(!session_write_close()||!session_start()){throw new RuntimeException('Jamstvo receipt store unavailable.');}
    if(!sqlsrv_begin_transaction($con)){throw new RuntimeException('Jamstvo transaction unavailable.');}$transaction=true;
    $receipt=$adapter->create($fields,$checked['values'],$_FILES,$userid,session_id(),$moved,$testOnly?'TEST WEBFRONT — kontrolisana prijava; nije stvarni zahtjev za jamstvo.':'');
    $committed=sqlsrv_commit($con);$transaction=false;
    if(!$committed){throw new RuntimeException('Jamstvo commit outcome uncertain.');}
    $requestId=$_SESSION['requestId'];
    $receipt['followup']=array('states'=>array('email'=>'pending','push'=>'pending','index'=>'pending'),'errors'=>array());
    $_SESSION['receipt']=$receipt;unset($_SESSION['pending']);
    $stored=session_write_close();
    if(!$stored){error_log('[deltron-jamstvo] receipt persistence needs operator review');}
    // The durable case receipt precedes external requests. A repeated POST never sends them again.
    $receipt['followup']=$adapter->complete($receipt,$userid);
    if($receipt['followup']['errors']){error_log('[deltron-jamstvo] completion needs operator review: '.implode(',',$receipt['followup']['errors']));}
    if($stored&&session_start()){
        if(($_SESSION['requestId']??'')===$requestId){$_SESSION['receipt']=$receipt;}
        session_write_close();
    }
    djReply($receipt);
} catch (DomainException $error) {
    djReply(array('ok'=>false,'message'=>$error->getMessage()),401);
} catch (Throwable $error) {
    if($transaction){sqlsrv_rollback($con);foreach($moved as $path){@unlink($path);}unset($_SESSION['pending']);}
    error_log('[deltron-jamstvo] request failed: '.get_class($error));
    djReply(array('ok'=>false,'message'=>'Prijavu nije moguće završiti. Sačuvan je unos; provjerite ishod prije ponovnog slanja.'),503);
}
