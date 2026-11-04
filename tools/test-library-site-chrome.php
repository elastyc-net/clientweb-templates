<?php
require_once __DIR__.'/../../instance-template/webfront-tree-bridge.php';
use Elastyc\Webfront\Admin\DraftPreviewRenderer;
use Elastyc\Webfront\Deployment\WorkspaceInitializer;
use Elastyc\Webfront\Package\LibraryCatalog;
use Elastyc\Webfront\Composition\CompositionGraphValidator;
function chromeCheck($ok,$message){if(!$ok)throw new RuntimeException($message);echo 'ok '.$message.PHP_EOL;}
$loader=new LibraryCatalog();$catalog=$loader->load(__DIR__.'/../packages');$package=$loader->latest($catalog,'starter-site');
$base=WorkspaceInitializer::package('site-chrome','chrome.example');$items=[];
foreach($base['items'] as $i)$items[$i['itemType'].':'.$i['itemKey']]=$i;
foreach($package['items'] as $i)$items[$i['itemType'].':'.$i['itemKey']]=['itemType'=>$i['itemType'],'itemKey'=>$i['itemKey'],'definition'=>$i['definition']];
$fixture=json_decode(file_get_contents(__DIR__.'/../../instance-template/webfront/Fixtures/component-contracts/site.json'),true);
$items['site-config:site']['definition']['theme']=$fixture['theme'];
$snapshot=['siteKey'=>$base['siteKey'],'items'=>array_values($items)];
$page=treeBridgePagePlan($snapshot,'starter-home','CH01','Početna')[0];$snapshot['items'][]=$page;
$renderer=new DraftPreviewRenderer();
foreach(['left','center','below','shop'] as $header){foreach(['simple','columns','contact'] as $footer){
 foreach($snapshot['items'] as &$i){
  if($i['itemType']!=='global-section')continue;
  if($i['itemKey']==='starter-site-header')$i['definition']['instance']=['instanceKey'=>'starter-site-header','componentKey'=>'starter-header-visual','settings'=>['variant'=>$header,'home-url'=>'/','links'=>[['label'=>'Katalog & ponuda','url'=>'/katalog']]],'slots'=>['actions'=>[['instanceKey'=>'shop-account','componentKey'=>'account-menu','settings'=>['label'=>'Prijava','account-url'=>'/nalog','avatar-text'=>'N']],['instanceKey'=>'shop-cart','componentKey'=>'cart-summary','settings'=>['label'=>'Korpa','cart-url'=>'/korpa','item-count'=>0]]]]];
  if($i['itemKey']==='starter-site-footer')$i['definition']['instance']=['instanceKey'=>'starter-site-footer','componentKey'=>'starter-footer-visual','settings'=>['variant'=>$footer,'note'=>'Sačuvan tekst','contact'=>"Kontakt\nAdresa",'links'=>[]]];
 }unset($i);
 (new CompositionGraphValidator())->validate($base['siteKey'],$snapshot['items']);
 $html=$renderer->render($snapshot,$page['itemKey'])['html'];
 chromeCheck(strpos($html,'data-variant="'.$header.'"')!==false&&strpos($html,'data-variant="'.$footer.'"')!==false,'renders header '.$header.' / footer '.$footer);
 chromeCheck(strpos($html,'href="/nalog"')!==false&&strpos($html,'shop-cart')!==false,'renders nested header actions with existing contracts');
 chromeCheck(strpos($html,'Katalog &amp; ponuda')!==false&&strpos($html,'Sačuvan tekst')!==false&&strpos($html,'alt="Elastyc"')!==false,'inherits central logo and escapes preserved content');
}}
// Original source releases stay exact; the new release adds definitions only.
$old=array_values(array_filter($catalog['packages'],function($p){return $p['packageKey']==='starter-site'&&$p['version']==='1.0.0';}))[0];
foreach($old['items'] as $oldItem){$match=array_values(array_filter($package['items'],function($i)use($oldItem){return $i['itemType']===$oldItem['itemType']&&$i['itemKey']===$oldItem['itemKey'];}));chromeCheck(count($match)===1&&($oldItem['itemKey']==='starter-layout'||$match[0]['sha256']===$oldItem['sha256']),'unchanged old item '.$oldItem['itemKey']);}
$layout=array_values(array_filter($package['items'],function($i){return $i['itemType']==='layout';}))[0]['definition'];
chromeCheck(strpos($layout['styles'][0]['content'],'.wfs-site img{max-width:100%;height:auto}')===false,'starter shell no longer overrides catalog image heights');
echo "PASS site chrome source, twelve layouts, central logo, content preservation\n";
