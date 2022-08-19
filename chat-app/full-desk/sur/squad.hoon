|%
+$  gid  [host=@p name=@tas]
+$  title  @t
+$  ppl  (set @p)
+$  squad  [=title pub=?]
::
+$  squads  (map gid squad)
+$  acls  (jug gid @p)
+$  members  (jug gid @p)
::
+$  act
  $%  [%new =title pub=?]
      [%del =gid]
      [%allow =gid =ship]
      [%kick =gid =ship]
      [%join =gid]
      [%leave =gid]
      [%pub =gid]
      [%priv =gid]
      [%title =gid =title]
  ==
+$  upd
  $%  [%init-all =squads =acls =members]
      [%init =gid =squad acl=ppl =ppl]
      [%del =gid]
      [%allow =gid =ship]
      [%kick =gid =ship]
      [%join =gid =ship]
      [%leave =gid =ship]
      [%pub =gid]
      [%priv =gid]
      [%title =gid =title]
  ==
::
+$  page  [sect=@t gid=(unit gid) success=?]
--
