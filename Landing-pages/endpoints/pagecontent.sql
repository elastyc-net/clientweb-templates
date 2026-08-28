-- webtemplate: Landing-pages
-- pageid: pagecontent
-- exported from: _templatecomponents

2select     acckey,    
            case when '!QS!preview!QS!'='T' then fieldt10 else fieldt4 end as html,
            fieldt8 as js,
            case when '!QS!preview!QS!'='T' then fieldt11 else fieldt9 end as css,
            isnull(fieldt6,'') as htmlbefore , 
            fieldt7 as htmlafter, 
            field7, 
            field9,
            fieldt12 as meni
from _service where oddelek='21S01003767' and frontpage='!QS!pageid!QS!' and status<>'Odbačen'
order by casesort
