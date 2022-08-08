/-  *hut, *squad
/+  default-agent, dbug, agentio
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 =huts =msg-jar =joined]
+$  card  card:agent:gall
--
::
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
=<
|_  bol=bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bol)
    io    ~(. agentio bol)
    hc    ~(. +> bol)
++  on-init
  ^-  (quip card _this)
  :_  this
  :~  (~(watch-our pass:io /squad) %squad /local/all)
  ==
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
    (local !<(hut-act vase))
  (remote !<(hut-act vase))
  ++  local
    |=  act=hut-act
    ^-  (quip card _this)
    ?-    -.act
        %post
      =/  =path
        /(scot %p host.gid.hut.act)/[name.gid.hut.act]
      ?.  =(our.bol host.gid.hut.act)
        :_  this
        :~  (~(poke pass:io path) [host.gid.hut.act %hut] [mark vase])
        ==
      =/  =msgs  (~(get ja msg-jar) hut.act)
      =.  msgs
        ?.  (lte 50 (lent msgs))
          [msg.act msgs]
        [msg.act (snip msgs)]
      :_  this(msg-jar (~(put by msg-jar) hut.act msgs))
      :~  (fact:io [mark vase] path /all ~)
      ==
    ::
        %join
      ?<  =(our.bol host.gid.act)
      =/  =path
        /(scot %p host.gid.act)/[name.gid.act]
      :_  this
      :~  (~(watch pass:io path) [host.gid.act %hut] path)
      ==
    ::
        %quit
      =/  =path
        /(scot %p host.gid.act)/[name.gid.act]
      =/  to-rm=(list hut)
        %+  turn  ~(tap in (~(get ju huts) gid.act))
        |=(=name `hut`[gid.act name])
      =.  msg-jar
        |-
        ?~  to-rm  msg-jar
        $(to-rm t.to-rm, msg-jar (~(del by msg-jar) i.to-rm))
      :-  :-  (fact:io [mark vase] /all ~)
          ?:  =(our.bol host.gid.act)
            ~
          ~[(~(leave-path pass:io path) [host.gid.act %hut] path)]
      %=  this
        huts     (~(del by huts) gid.act)
        msg-jar  msg-jar
        joined   (~(del by joined) gid.act)
      ==
    ::
        %new
      ?>  =(our.bol host.gid.hut.act)
      ?>  (has-squad:hc gid.hut.act)
      ?<  (~(has ju huts) gid.hut.act name.hut.act)
      =/  =path
        /(scot %p host.gid.hut.act)/[name.gid.hut.act]
      :-  :~  (fact:io hut-did+vase path /all ~)
          ==
      %=  this
        huts     (~(put ju huts) gid.hut.act name.hut.act)
        msg-jar  (~(put by msg-jar) hut.act *msgs)
        joined   (~(put ju joined) gid.hut.act our.bol)
      ==
    ::
        %del
      ?>  =(our.bol host.gid.hut.act)
      =/  =path
        /(scot %p host.gid.hut.act)/[name.gid.hut.act]
      :-  :~  (fact:io hut-did+vase path /all ~)
          ==
      %=  this
        huts     (~(del ju huts) gid.hut.act name.hut.act)
        msg-jar  (~(del by msg-jar) hut.act)
      ==
    ==
  ++  remote
    |=  act=hut-act
    ?>  ?=(%post -.act)
    ^-  (quip card _this)
    ?>  =(our.bol host.gid.hut.act)
    ?>  (~(has by huts) gid.hut.act)
    ?>  =(src.bol who.msg.act)
    ?>  (~(has ju joined) gid.hut.act src.bol)
    =/  =path  /(scot %p host.gid.hut.act)/[name.gid.hut.act]
    =/  =msgs  (~(get ja msg-jar) hut.act)
    =.  msgs
      ?.  (lte 50 (lent msgs))
        [msg.act msgs]
      [msg.act (snip msgs)]
    :_  this(msg-jar (~(put by msg-jar) hut.act msgs))
    :~  (fact:io hut-did+vase path /all ~)
    ==
  --
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?:  ?=([%squad ~] wire)
    ?+    -.sign  (on-agent:def wire sign)
        %kick
      :_  this
      :~  (~(watch-our pass:io /squad) %squad /local/all)
      ==
    ::
        %watch-ack
      ?~  p.sign  `this
      :_  this
      :~  (~(wait pass:io /behn) (add now.bol ~m1))
      ==
    ::
        %fact
      ?>  ?=(%squad-did p.cage.sign)
      =/  =upd  !<(upd q.cage.sign)
      ?+    -.upd  `this
          %init-all
        =/  gid-to-rm=(list gid)
          ~(tap in (~(dif in ~(key by huts)) ~(key by squads.upd)))
        =.  huts
          |-
          ?~  gid-to-rm  huts
          $(gid-to-rm t.gid-to-rm, huts (~(del by huts) i.gid-to-rm))
        =.  joined
          |-
          ?~  gid-to-rm  joined
          $(gid-to-rm t.gid-to-rm, joined (~(del by joined) i.gid-to-rm))
        =/  hut-to-rm=(list hut)
          %-  zing
          %+  turn  gid-to-rm
          |=  =gid
          (turn ~(tap in (~(get ju huts) gid)) |=(=name `hut`[gid name]))
        =.  msg-jar
          |-
          ?~  hut-to-rm  msg-jar
          $(hut-to-rm t.hut-to-rm, msg-jar (~(del by msg-jar) i.hut-to-rm))
        =^  cards=(list card)  joined
          %+  roll  ~(tap by joined)
          |:  [[gid=*gid ppl=*ppl] cards=*(list card) n-joined=joined]
          =/  =path  /(scot %p host.gid)/[name.gid]
          =/  ppl-list=(list @p)  ~(tap in ppl)
          =;  [n-cards=(list card) n-n-joined=^joined]
            [(weld n-cards cards) n-n-joined]
          %+  roll  ppl-list
          |:  [ship=*@p n-cards=*(list card) n-n-joined=n-joined]
          ?.  ?&  ?|  ?&  pub:(~(got by squads.upd) gid)
                          (~(has ju acls.upd) gid ship)
                      ==
                      ?&  !pub:(~(got by squads.upd) gid)
                          !(~(has ju acls.upd) gid ship)
                      ==
                  ==
                  (~(has ju n-n-joined) gid ship)
              ==
            [n-cards n-n-joined]
          :-  :+  (kick-only:io ship path ~)
                (fact:io hut-did+!>(`hut-upd`[%quit gid ship]) path /all ~)
              n-cards
          (~(del ju n-n-joined) gid ship)
        =/  kick-paths=(list path)
          (turn gid-to-rm |=(=gid `path`/(scot %p host.gid)/[name.gid]))
        =.  cards  ?~(kick-paths cards [(kick:io kick-paths) cards])
        =.  cards
          %+  weld
            %+  turn  gid-to-rm
            |=  =gid
            ^-  card
            (fact:io hut-did+!>(`hut-upd`[%quit gid our.bol]) /all ~)
          cards
        [cards this(huts huts, msg-jar msg-jar, joined joined)]
      ::
          %del
        =/  =path  /(scot %p host.gid.upd)/[name.gid.upd]
        =/  to-rm=(list hut)
          %+  turn  ~(tap in (~(get ju huts) gid.upd))
          |=(=name `hut`[gid.upd name])
        =.  msg-jar
          |-
          ?~  to-rm  msg-jar
          $(to-rm t.to-rm, msg-jar (~(del by msg-jar) i.to-rm))
        :_  %=  this
              huts     (~(del by huts) gid.upd)
              msg-jar  msg-jar
              joined   (~(del by joined) gid.upd)
            ==
        :+  (kick:io path ~)
          (fact:io hut-did+!>(`hut-upd`[%quit gid.upd our.bol]) /all ~)
        ?:  =(our.bol host.gid.upd)
          ~
        ~[(~(leave-path pass:io path) [host.gid.upd %tally] path)]
      ::
          %kick
        =/  =path  /(scot %p host.gid.upd)/[name.gid.upd]
        ?.  =(our.bol ship.upd)
          :_  this(joined (~(del ju joined) gid.upd ship.upd))
          :-  (kick-only:io ship.upd path ~)
          ?.  (~(has ju joined) gid.upd ship.upd)
            ~
          ~[(fact:io hut-did+!>(`hut-upd`[%quit gid.upd ship.upd]) path /all ~)]
        =/  hut-to-rm=(list hut)
          (turn ~(tap in (~(get ju huts) gid.upd)) |=(=name `hut`[gid.upd name]))
        =.  msg-jar
          |-
          ?~  hut-to-rm  msg-jar
          $(hut-to-rm t.hut-to-rm, msg-jar (~(del by msg-jar) i.hut-to-rm))
        :_  %=  this
               huts     (~(del by huts) gid.upd)
               msg-jar  msg-jar
               joined   (~(del by joined) gid.upd)
            ==
        :+  (kick:io path ~)
          (fact:io hut-did+!>(`hut-upd`[%quit gid.upd ship.upd]) /all ~)
        ?:  =(our.bol host.gid.upd)
          ~
        ~[(~(leave-path pass:io path) [host.gid.upd %tally] path)]
      ::
          %leave
        =/  =path  /(scot %p host.gid.upd)/[name.gid.upd]
        ?.  =(our.bol ship.upd)
          ?.  (~(has ju joined) gid.upd ship.upd)
            `this
          :_  this(joined (~(del ju joined) gid.upd ship.upd))
          :~  (kick-only:io ship.upd path ~)
              %+  fact:io
                hut-did+!>(`hut-upd`[%quit gid.upd ship.upd])
              ~[path /all]
          ==
        =/  hut-to-rm=(list hut)
          (turn ~(tap in (~(get ju huts) gid.upd)) |=(=name `hut`[gid.upd name]))
        =.  msg-jar
          |-
          ?~  hut-to-rm  msg-jar
          $(hut-to-rm t.hut-to-rm, msg-jar (~(del by msg-jar) i.hut-to-rm))
        :_  %=  this
              huts     (~(del by huts) gid.upd)
              msg-jar  msg-jar
              joined   (~(del by joined) gid.upd)
            ==
        :+  (kick:io path ~)
          (fact:io hut-did+!>(`hut-upd`[%quit gid.upd ship.upd]) /all ~)
        ?:  =(our.bol host.gid.upd)
          ~
        ~[(~(leave-path pass:io path) [host.gid.upd %tally] path)]
      ==
    ==
  ?>  ?=([@ @ ~] wire)
  =/  =gid  [(slav %p i.wire) i.t.wire]
  ?+    -.sign  (on-agent:def wire sign)
      %watch-ack
    ?~  p.sign  `this
    =/  to-rm=(list hut)
      %+  turn  ~(tap in (~(get ju huts) gid))
      |=(=name `hut`[gid name])
    =.  msg-jar
      |-
      ?~  to-rm  msg-jar
      $(to-rm t.to-rm, msg-jar (~(del by msg-jar) i.to-rm))
    :-  :~  (fact:io hut-did+!>(`hut-upd`[%quit gid our.bol]) /all ~)
        ==
    %=  this
      huts     (~(del by huts) gid)
      msg-jar  msg-jar
      joined   (~(del by joined) gid)
    ==
  ::
      %kick
    :_  this
    :~  (~(watch pass:io wire) [host.gid %hut] wire)
    ==
  ::
      %fact
    ?>  ?=(%hut-did p.cage.sign)
    =/  upd  !<(hut-upd q.cage.sign)
    ?+    -.upd  (on-agent:def wire sign)
        %init
      ?.  =([gid ~] ~(tap in ~(key by huts.upd)))
        `this
      ?.  =([gid ~] ~(tap in ~(key by joined.upd)))
        `this
      =.  msg-jar.upd
        =/  to-rm=(list [=hut =msgs])
          %+  skip  ~(tap by msg-jar.upd)
          |=  [=hut =msgs]
          ?&  =(gid gid.hut)
              (~(has ju huts.upd) gid.hut name.hut)
          ==
        |-
        ?~  to-rm
          msg-jar.upd
        $(to-rm t.to-rm, msg-jar.upd (~(del by msg-jar.upd) hut.i.to-rm))
      :-  :~  %+  fact:io
                hut-did+!>(`hut-upd`[%init huts.upd msg-jar joined.upd])
              ~[/all]
          ==
      %=  this
        huts     (~(uni by huts) huts.upd)
        msg-jar  (~(uni by msg-jar) msg-jar.upd)
        joined   (~(uni by joined) joined.upd)
      ==
    ::
        %post
      ?.  =(gid gid.hut.upd)
        `this
      =/  msgs  (~(get ja msg-jar) hut.upd)
      =.  msgs
        ?.  (lte 50 (lent msgs))
          [msg.upd msgs]
        [msg.upd (snip msgs)]
      :_  this(msg-jar (~(put by msg-jar) hut.upd msgs))
      :~  (fact:io cage.sign /all ~)
      ==
    ::
        %join
      ?.  =(gid gid.upd)
        `this
      :_  this(joined (~(put ju joined) gid who.upd))
      :~  (fact:io cage.sign /all ~)
      ==
    ::
        %quit
      ?.  =(gid gid.upd)
        `this
      :_  this(joined (~(del ju joined) gid who.upd))
      :~  (fact:io cage.sign /all ~)
      ==
    ::
        %del
      ?.  =(gid gid.hut.upd)
        `this
      :-  :~  (fact:io cage.sign /all ~)
          ==
      %=  this
        huts     (~(del ju huts) hut.upd)
        msg-jar  (~(del by msg-jar) hut.upd)
      ==
    ==
  ==
