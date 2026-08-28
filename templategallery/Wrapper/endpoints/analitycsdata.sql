-- webtemplate: Wrapper
-- pageid: analitycsdata
-- exported from: _templatecomponents

2INSERT INTO  _el_web_analitycs (pageid, [date], [source], userid, usergroup, sessionid,acckey)
values ('!QS!pageid!QS!', FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss.fff') ,'!QS!source!QS!','!QS!userid!QS!', '!QS!usergroup!QS!', '!QS!sessionid!QS!','!QS!acckey!QS!')
