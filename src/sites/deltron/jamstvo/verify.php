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
echo "7 native definitions and required/file/email/consent/date/price/option/server input guards passed.\n";
