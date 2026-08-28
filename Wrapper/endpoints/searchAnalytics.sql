-- webtemplate: Wrapper
-- pageid: searchAnalytics
-- exported from: _templatecomponents

2
declare @client nvarchar(30)
set @client = (select naziv from _userspp where user_id = '!QQ!userid!QQ!')
set nocount on
insert into _el_search_logs (term, userID, client, IPadress, city, region, country, userAgent, browser, device, os, timestamp)
values ('!QS!term!QS!', '!QS!userID!QS!', @client, '!QS!IPadress!QS!', '!QS!city!QS!', '!QS!region!QS!', '!QS!country!QS!', '!QS!userAgent!QS!', '!QS!browser!QS!', '!QS!device!QS!', '!QS!os!QS!', GETDATE())
select @client as client, GETDATE() as timestamp
