/-  *hut
/+  *mip, default-agent, dbug, agentio
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 =huts =ppl]
+$  card  card:agent:gall
--
::
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  bol=bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bol)
    io    ~(. agentio bol)
++  on-init  on-init:def
++  on-save  !>(state)
++  on-load
  |=  old-vase=vase
  ^-  (quip card _this)
  [~ this(state !<(state-0 old-vase))]
::
++  on-poke
  |=  [=mark =vase]
  |^  ^-  (quip card _this)
  ?>  ?=(%hut-do mark)
  ?:  =(our.bol src.bol)
    (local !<(act vase))
  (remote !<(act vase))
  ++  local
    |=  =act
    ^-  (quip card _this)
    ?-    -.act
        %post
      =/  =path  /(scot %p host.hut.act)/[name.hut.act]
      ?.  =(our.bol host.hut.act)
        :_  this
        :~  (~(poke pass:io path) [host.hut.act %hut] [mark vase])
        ==
      =/  =msgs  (~(got by huts) hut.act)
      =.  msgs
        ?.  (lte 50 (lent msgs))
          [msg.act msgs]
        [msg.act (snip msgs)]
      :_  this(huts (~(put by huts) hut.act msgs))
      :~  (fact:io hut-did+!>(`upd`[%post msg.act]) ~[path])
      ==
    ::
        %join
      ?<  =(our.bol host.hut.act)
      =/  =path  /(scot %p host.hut.act)/[name.hut.act]
      :_  this
      :~  (~(watch pass:io path) [host.hut.act %hut] path)
      ==
    ::
        %quit
      =/  =path  /(scot %p host.hut.act)/[name.hut.act]
      :-  ?:  =(our.bol host.hut.act)
            :~  (kick:io ~[path])
            ==
          :~  (kick:io ~[path])
              (~(leave pass:io path) [host.hut.act %hut])
          ==
      %=  this
        huts  (~(del by huts) hut.act)
        ppl   (~(del by ppl) hut.act)
      ==
    ::
        %ship
      =/  =path  /(scot %p host.hut.act)/[name.hut.act]
      ?>  =(our.bol host.hut.act)
      :_  this(ppl (~(put bi ppl) hut.act who.act %.n))
      :~  (fact:io hut-did+!>(`upd`[%ship who.act]) ~[path])
      ==
    ::
        %kick
      =/  =path  /(scot %p host.hut.act)/[name.hut.act]
      ?>  =(our.bol host.hut.act)
      ?<  =(our.bol who.act)
      :_  this(ppl (~(del bi ppl) hut.act who.act))
      :~  (kick-only:io who.act ~[path])
          (fact:io hut-did+!>(`upd`[%kick who.act]) ~[path])
      ==
    ::
        %make
      ?<  (~(has by huts) hut.act)
      :-  ~
      %=  this
        huts  (~(put by huts) hut.act ~)
        ppl   (~(put bi ppl) hut.act our.bol %.y)
      ==
    ==
  ++  remote
    |=  =act
    ?>  ?=(%post -.act)
    ^-  (quip card _this)
    ?>  =(our.bol host.hut.act)
    ?>  (~(has by huts) hut.act)
    ?>  =(src.bol who.msg.act)
    ?>  (~(has bi ppl) hut.act src.bol)
    =/  =path  /(scot %p host.hut.act)/[name.hut.act]
    =/  =msgs  (~(got by huts) hut.act)
    =.  msgs
      ?.  (lte 50 (lent msgs))
        [msg.act msgs]
      [msg.act (snip msgs)]
    :_  this(huts (~(put by huts) hut.act msgs))
    :~  (fact:io hut-did+!>(`upd`[%post msg.act]) ~[path])
    ==
  --
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?>  ?=([@ @ ~] wire)
  =/  =hut  [(slav %p i.wire) i.t.wire]
  ?+    -.sign  (on-agent:def wire sign)
      %watch-ack
    ?~  p.sign
      [~ this]
    :-  :~  (fact:io hut-did+!>(`upd`[%kick our.bol]) ~[wire])
            (kick:io ~[wire])
        ==
    %=  this
      huts  (~(del by huts) hut)
      ppl   (~(del by ppl) hut)
    ==
  ::
      %kick
    :_  this
    :~  (~(watch pass:io wire) [host.hut %hut] wire)
    ==
  ::
      %fact
    ?>  ?=(%hut-did p.cage.sign)
    =/  upd  !<(upd q.cage.sign)
    ?-    -.upd
        %init
      :-  :~  (fact:io cage.sign ~[wire])
          ==
      %=  this
        huts  (~(put by huts) hut msgs.upd)
        ppl   (~(put by ppl) hut ppl.upd)
      ==
    ::
        %post
      =/  msgs  (~(got by huts) hut)
      =.  msgs
        ?.  (lte 50 (lent msgs))
          [msg.upd msgs]
        [msg.upd (snip msgs)]
      :_  this(huts (~(put by huts) hut msgs))
      :~  (fact:io cage.sign ~[wire])
      ==
    ::
        %join
      :_  this(ppl (~(put bi ppl) hut who.upd %.y))
      :~  (fact:io cage.sign ~[wire])
      ==
    ::
        %quit
      :_  this(ppl (~(put bi ppl) hut who.upd %.n))
      :~  (fact:io cage.sign ~[wire])
      ==
    ::
        %ship
      :_  this(ppl (~(put bi ppl) hut who.upd %.n))
      :~  (fact:io cage.sign ~[wire])
      ==
    ::
        %kick
      :_  this(ppl (~(del bi ppl) hut who.upd))
      :~  (fact:io cage.sign ~[wire])
      ==
    ==
  ==
::
++  on-watch
  |=  =path
  |^  ^-  (quip card _this)
  ?>  ?=([@ @ ~] path)
  =/  =hut  [(slav %p i.path) i.t.path]
  ?:  =(our.bol src.bol)
    ?:  =(our.bol host.hut)
      [[(init hut) ~] this]
    ?.  (~(has by huts) hut)
      [~ this]
    [[(init hut) ~] this]
  ?>  =(our.bol host.hut)
  ?>  (~(has bi ppl) hut src.bol)
  :_  this(ppl (~(put bi ppl) hut src.bol %.y))
  :~  (init hut)
      (fact:io hut-did+!>(`upd`[%join src.bol]) ~[path])
  ==
  ::
  ++  init
    |=  =hut
    ^-  card
    %-  fact-init:io
    :-  %hut-did
    !>  ^-  upd
    :+  %init
      (~(got by ppl) hut)
    (~(got by huts) hut)
  --
::
++  on-leave
  |=  =path
  ^-  (quip card _this)
  ?>  ?=([@ @ ~] path)
  =/  =hut  [(slav %p i.path) i.t.path]
  ?:  =(our.bol src.bol)
    [~ this]
  :_  this(ppl (~(put bi ppl) hut src.bol %.n))
  :~  (fact:io hut-did+!>(`upd`[%quit src.bol]) ~[path])
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?>  =(our.bol src.bol)
  ?>  ?=([%x %huts ~] path)
  :^  ~  ~  %json
  !>  ^-  json
  :-  %a
  %+  turn
    %+  sort  ~(tap by ~(key by huts))
    |=  [a=hut b=hut]
    %+  aor
      :((cury cat 3) (scot %p host.a) '/' name.a)
    :((cury cat 3) (scot %p host.b) '/' name.b)
  |=  [host=@p name=@tas]
  %-  pairs:enjs:format
  :~  ['host' s+(scot %p host)]
      ['name' s+name]
  ==
::
++  on-arvo  on-arvo:def
++  on-fail  on-fail:def
--
