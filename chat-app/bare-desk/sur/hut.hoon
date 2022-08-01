|%
+$  msg      [who=@p what=@t]
+$  msgs     (list msg)
+$  name     @tas
+$  hut      [=gid =name]
::
+$  huts     (jug gid name)
+$  msg-jar  (jar hut msg)
+$  joined   (jug hut @p)
::
+$  hut-act
  $%  [%make =hut]
      [%post =hut =msg]
      [%join =hut who=@p]
      [%quit =hut who=@p]
  ==
+$  hut-upd
  $%  [%init =hut ppl=(set @p) =msgs]
      hut-act
  ==
--
