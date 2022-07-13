/-  *tally, ms=metadata-store, g=group
/+  *mip
|=  [bol=bowl:gall =by-group voted=(set pid) withdrawn=(set pid)]
=<
=/  all-group-names=(list (pair gid @t))  all-group-names
=/  group-names  (get-group-names ~(tap in ~(key by by-group)))
|^  ^-  manx
;html
  ;head
    ;title: Tally
    ;meta(charset "utf-8");
    ;style
      ;+  ;/  style
    ==
  ==
  ;body
    ;h1: tally
    ;h2: subscriptions
    ;form(method "post")
      ;select
        =name      "s-gid"
        =required  ""
        ;*  (group-options-component %.n %.n)
      ==
      ;input(id "s", type "submit", value "watch");
    ==
    ;form(method "post")
      ;select
        =name      "u-gid"
        =required  ""
        ;*  (group-options-component %.n %.y)
      ==
      ;input(id "u", type "submit", value "leave");
    ==
    ;h2: new poll
    ;form(method "post")
      ;label(for "n-gid"): group:
      ;select
        =id        "n-gid"
        =name      "n-gid"
        =required  ""
        ;*  (group-options-component %.y %.y)
      ==
      ;br;
      ;label(for "n-days"): duration:
      ;input
        =type         "number"
        =id           "n-days"
        =name         "n-days"
        =min          "1"
        =step         "1"
        =required     ""
        =placeholder  "days"
        ;+  ;/("")
      ==
      ;br;
      ;label(for "n-proposal"): proposal:
      ;input
        =type      "text"
        =id        "n-proposal"
        =name      "n-proposal"
        =size      "50"
        =required  ""
        ;+  ;/("")
      ==
      ;br;
      ;input(id "submit", type "submit", value "submit");
    ==
    ;h2: groups
    ;*  ?~  group-names
          ~[;/("")]
        (turn group-names group-component)
  ==
==
::
++  group-options-component
  |=  [our=? in-subs=?]
  ^-  marl
  =/  names=(list (pair gid @t))  all-group-names
  =/  subs=(set gid)
    %-  ~(gas in *(set gid))
    %+  turn  ~(tap by wex.bol)
    |=  [[=wire *] *]
    ^-  gid
    ?>  ?=([@ @ ~] wire)
    [(slav %p i.wire) i.t.wire]
  =?  names  &(our in-subs)
    (skim names |=((pair gid @t) |(=(our.bol p.p) (~(has in subs) p))))
  =?  names  &(!our in-subs)
    (skim names |=((pair gid @t) (~(has in subs) p)))
  =?  names  &(!our !in-subs)
    (skip names |=((pair gid @t) |(=(our.bol p.p) (~(has in subs) p))))
  %+  turn  names
  |=  (pair gid @t)
  ^-  manx
  ;option(value "{=>(<p.p> ?>(?=(^ .) t))}_{(trip q.p)}"): {(trip q)}
::
++  group-component
  |=  (pair gid @t)
  ^-  manx
  =/  polls=(list [=pid =poll =votes])
    ~(tap by (~(got by by-group) p))
  =/  open=@ud
    %-  lent
    %+  skim  polls
    |=  [* =poll *]
    (gth expiry.poll now.bol)
  =/  title=tape
    %+  weld  (trip q)
    ?:  =(0 open)
      ""
    " ({(a-co:co open)})"
  ;details(id "{=>(<p.p> ?>(?=(^ .) t))}_{(trip q.p)}", open "open")
    ;summary
      ;h3: {title}
    ==
    ;*  (group-polls-component p polls)
  ==
::
++  group-polls-component
  |=  [=gid =(list [=pid =poll =votes])]
  ^-  marl
  %+  turn
    %+  sort  list
    |=  [a=[* =poll *] b=[* =poll *]]
    (gth expiry.poll.a expiry.poll.b)
  (cury poll-component gid)
::
++  poll-component
  |=  [=gid =pid =poll =votes]
  ^-  manx
  ;table(id (a-co:co pid))
    ;tr
      ;th: proposal:
      ;td: {(trip proposal.poll)}
    ==
    ;+  ?.  ?|  =(our.bol p.gid)
                &(=(our.bol creator.poll) (gte expiry.poll now.bol))
            ==
          ;/("")
        ?:  (~(has in withdrawn) pid)
          ;tr
            ;th: withdraw:
            ;td: pending
          ==
        ;tr
          ;th: withdraw:
          ;td
            ;form(method "post")
              ;input
                =type  "hidden"
                =name  "w-gid"
                =value  "{=>(<p.gid> ?>(?=(^ .) t))}_{(trip q.gid)}"
                ;+  ;/("")
              ==
              ;input(type "hidden", name "w-pid", value (a-co:co pid));
              ;input(type "submit", value "withdraw?");
            ==
          ==
        ==
    ;tr
      ;th: creator:
      ;td: {<creator.poll>}
    ==
    ;tr
      ;th
        ;+  ?:  (lte expiry.poll now.bol)
              ;/  "closed:"
            ;/  "closes:"
      ==
      ;+  (expiry-component expiry.poll)
    ==
    ;*  (result-component votes expiry.poll)
    ;+  ?:  ?|  (lte expiry.poll now.bol)
                (~(has in voted) pid)
                !(~(has in participants.ring-group.poll) [our.bol our-life])
            ==
          ;/  ""
        ;tr
          ;th: vote:
          ;td
            ;form(method "post")
              ;input
                =type   "hidden"
                =name   "v-gid"
                =value  "{=>(<p.gid> ?>(?=(^ .) t))}_{(trip q.gid)}"
                ;+  ;/("")
              ==
              ;input(type "hidden", name "v-pid", value (a-co:co pid));
              ;input(id "yea", type "submit", name "v-choice", value "yea");
              ;input(id "nay", type "submit", name "v-choice", value "nay");
            ==
          ==
        ==
  ==
