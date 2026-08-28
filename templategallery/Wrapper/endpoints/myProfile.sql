-- webtemplate: Wrapper
-- pageid: myProfile
-- exported from: _templatecomponents

2select
    displayname,
    CASE
        WHEN CHARINDEX(' ', displayname) > 0 THEN
            LEFT(displayname, CHARINDEX(' ', displayname) - 1) +
            ' ' +
            LEFT(SUBSTRING(displayname, CHARINDEX(' ', displayname) + 1, LEN(displayname)), 1) +
            '.'
        ELSE displayname
    END AS modified_displayname,
    CASE
        WHEN CHARINDEX(' ', displayname) > 0 THEN
            LEFT(displayname, 1) +
            LEFT(SUBSTRING(displayname, CHARINDEX(' ', displayname) + 1, LEN(displayname)), 1)
        ELSE displayname
    END AS initials,
    profileimage
FROM _userspp
WHERE user_id = '!QQ!userid!QQ!'
