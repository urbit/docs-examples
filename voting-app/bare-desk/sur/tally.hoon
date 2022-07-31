/-  *ring, *squad
/+  *mip
|%
+$  pid  @
+$  poll
  $:  creator=@p
      proposal=@t
      expiry=@da
      =gid
      =ring-group
  ==
+$  vote  (pair ? raw-ring-signature)
+$  votes  (map @udpoint vote)
::
+$  by-group  (mip gid pid [=poll =votes])
::
+$  action
  $%  [%new proposal=@t days=@ud =gid]
      [%vote =gid =pid =vote]
      [%watch =gid]
      [%leave =gid]
      [%withdraw =gid =pid]
  ==
+$  update
  $%  [%init polls=(map pid [=poll =votes])]
      [%vote =pid =vote]
      [%new =pid =poll]
      [%withdraw =pid]
  ==
--
