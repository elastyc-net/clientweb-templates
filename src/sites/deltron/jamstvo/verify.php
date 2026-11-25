<?php
/** CLI-only definition checks. Requires the installed engine, never creates a case. */
if (PHP_SAPI!=='cli') { http_response_code(404);exit; }
$root=$argv[1]??dirname(__DIR__,5).'/instance-template';
require $root.'/webfront/bootstrap.php';
$manifest=json_decode(file_get_contents(__DIR__.'/draft-manifest.json'),true);
$validator=new \Elastyc\Webfront\Workspace\WorkspaceDefinitionValidator();
foreach($manifest['items'] as $item){$definition=json_decode(file_get_contents(__DIR__.'/'.$item['file']),true);$validator->validate($item['itemType'],$item['itemKey'],$definition);}
require __DIR__.'/deltron-jamstvo.php';
$fields=json_decode(file_get_contents(__DIR__.'/preview-fields.json'),true);$adapter=new DeltronJamstvo(null);
$test=$adapter->validate($fields,array('field1330'=>'broken','field1801'=>'F'),array());
foreach(array('field1324','field1330','field1801') as $key){if(empty($test['errors'][$key]))throw new RuntimeException('Missing validation: '.$key);}
$test=$adapter->validate($fields,array('field1322'=>array('bad'),'field1336'=>'Unknown','field1321'=>'2026-02-31','field1348'=>'-10','field1801'=>'T'),array());
foreach(array('field1322','field1336','field1321','field1348') as $key){if(empty($test['errors'][$key]))throw new RuntimeException('Missing validation: '.$key);}
$id=str_repeat('a',48);$policy=array('testOnly'=>true,'requestHash'=>hash('sha256',$id),'expires'=>time()+600,'email'=>'test@example.invalid');
if(!DeltronJamstvo::trialAllowed($policy,$id,'test@example.invalid')||DeltronJamstvo::trialAllowed($policy,str_repeat('b',48),'test@example.invalid')||DeltronJamstvo::trialAllowed($policy,$id,'other@example.invalid'))throw new RuntimeException('Trial scope failed');
$policy['expires']=time()-1;if(DeltronJamstvo::trialAllowed($policy,$id))throw new RuntimeException('Expired trial accepted');
// Exercise the installed shared verifier contract, with no network calls or real keys.
$protectionCalls=0;
$config=array('siteKey'=>'unit-public','secretKey'=>'unit-secret','hostnames'=>array('b2b.deltron.hr'));
$success=array('success'=>true,'hostname'=>'b2b.deltron.hr','action'=>'case-form','cdata'=>'deltron-jamstvo');
$makeGuard=function($reply)use($config,&$protectionCalls){
 return new \Elastyc\Webfront\Adapter\CaseForm\CaseFormProtection($config,null,function($payload)use($reply,&$protectionCalls){
  $protectionCalls++;if(($payload['secret']??'')!=='unit-secret'||($payload['response']??'')!=='proof')throw new RuntimeException('Protection input changed');
  return $reply;
 });
};
$guard=$makeGuard($success);$public=$adapter->protectionConfig(-1,$guard);
if(($public['required']??false)!==true||$public['provider']!=='turnstile'||$public['action']!=='case-form'||$public['formKey']!=='deltron-jamstvo'||strpos(json_encode($public),'unit-secret')!==false)throw new RuntimeException('Unsafe public protection config');
$rejectProtection=function($expected,$guard,$proof)use($adapter){
 try{$adapter->verifyProtection(-1,$proof,$guard);}catch(\Elastyc\Webfront\Adapter\CaseForm\CaseFormException $e){if($e->getStatus()===$expected)return;throw $e;}
 throw new RuntimeException('Unverified anonymous submission accepted');
};
foreach(array('',array('proof'),str_repeat('x',2049)) as $proof)$rejectProtection(422,$guard,$proof);
if($protectionCalls!==0)throw new RuntimeException('Malformed token reached provider');
$adapter->verifyProtection(-1,'proof',$guard);if($protectionCalls!==1)throw new RuntimeException('Valid proof not verified');
foreach(array(array('success'=>false),array_merge($success,array('hostname'=>'other.invalid')),array_merge($success,array('action'=>'login')),array_merge($success,array('cdata'=>'other-form'))) as $bad)$rejectProtection(422,$makeGuard($bad),'proof');
$unavailable=new \Elastyc\Webfront\Adapter\CaseForm\CaseFormProtection();$rejectProtection(503,$unavailable,'proof');
$offline=new \Elastyc\Webfront\Adapter\CaseForm\CaseFormProtection($config,null,function(){throw new RuntimeException('offline');});$rejectProtection(503,$offline,'proof');
$beforeCalls=$protectionCalls;$adapter->verifyProtection(15,'',$guard);if($protectionCalls!==$beforeCalls||$adapter->protectionConfig(15,$unavailable)!==array('required'=>false))throw new RuntimeException('Verified account challenged as guest');
$phoneCheck=$adapter->validate($fields,array('field1330'=>'test@example.invalid','field1331'=>'+385912345678','field1801'=>'T'),array());
if(isset($phoneCheck['errors']['field1331'])||$phoneCheck['values']['field1331']!=='+385912345678')throw new RuntimeException('Shared phone normalization failed');
$phoneCheck=$adapter->validate($fields,array('field1331'=>'invalid'),array());if(empty($phoneCheck['errors']['field1331']))throw new RuntimeException('Invalid phone accepted');
$calls=array();
$transport=function($method,$url,$body,$contentType)use(&$calls){
 $calls[]=array($method,$url,$body,$contentType);
 if(strpos($url,'/sendmail.php?')!==false)return array('status'=>200,'body'=>'OK');
 if(strpos($url,'/mobile/getdeviceids.asp?')!==false)return array('status'=>200,'body'=>'Test title|test-device-token|Test message');
 if(strpos($url,'/mobile/sendnotification.php')!==false)return array('status'=>200,'body'=>'OK');
 if(strpos($url,'/elasticsearch-api/elasticsearch-insert.php')!==false)return array('status'=>200,'body'=>'{"result":"created"}');
 throw new RuntimeException('Unexpected completion destination');
};
$done=$adapter->complete(array('acckey'=>'TESTONLY','postid'=>123),1650,$transport);
if($done['errors']||$done['states']['index']!=='synchronized'||count($calls)!==4)throw new RuntimeException('Completion contract failed');
foreach($calls as $call){if(strpos($call[1],'https://b2b.deltron.hr/')!==0)throw new RuntimeException('Wrong completion host');}
parse_str(parse_url($calls[0][1],PHP_URL_QUERY),$mailQuery);if(($mailQuery['userid']??'')!=='-1'||($mailQuery['action']??'')!=='newpost')throw new RuntimeException('Legacy public recipient dispatch changed');
$index=json_decode($calls[3][2],true);
if($index!==array('acckey'=>'TESTONLY','instance'=>'deltron','nosql_aggstype'=>'Keyfield'))throw new RuntimeException('Wrong fixed index input');
$optional=$adapter->complete(array('acckey'=>'TESTONLY','postid'=>123),-1,function($method,$url){
 if(strpos($url,'getdeviceids.asp')!==false)return array('status'=>404,'body'=>'Not installed');
 return array('status'=>200,'body'=>strpos($url,'elasticsearch-insert.php')!==false?' {"result":"updated"}':'OK');
});
if($optional['errors']||$optional['states']['push']!=='not-configured')throw new RuntimeException('Absent optional push blocked intake');
$done=$adapter->complete(array('acckey'=>'TESTONLY','postid'=>123),1650,function(){return array('status'=>503,'body'=>'Unavailable');});
if(count($done['errors'])!==3)throw new RuntimeException('Completion failures were hidden');
echo "7 native definitions, server field/anonymous Turnstile guards and mocked legacy mail/push/index contracts passed; no external delivery.\n";
