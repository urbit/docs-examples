/-  *tally, *ring, *squad
/+  *mip, ring, default-agent, dbug, agentio
/=  index  /app/tally/index
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 =by-group voted=(set pid) withdrawn=(set pid)]
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
  [%pass /bind %arvo %e %connect `/'tally' %tally]~
++  on-save  !>(state)
++  on-load
  |=  old-vase=vase
  ^-  (quip card _this)
  [~ this(state !<(state-0 old-vase))]
::
++  on-poke
  |=  [=mark =vase]
  |^  ^-  (quip card _this)
  =^  cards  state
    ?+  mark  (on-poke:def mark vase)
      %tally-action        (handle-action !<(action vase))
      %handle-http-request  (handle-http !<([@ta inbound-request:eyre] vase))
    ==
  [cards this]
  ++  handle-http
    |=  [rid=@ta req=inbound-request:eyre]
    ^-  (quip card _state)
    ?.  authenticated.req
      :_  state
      (give-http:hc rid [307 ['Location' '/~/login?redirect='] ~] ~)
    ?+  method.request.req
      :_  state
      %^    give-http:hc
          rid
        :-  405
        :~  ['Content-Type' 'text/html']
            ['Content-Length' '31']
            ['Allow' 'GET, POST']
        ==
      (some (as-octs:mimes:html '<h1>405 Method Not Allowed</h1>'))
    ::
        %'GET'
      [(make-index:hc rid) state]
    ::
        %'POST'
      ?~  body.request.req  [(redirect:hc rid "/tally") state]
      =/  query=(unit (list [k=@t v=@t]))
        (rush q.u.body.request.req yquy:de-purl:html)
      ?~  query  [(redirect:hc rid "/tally") state]
      =/  kv-map  (~(gas by *(map @t @t)) u.query)
      ?.  (~(has by kv-map) 'gid')
        [(redirect:hc rid "/tally") state]
      =/  =path
        %-  tail
        %+  rash  url.request.req
        ;~(sfix apat:de-purl:html yquy:de-purl:html)
      ?+    path  [(redirect:hc rid "/tally") state]
          [%tally %watch ~]
        ?.  (~(has by kv-map) 'gid')
          [(redirect:hc rid "/tally") state]
        =/  =gid
          %+  rash  (~(got by kv-map) 'gid')
          ;~(plug fed:ag ;~(pfix cab sym))
        =^  cards  state  (handle-action %watch gid)
        [(weld cards (redirect:hc rid "/tally")) state]
      ::
          [%tally %leave ~]
        =/  =gid
          %+  rash  (~(got by kv-map) 'gid')
          ;~(plug fed:ag ;~(pfix cab sym))
        =^  cards  state  (handle-action %leave gid)
        [(weld cards (redirect:hc rid "/tally")) state]
      ::
          [%tally %new ~]
        =/  =gid
          %+  rash  (~(got by kv-map) 'gid')
          ;~(plug fed:ag ;~(pfix cab sym))
        =/  days=@ud  (rash (~(got by kv-map) 'days') dem)
        =/  proposal=@t  (~(got by kv-map) 'proposal')
        =/  location=tape
          "/tally#{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
        =^  cards  state  (handle-action %new proposal days gid)
        [(weld cards (redirect:hc rid location)) state]
      ::
          [%tally %withdraw ~]
        =/  =gid
          %+  rash  (~(got by kv-map) 'gid')
          ;~(plug fed:ag ;~(pfix cab sym))
        =/  =pid  (rash (~(got by kv-map) 'pid') dem)
        =^  cards  state  (handle-action %withdraw gid pid)
        =/  location=tape
          "/tally#{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
        [(weld cards (redirect:hc rid location)) state]
      ::
          [%tally %vote ~]
        =/  =gid
          %+  rash  (~(got by kv-map) 'gid')
          ;~(plug fed:ag ;~(pfix cab sym))
        =/  =pid  (rash (~(got by kv-map) 'pid') dem)
        =/  choice=?
          %+  rash  (~(got by kv-map) 'choice')
          ;~  pose
            (cold %.y (jest 'yea'))
            (cold %.n (jest 'nay'))
          ==
        =/  [=poll =votes]  (~(got bi by-group) gid pid)
        =/  raw=raw-ring-signature
          =<  raw
          %:  sign:ring
            our.bol
            now.bol
            eny.bol
            choice
            `pid
            participants.ring-group.poll
          ==
        =^  cards  state  (handle-action %vote gid pid choice raw)
        [(weld cards (redirect:hc rid "/tally#{(a-co:co pid)}")) state]
      ==
    ==
  ::
  ++  handle-action
    |=  act=action
    ^-  (quip card _state)
    ?-    -.act
        %new
      =/  =path  /(scot %p host.gid.act)/[name.gid.act]
      ?.  =(our.bol host.gid.act)
        ?>  =(our.bol src.bol)
        :_  state
        :~  %+  ~(poke pass:io path)
              [host.gid.act %tally]
            tally-action+!>(`action`[%new proposal.act days.act gid.act])
        ==
      ?>  (~(has in (get-members:hc gid.act)) src.bol)
      =/  members=(set [=ship =life])  (make-ring-members:hc gid.act)
      ?>  ?=(^ members)
      =/  expiry=@da  (add now.bol (yule days.act 0 0 0 ~))
      =/  polls=(map pid [=poll =votes])
        (fall (~(get by by-group) gid.act) *(map pid [=poll =votes]))
      =/  =pid
        =/  rng  ~(. og eny.bol)
        |-
        =^  n  rng  (rads:rng (bex 256))
        ?.  (~(has by polls) n)
          n
        $(rng rng)
      =/  =ring-group  [members ~ pid]
      =/  =poll  [src.bol proposal.act expiry gid.act ring-group]
      :-  :~  (fact:io tally-update+!>(`update`[%new pid poll]) ~[path])
          ==
      %=  state
        by-group  (~(put bi by-group) gid.act pid [poll *votes])
      ==
    ::
        %vote
      =/  [=poll =votes]  (~(got bi by-group) gid.act pid.act)
      ?>  (gte expiry.poll now.bol)
      =/  =path  /(scot %p host.gid.act)/[name.gid.act]
      ?.  =(our.bol host.gid.act)
        ?>  =(our.bol src.bol)
        :_  state(voted (~(put in voted) pid.act))
        :~  %+  ~(poke pass:io path)
              [host.gid.act %tally]
            tally-action+!>([%vote gid.act pid.act vote.act])
        ==
      ?>  %:  verify:ring
            our.bol
            now.bol
            p.vote.act
            participants.ring-group.poll
            link-scope.ring-group.poll
            q.vote.act
          ==
      ?<  (~(has by votes) (need y.q.vote.act))
      =.  by-group
        %^    ~(put bi by-group)
            gid.act
          pid.act
        [poll (~(put by votes) (need y.q.vote.act) vote.act)]
      :_  ?.  =(our.bol src.bol)
            state
          state(voted (~(put in voted) pid.act))
      :~  (fact:io tally-update+!>(`update`[%vote pid.act vote.act]) ~[path])
      ==
    ::
        %watch
      ?>  =(our.bol src.bol)
      ?>  !=(our.bol host.gid.act)
      =/  =path  /(scot %p host.gid.act)/[name.gid.act]
      :_  state
      :~  (~(watch pass:io path) [host.gid.act %tally] path)
      ==
    ::
        %leave
      ?>  =(our.bol src.bol)
      ?<  =(our.bol host.gid.act)
      =/  =path  /(scot %p host.gid.act)/[name.gid.act]
      :_  state(by-group (~(del by by-group) gid.act))
      :~  (~(leave-path pass:io path) [host.gid.act %tally] path)
      ==
    ::
        %withdraw
      =/  [=poll =votes]  (~(got bi by-group) gid.act pid.act)
      =/  =path  /(scot %p host.gid.act)/[name.gid.act]
      ?.  =(our.bol host.gid.poll)
        ?>  =(our.bol src.bol)
        :_  state(withdrawn (~(put in withdrawn) pid.act))
        :~  %+  ~(poke pass:io path)
              [host.gid.act %tally]
            tally-action+!>(`action`[%withdraw gid.act pid.act])
        ==
      ?>  ?|  =(our.bol src.bol)
              &(=(src.bol creator.poll) (gte expiry.poll now.bol))
          ==
      :_  %=  state
            by-group   (~(del bi by-group) gid.act pid.act)
            voted      (~(del in voted) pid.act)
            withdrawn  (~(del in withdrawn) pid.act)
          ==
      :~  (fact:io tally-update+!>(`update`[%withdraw pid.act]) ~[path])
      ==
    ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?:  &(=(our.bol src.bol) ?=([%http-response *] path))
    `this
  ?>  ?=([@ @ ~] path)
  =/  =gid  [(slav %p i.path) i.t.path]
  ?>  =(our.bol host.gid)
  ?>  (~(has in (get-members:hc gid)) src.bol)
  :_  this
  :~  %+  fact-init:io  %tally-update
      !>  ^-  update
      :-  %init
      (fall (~(get by by-group) gid) *(map pid [=poll =votes]))
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?>  ?=([@ @ ~] wire)
  =/  =gid  [(slav %p i.wire) i.t.wire]
  ?+    -.sign  (on-agent:def wire sign)
      %watch-ack
    ?~  p.sign  `this
    `this(by-group (~(del by by-group) gid))
  ::
      %kick
    :_  this
    :~  (~(watch pass:io wire) [host.gid %tally] wire)
    ==
  ::
      %fact
    ?>  ?=(%tally-update p.cage.sign)
    =/  upd  !<(update q.cage.sign)
    ?-    -.upd
        %init
      =;  by-group  `this
      %+  ~(put by by-group)  gid
      %-  ~(rep by polls.upd)
      |=  [[=pid =poll =votes] acc=(map pid [=poll =votes])]
      ?.  =(gid gid.poll)  acc
      ?.  =(pid (fall link-scope.ring-group.poll 0^0))  acc
      %+  ~(put by acc)  pid
      :-  poll
      %-  ~(rep by votes)
      |=  [[y=@udpoint =vote] acc=(map @udpoint vote)]
      ?.  =(y (fall y.q.vote 0^0))  acc
      ?.  %:  verify:ring
            our.bol
            now.bol
            p.vote
            participants.ring-group.poll
            link-scope.ring-group.poll
            q.vote
          ==
        acc
      (~(put by acc) y vote)
    ::
        %vote
      ?.  (~(has bi by-group) gid pid.upd)  `this
      =/  [=poll =votes]  (~(got bi by-group) gid pid.upd)
      ?:  (gte now.bol expiry.poll)  `this
      ?~  y.q.vote.upd  `this
      ?:  (~(has by votes) u.y.q.vote.upd)  `this
      ?.  %:  verify:ring
            our.bol
            now.bol
            p.vote.upd
            participants.ring-group.poll
            link-scope.ring-group.poll
            q.vote.upd
          ==
        `this
      =.  votes  (~(put by votes) u.y.q.vote.upd vote.upd)
      `this(by-group (~(put bi by-group) gid pid.upd [poll votes]))
    ::
        %new
      ?:  (~(has bi by-group) gid pid.upd)  `this
      ?.  =(gid gid.poll.upd)  `this
      ?.  =(pid.upd (fall link-scope.ring-group.poll.upd 0^0))  `this
      `this(by-group (~(put bi by-group) gid pid.upd poll.upd *votes))
    ::
        %withdraw
      :-  ~
      %=  this
        by-group   (~(del bi by-group) gid pid.upd)
        voted      (~(del in voted) pid.upd)
        withdrawn  (~(del in withdrawn) pid.upd)
      ==
    ==
  ==
::
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%bind ~] wire)
    (on-arvo:def [wire sign-arvo])
  ?.  ?=([%eyre %bound *] sign-arvo)
    (on-arvo:def [wire sign-arvo])
  ~?  !accepted.sign-arvo
    %eyre-rejected-tally-binding
  `this
::
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
|_  bol=bowl:gall
++  redirect
    |=  [rid=@ta path=tape]
    (give-http rid [302 ['Location' (crip path)] ~] ~)
::
++  make-index
  |=  rid=@ta
  ^-  (list card)
  %+  make-200
    rid
  %-  as-octs:mimes:html
  %-  crip
  %-  en-xml:html
  (index bol by-group voted withdrawn)
::
++  make-200
  |=  [rid=@ta dat=octs]
  ^-  (list card)
  %^    give-http
      rid
    :-  200
    :~  ['Content-Type' 'text/html']
        ['Content-Length' (crip ((d-co:co 1) p.dat))]
    ==
  [~ dat]
::
++  give-http
  |=  [rid=@ta hed=response-header:http dat=(unit octs)]
  ^-  (list card)
  :~  [%give %fact ~[/http-response/[rid]] %http-response-header !>(hed)]
      [%give %fact ~[/http-response/[rid]] %http-response-data !>(dat)]
      [%give %kick ~[/http-response/[rid]] ~]
  ==
::
++  make-ring-members
  |=  =gid
  ^-  (set [=ship =life])
  =/  invited=(list @p)  ~(tap in (get-members gid))
  =|  participants=(set [=ship =life])
  |-
  ?~  invited
    participants
  =/  lyfe
    .^  (unit @ud)
      %j
      (scot %p our.bol)
      %lyfe
      (scot %da now.bol)
      /(scot %p i.invited)
    ==
  ?~  lyfe
    $(invited t.invited)
  %=  $
    invited       t.invited
    participants  (~(put in participants) [i.invited u.lyfe])
  ==
::
++  get-members
  |=  =gid
  ^-  ppl
  %-  ~(gas in *ppl)
  %+  skim
    %~  tap  in
    .^  ppl
      %gx
      (scot %p our.bol)
      %squad
      (scot %da now.bol)
      %members
      (scot %p host.gid)
      name.gid
      /noun
    ==
  |=  =ship
  ?|  =(our.bol ship)
      ?=(?(%czar %king %duke) (clan:title ship))
  ==
--
