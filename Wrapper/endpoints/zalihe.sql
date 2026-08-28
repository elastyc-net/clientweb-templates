-- webtemplate: Wrapper
-- pageid: zalihe
-- exported from: _templatecomponents

2
select acIdent, sum(anStock) as anStock from the_stock where acident in (select Val from dbo.SplitString('!QS!identi!QS!', ',')) and acWarehouse in (select Val from dbo.SplitString('!QS!skladistaString!QS!', ',')) group by acIdent
