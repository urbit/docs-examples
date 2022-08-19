/-  *hut
|_  u=hut-upd
++  grow
  |%
  ++  noun  u
  ++  json
    =,  enjs:format
    |^  ^-  ^json
    ?-    -.u
        %new
      %+  frond  'new'
      (pairs ~[['hut' (en-hut hut.u)] ['msgs' (en-msgs msgs.u)]])
    ::
        %post
      %+  frond  'post'
      (pairs ~[['hut' (en-hut hut.u)] ['msg' (en-msg msg.u)]])
    ::
        %join
      %+  frond  'join'
      (pairs ~[['gid' (en-gid gid.u)] ['who' s+(scot %p who.u)]])
    ::
        %quit
      %+  frond  'quit'
      (pairs ~[['gid' (en-gid gid.u)] ['who' s+(scot %p who.u)]])
    ::
        %del
      (frond 'del' (frond 'hut' (en-hut hut.u)))
    ::
        %init
      %+  frond  'init'
      %-  pairs
      :~  ['huts' (en-huts huts.u)]
          ['msgJar' (en-msg-jar msg-jar.u)]
          ['joined' (en-joined joined.u)]
      ==
    ::
        %init-all
      %+  frond  'initAll'
      %-  pairs
      :~  ['huts' (en-huts huts.u)]
          ['msgJar' (en-msg-jar msg-jar.u)]
          ['joined' (en-joined joined.u)]
      ==
    ==
    ++  en-joined
      |=  =joined
      ^-  ^json
      :-  %a
      %+  turn  ~(tap by joined)
      |=  [=gid =ppl]
      %-  pairs
      :~  ['gid' (en-gid gid)]
          :-  'ppl'
          a+(sort (turn ~(tap in ppl) |=(=@p s+(scot %p p))) aor)
      ==
    ++  en-msg-jar
      |=  =msg-jar
      ^-  ^json
      :-  %a
      %+  turn  ~(tap by msg-jar)
      |=  [=hut =msgs]
      (pairs ~[['hut' (en-hut hut)] ['msgs' (en-msgs msgs)]])
    ++  en-huts
      |=  =huts
      ^-  ^json
      :-  %a
      %+  turn  ~(tap by huts)
      |=  [=gid names=(set name)]
      %-  pairs
      :~  ['gid' (en-gid gid)]
          ['names' a+(turn (sort ~(tap in names) aor) (lead %s))]
      ==
    ++  en-msgs  |=(=msgs `^json`a+(turn (flop msgs) en-msg))
    ++  en-msg
      |=  =msg
      ^-  ^json
      (pairs ~[['who' s+(scot %p who.msg)] ['what' s+what.msg]])
    ++  en-hut
      |=  =hut
      ^-  ^json
      (pairs ~[['gid' (en-gid gid.hut)] ['name' s+name.hut]])
    ++  en-gid
      |=  =gid
      ^-  ^json
      (pairs ~[['host' s+(scot %p host.gid)] ['name' s+name.gid]])
    --
  --
++  grab
  |%
  ++  noun  hut-upd
  --
++  grad  %noun
--
