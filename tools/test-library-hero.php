<?php
// Integration test against the real sibling engine, without a second design copy.
require_once __DIR__ . '/../../instance-template/webfront-tree-bridge.php';

use Elastyc\Webfront\Admin\DraftPreviewRenderer;
use Elastyc\Webfront\Composition\CompositionGraphValidator;
use Elastyc\Webfront\Deployment\WorkspaceInitializer;
use Elastyc\Webfront\Package\LibraryCatalog;
use Elastyc\Webfront\Package\LibraryPlanner;
use Elastyc\Webfront\Package\LibraryReceipt;
use Elastyc\Webfront\Support\Json;

function heroCheck($name, $ok) {
    if (!$ok) throw new RuntimeException('FAIL ' . $name);
    echo 'ok ' . $name . PHP_EOL;
}
$loader = new LibraryCatalog();
$catalog = $loader->load(__DIR__ . '/../packages');
$package = $loader->latest($catalog, 'hero-sections');
$initial = WorkspaceInitializer::package('site-hero', 'hero.example');
// Reproduce an older tenant which has not installed the now-bundled Hero package.
$heroTokens=array_fill_keys(array_map(function($i){return $i['itemType'].':'.$i['itemKey'];},$package['items']),true);
$initial['items']=array_values(array_filter($initial['items'],function($i)use($heroTokens){return !isset($heroTokens[$i['itemType'].':'.$i['itemKey']]);}));
$initial['items'][0]['definition']['libraryPackages']=array_values(array_filter($initial['items'][0]['definition']['libraryPackages'],function($r){return $r['packageKey']!=='hero-sections';}));
$snapshot = array('siteKey' => $initial['siteKey'], 'items' => $initial['items']);
foreach ($snapshot['items'] as &$item) $item['draftRevision'] = 1;
unset($item);
$snapshot['snapshotHash'] = hash('sha256', Json::encodeCanonical($snapshot['items']));
$receipts = LibraryReceipt::read($snapshot['items'][0]['definition']);
$oldPage = treeBridgePagePlan($snapshot, 'starter-home', 'H01', 'Sačuvan naslov')[0];
$oldPage['draftRevision'] = 1;
$snapshot['items'][] = $oldPage;
$snapshot['snapshotHash'] = hash('sha256', Json::encodeCanonical($snapshot['items']));
$before = serialize($snapshot);
$planner = new LibraryPlanner();
$plan = $planner->plan($package, $snapshot, $receipts);
heroCheck('Hero installs as two new definitions without replacing pages or text heroes',
    $plan['canApply'] && array_column($plan['entries'], 'action') === array('create', 'create')
    && serialize($snapshot) === $before);
foreach ($plan['entries'] as $entry) $snapshot['items'][] = array('itemType' => $entry['itemType'],
    'itemKey' => $entry['itemKey'], 'definition' => $entry['definition'], 'draftRevision' => 1);
$page = treeBridgePagePlan($snapshot, 'hero-visual-page', 'H02', 'Hero sa slikom')[0];
$page['draftRevision'] = 1;
$snapshot['items'][] = $page;
(new CompositionGraphValidator())->validate($snapshot['siteKey'], $snapshot['items']);
$renderer = new DraftPreviewRenderer();
$html = $renderer->render($snapshot, $page['itemKey'])['html'];
heroCheck('complete Hero renders title, CTA and a clear image placeholder',
    strpos($html, 'Predstavite ono što vas izdvaja.') !== false
    && strpos($html, 'Saznajte više') !== false
    && strpos($html, 'Izaberite sliku u podešavanjima komponente.') !== false
    && strpos($html, 'data-wf-image-setting="image-url"') !== false
    && strpos($html, '{{setting:') === false);
$pageIndex = count($snapshot['items']) - 1;
$settings = &$snapshot['items'][$pageIndex]['definition']['regions']['main'][0]['settings'];
$settings['image-url'] = '/webfront-assets/media/hero-test.webp';
$settings['image-alt'] = 'Primer "slike" & detalji';
$settings['title'] = '<script>ne izvršavati</script>';
$html = $renderer->render($snapshot, $page['itemKey'])['html'];
heroCheck('chosen image and alt render through existing escaped media settings',
    strpos($html, 'src="/webfront-assets/media/hero-test.webp"') !== false
    && strpos($html, 'alt="Primer &quot;slike&quot; &amp; detalji"') !== false
    && strpos($html, '&lt;script&gt;ne izvršavati&lt;/script&gt;') !== false
    && strpos($html, '<script>ne izvršavati</script>') === false);
unset($settings);
$oldHtml = $renderer->render($snapshot, $oldPage['itemKey'])['html'];
heroCheck('existing text Hero page keeps rendering without new required settings',
    strpos($oldHtml, 'wfs-hero') !== false && strpos($oldHtml, 'wfh-hero__inner') === false);
$snapshot['snapshotHash'] = hash('sha256', Json::encodeCanonical($snapshot['items']));
$repeat = $planner->plan($package, $snapshot, array_merge($receipts, array($plan['receipt'])));
heroCheck('same version is a no-op even with local page image and text changes',
    $repeat['canApply'] && array_column($repeat['entries'], 'action') === array('unchanged', 'unchanged'));
echo "PASS Hero source, compatibility, render and package receipt integration\n";
