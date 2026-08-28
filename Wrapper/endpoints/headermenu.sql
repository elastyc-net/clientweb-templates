-- webtemplate: Wrapper
-- pageid: headermenu
-- exported from: _templatecomponents

2with Parents(id, [text],naziv2, tip, nivo , parent, sort, templateid,classes, megamenuimage, megamenugroup, megamenutype, megamenuhtml ,megamenubcgclr , megamenufontclr, linkurl)
	As(
	  Select stranaid as id, naziv as [text], replace(naziv,' ','_') as naziv2,case when nivo=5 then '' else tip end as tip, nivo , case when parentid='!QQ!menuParentid!QQ!' then '' else parentid end as parent, sort, templateid,
	  isnull(classes,'') as classes, 
	  isnull(megamenuimage,'') as megamenuimage,
	  isnull(megamenugroup,'') as megamenugroup,
	  isnull(megamenutype,'') as megamenutype,
	  isnull(megamenuhtml,'') as megamenuhtml,
	  isnull(megamenubcgclr,'') as megamenubcgclr,
	  isnull(megamenufontclr,'') as megamenufontclr,
	  isnull(linkurl,'') as linkurl
	  From _sitestruct
	  Where parentid = '!QQ!menuParentid!QQ!' 
	  Union All
	  Select p.stranaid as id, p.naziv as [text], replace(p.naziv,' ','_') as naziv2,case when p.nivo=5 then '' else p.tip end as tip, p.nivo , p.parentid as parent, p.sort, p.templateid,
	  isnull(p.classes,''),
	  isnull(p.megamenuimage,''),
	  isnull(p.megamenugroup,''),
	  isnull(p.megamenutype,''),
	  isnull(p.megamenuhtml,''),
	  isnull(p.megamenubcgclr,''),
	  isnull(p.megamenufontclr,''),
	  isnull(p.linkurl,'')
	  From _sitestruct p
	  Join Parents cte On cte.id = p.ParentId
	)
	Select Parents.*,(select replace(naziv,' ','_') from _templates where templateid=Parents.templateid) as template
	From Parents 
 	where ((id in (select menuid from _webusergroupmenu where usergroup='!QQ!usergroup!QQ!' and allowed='T')) or '!QQ!usertype!QQ!'='U')  order by nivo,sort
