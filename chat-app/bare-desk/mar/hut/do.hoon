/-  *hut
|_  a=hut-act
++  grow
  |%
  ++  noun  a
  --
++  grab
  |%
  ++  noun  hut-act
  ++  json
    =,  dejs:format
    |^  ^-  hut-act
    %-  of
    :~  new+(ot ~[hut+de-hut msgs+(ar de-msg)])
        post+(ot ~[hut+de-hut msg+de-msg])
        join+(ot ~[gid+de-gid who+(se %p)])
        quit+(ot ~[gid+de-gid who+(se %p)])
        del+(ot ~[hut+de-hut])
    ==
    ++  de-msg  (ot ~[who+(se %p) what+so])
    ++  de-hut  (ot ~[gid+de-gid name+(se %tas)])
    ++  de-gid  (ot ~[host+(se %p) name+(se %tas)])
    --
  --
++  grad  %noun
--