::
++  on-watch
  |=  =path
  |^  ^-  (quip card _this)
  ?:  ?=([%all ~] path)
    ?>  =(our.bol src.bol)
    :_  this
    :~  %-  fact-init:io
        hut-did+!>(`hut-upd`[%init-all huts msg-jar joined])
    ==
  ?>  ?=([@ @ ~] path)
  =/  =gid  [(slav %p i.path) i.t.path]
  ?>  =(our.bol host.gid)
  ?>  (is-allowed:hc gid src.bol)
  :_  this(joined (~(put ju joined) gid src.bol))
  :-  (init gid)
  ?:  (~(has ju joined) gid src.bol)
    ~
  ~[(fact:io hut-did+!>(`hut-upd`[%join gid src.bol]) /all path ~)]
  ::
  ++  init
    |=  =gid
    ^-  card
    =/  hut-list=(list hut)
      %+  turn  ~(tap in (~(get ju huts) gid))
      |=(=name `hut`[gid name])
    %-  fact-init:io
    :-  %hut-did
    !>  ^-  hut-upd
    :^    %init
        (~(put by *^huts) gid (~(get ju huts) gid))
      %-  ~(gas by *^msg-jar)
      %+  turn  hut-list
      |=(=hut `[^hut msgs]`[hut (~(get ja msg-jar) hut)])
    (~(put by *^joined) gid (~(get ju joined) gid))
  --
