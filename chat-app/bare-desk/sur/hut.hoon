/-  *squad
|%
+$  msg      [who=@p what=@t]
+$  msgs     (list msg)
+$  name     @tas
+$  hut      [=gid =name]
::
+$  huts     (jug gid name)
+$  msg-jar  (jar hut msg)
+$  joined   (jug gid @p)
::
+$  hut-act
  $%  [%new =hut =msgs]
      [%post =hut =msg]
      [%join =gid who=@p]
      [%quit =gid who=@p]
      [%del =hut]
  ==
+$  hut-upd
  $%  [%init =huts =msg-jar =joined]
      [%init-all =huts =msg-jar =joined]
      hut-act
  ==
--
