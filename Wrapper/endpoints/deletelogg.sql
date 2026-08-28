-- webtemplate: Wrapper
-- pageid: deletelogg
-- exported from: _templatecomponents

2
DECLARE @deletedSort INT

SELECT @deletedSort = sort
FROM _b2cbasket
WHERE (('!QS!userid!QS!' = '-1' AND sessionid = '!QQ!sessionid!QQ!')
       OR ('!QS!userid!QS!' <> '-1' AND userid = '!QS!userid!QS!'))
  AND ident = '!QS!ident!QS!'
  AND serialno = '!QS!serialno!QS!'

DELETE FROM _b2cbasket
WHERE (('!QS!userid!QS!' = '-1' AND sessionid = '!QQ!sessionid!QQ!')
       OR ('!QS!userid!QS!' <> '-1' AND userid = '!QS!userid!QS!'))
  AND ident = '!QS!ident!QS!'
  AND serialno = '!QS!serialno!QS!'

IF @deletedSort IS NOT NULL
BEGIN
    UPDATE _b2cbasket
    SET sort = sort - 1
    WHERE (('!QS!userid!QS!' = '-1' AND sessionid = '!QQ!sessionid!QQ!')
           OR ('!QS!userid!QS!' <> '-1' AND userid = '!QS!userid!QS!'))
      AND sort > @deletedSort
END