::
++  on-leave
  |=  =path
  ^-  (quip card _this)
  ?:  ?=([%all ~] path)
    `this
  ?>  ?=([@ @ ~] path)
  =/  =gid  [(slav %p i.path) i.t.path]
  =/  last=?
    %+  gte  1
    (lent (skim ~(val by sup.bol) |=([=@p *] =(src.bol p))))
  :_  this(joined (~(del ju joined) gid src.bol))
  ?.  last
    ~
  :~  (fact:io hut-did+!>(`hut-upd`[%quit gid src.bol]) /all path ~)
  ==
::
++  on-peek  on-peek:def
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%behn ~] wire)
    (on-arvo:def [wire sign-arvo])
  ?>  ?=([%behn %wake *] sign-arvo)
  ?~  error.sign-arvo
    :_  this
    :~  (~(watch-our pass:io /squad) %squad /local/all)
    ==
  :_  this
  :~  (~(wait pass:io /behn) (add now.bol ~m1))
  ==
++  on-fail  on-fail:def
--
::
|_  bol=bowl:gall
++  has-squad
  |=  =gid
  ^-  ?
  =-  ?=(^ .)
  .^  (unit)
    %gx
    (scot %p our.bol)
    %squad
    (scot %da now.bol)
    %squad
    (scot %p host.gid)
    /[name.gid]/noun
  ==
++  is-allowed
  |=  [=gid =ship]
  ^-  ?
  =/  u-acl
    .^  (unit [pub=? acl=ppl])
      %gx
      (scot %p our.bol)
      %squad
      (scot %da now.bol)
      %acl
      (scot %p host.gid)
      /[name.gid]/noun
    ==
  ?~  u-acl  |
  ?:  pub.u.u-acl
    !(~(has in acl.u.u-acl) ship)
  (~(has in acl.u.u-acl) ship)
--
