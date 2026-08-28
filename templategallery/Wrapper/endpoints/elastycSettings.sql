-- webtemplate: Wrapper
-- pageid: elastycSettings
-- exported from: _templatecomponents

2
select 
	/*ecommerce.field41 as samoUlogKorDodUKorp,*/
	ecommerce.field45 as dodavanjeProizvodaUKorpu,
	katalog.field15 as prikazCenaNaKatalogu,
	katalog.field14 as prikazOcenaNaKatalogu
from _el_def_data_23S01003744 ecommerce, _el_def_data_23S01001212 katalog
