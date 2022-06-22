/+  *mip
|%
+$  msg    [who=@p what=@t]
+$  msgs   (list msg)
+$  hut    [host=@p name=@tas]
+$  huts   (jar hut msg)
+$  ppl    (mip hut @p ?)
+$  act
  $%  [%make =hut]
      [%post =hut =msg]
      [%ship =hut who=@p]
      [%kick =hut who=@p]
      [%join =hut]
      [%quit =hut]
  ==
+$  upd
  $%  [%init ppl=(map @p ?) =msgs]
      [%post =msg]
      [%ship who=@p]
      [%kick who=@p]
      [%join who=@p]
      [%quit who=@p]
  ==
--
