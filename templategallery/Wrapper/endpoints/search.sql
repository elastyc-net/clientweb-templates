-- webtemplate: Wrapper
-- pageid: search
-- exported from: _templatecomponents

2select top 50 
    acckey,
    ident,
    field28 as SEO_title,
    field2 as naziv,
    replace(fieldt8,'images/artikli','images/artikli/thumb') as slika,
    field8 as grupa,
    isnull(fieldn6 , '') as cena
from _service 
where
#serchterm#
    oddelek='!QS!oddelek!QS!'
    and status = 'Aktivan'