::
++  result-component
  |=  [=votes expiry=@da]
  |^  ^-  marl
  =/  [yea=@ud nay=@ud]
    %+  roll  ~(val by votes)
    |=  [(pair ? *) y=@ud n=@ud]
    ?:  p  [+(y) n]  [y +(n)]
  =/  [y-per=@ud n-per=@ud]
    :-  (percent yea (add yea nay))
    (percent nay (add yea nay))
  :~  ^-  manx
      ;tr
        ;th: yea:
        ;td: {(a-co:co yea)} ({(a-co:co y-per)}%)
      ==
      ^-  manx
      ;tr
        ;th: nay:
        ;td: {(a-co:co nay)} ({(a-co:co n-per)}%)
      ==
      ^-  manx
      ?:  (gth expiry now.bol)
        ;/  ""
      ;tr
        ;th: passed:
        ;td
          ;+  ?:  (gth yea nay)
                ;/  "yes"
              ;/  "no"
        ==
      ==
  ==
  ++  percent
    |=  (pair @ud @ud)
    ^-  @ud
    ?:  =(0 p)
      0
    %-  div
    :_  2
    %-  need
    %-  toi:fl
    %+  mul:fl
      (sun:fl 100)
    (div:fl (sun:fl p) (sun:fl q))
  --
++  expiry-component
  |=  d=@da
  ^-  manx
  ;td
    ;+  ?:  (lte d now.bol)
          =/  =tarp  (yell (sub now.bol d))
          ?:  (gte d.tarp 1)
            ;/  "{(a-co:co d.tarp)} days ago"
          ?:  (gte h.tarp 1)
            ;/  "{(a-co:co h.tarp)} hours ago"
          ;/  "{(a-co:co m.tarp)} minutes ago"
        =/  =tarp  (yell (sub d now.bol))
        ?:  (gte d.tarp 1)
          ;/  "{(a-co:co d.tarp)} days"
        ?:  (gte h.tarp 1)
          ;/  "{(a-co:co h.tarp)} hours"
        ;/  "{(a-co:co m.tarp)} minutes"
  ==
++  style
  ^~
  ^-  tape
  %-  trip
  '''
  * {font-family: monospace}
  h3 {display: inline}
  table {margin: 1em}
  th {text-align: right; vertical-align: middle;}
  td {padding-left: 1em; vertical-align: middle;}
  td form {margin: 0}
  label {
    display: inline-block;
    margin-right: 1em;
    min-width: 9ch;
    vertical-align: middle;
  }
  select {min-width: 8ch}
  #s, #u {margin-left: 1ch}
  #submit {margin-top: 1em}
  #yea {margin-right: 1ch}
  '''
--
::
|%
++  our-groups
  ^-  (set gid)
  %-  ~(rep in get-groups)
  |=  [a=gid b=(set gid)]
  ?.  =(p.a our.bol)
    b
  (~(put in b) a)
::
++  get-group-names
  |=  groups=(list gid)
  ^-  (list (pair gid @t))
  %+  sort
    %+  turn  groups
    |=  =gid
    ^-  (pair ^gid @t)
    =/  group-data
      .^  (unit association:ms)
        %gx
        (scot %p our.bol)
        %metadata-store
        (scot %da now.bol)
        /metadata/groups/ship/(scot %p p.gid)/[q.gid]/noun
      ==
    ?~  group-data
      [gid q.gid]
    [gid title.metadatum.u.group-data]
  |=([[* a=@] [* b=@]] (aor a b))
::
++  all-group-names
  ^-  (list (pair gid @t))
  (get-group-names ~(tap in get-groups))
::
++  get-groups
  ^-  (set gid)
  %.  head
  %~  run  in
  %.  %groups
  %~  get  ju
  .^  (jug app-name:ms [gid *])
    %gy
    (scot %p our.bol)
    %metadata-store
    (scot %da now.bol)
    /app-indices
  ==
++  our-life
  .^  life
    %j
    (scot %p our.bol)
    %life
    (scot %da now.bol)
    /(scot %p our.bol)
  ==
--
