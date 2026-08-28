-- webtemplate: Wrapper
-- pageid: reloadbasket
-- exported from: _templatecomponents

2
select
	b.ident,
	b.kol,
	round(b.cena, 4, 1) as netoCena,
	b.rabat,
	round(b.cena, 4, 1) * (100 - b.rabat)/100 as cenaSaRabatom,
	cast(m.davek as int) as PDV,
	b.netocena cenaSaPDV,
	b.netocena * b.kol as zaPlacanje,
	s.field28 as naz,
	REPLACE(ISNULL(b.serialno, ''), 'undefined', '') as serijskibr,
	s.fieldt8 as slika,
	s.field11 as brend,
	s.acckey
from _b2cbasket b, _service s, ms m
	where (( '!QS!userid!QS!' = '-1' and b.sessionid = '!QQ!sessionid!QQ!' and b.userid = '!QS!userid!QS!' ) or ( '!QS!userid!QS!' <> '-1' and b.userid = '!QS!userid!QS!' )) 
	AND m.IDENT = b.IDENT AND b.IDENT <> '' and s.oddelek = '21S01002971' and s.field1 = b.ident order by b.sort
