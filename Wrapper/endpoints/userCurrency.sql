-- webtemplate: Wrapper
-- pageid: userCurrency
-- exported from: _templatecomponents

2select acCurrency as valuta from tHE_SetSubj where acSubject = ( select naziv from _userspp where user_id = '!QQ!userid!QQ!' )
