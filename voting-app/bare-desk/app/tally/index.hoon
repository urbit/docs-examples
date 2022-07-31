/-  *tally, *squad
|=  [bol=bowl:gall =by-group voted=(set pid) withdrawn=(set pid)]
^-  manx
?.  .^(? %gu /(scot %p our.bol)/squad/(scot %da now.bol))
  ;html
    ;head
      ;title: Tally
      ;meta(charset "utf-8");
      ;style
        ;+  ;/
            ^~
            ^-  tape
            %-  trip
            '''
            body {width: 100%; height: 100%; margin: 0;}
            * {font-family: monospace}
            div {
              position: relative;
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
              width: 40ch;
            }
            '''
      ==
    ==
    ;body
      ;div
        ;h3: Squad app not installed
        ;p
          ;+  ;/  "Tally depends on the Squad app. ".
                  "You can install it from "
          ;a/"web+urbitgraph://~pocwet/squad": ~pocwet/squad
        ==
      ==
    ==
  ==
=/  all-squads=(list (pair gid squad))
  %+  sort
    %~  tap  by
    .^  (map gid squad)
      %gx
      (scot %p our.bol)
      %squad
      (scot %da now.bol)
      %squads
      /noun
    ==
  |=  [a=(pair gid squad) b=(pair gid squad)]
  (aor title.q.a title.q.b)
=/  has-polls
  %+  skim  all-squads
  |=  (pair gid squad)
  (~(has by by-group) p)
=/  our-life
  .^  life
    %j
    (scot %p our.bol)
    %life
    (scot %da now.bol)
    /(scot %p our.bol)
  ==
|^
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
    ;form(method "post", action "/tally/watch")
      ;select
        =name      "gid"
        =required  ""
        ;*  (group-options-component %.n %.n)
      ==
      ;input(id "s", type "submit", value "watch");
    ==
    ;form(method "post", action "/tally/leave")
      ;select
        =name      "gid"
        =required  ""
        ;*  (group-options-component %.n %.y)
      ==
      ;input(id "u", type "submit", value "leave");
    ==
    ;h2: new poll
    ;form(method "post", action "/tally/new")
      ;label(for "n-gid"): group:
      ;select
        =id        "n-gid"
        =name      "gid"
        =required  ""
        ;*  (group-options-component %.y %.y)
      ==
      ;br;
      ;label(for "days"): duration:
      ;input
        =type         "number"
        =id           "days"
        =name         "days"
        =min          "1"
        =step         "1"
        =required     ""
        =placeholder  "days"
        ;+  ;/("")
      ==
      ;br;
      ;label(for "proposal"): proposal:
      ;input
        =type      "text"
        =id        "proposal"
        =name      "proposal"
        =size      "50"
        =required  ""
        ;+  ;/("")
      ==
      ;br;
      ;input(id "submit", type "submit", value "submit");
    ==
    ;h2: groups
    ;*  ?~  has-polls
          ~[;/("")]
        (turn has-polls group-component)
  ==
==
::
++  group-options-component
  |=  [our=? in-subs=?]
  ^-  marl
  =/  subs=(set gid)
    %-  ~(gas in *(set gid))
    %+  turn  ~(tap by wex.bol)
    |=  [[=wire *] *]
    ^-  gid
    ?>  ?=([@ @ ~] wire)
    [(slav %p i.wire) i.t.wire]
  =?  all-squads  &(our in-subs)
    (skim all-squads |=((pair gid squad) |(=(our.bol host.p) (~(has in subs) p))))
  =?  all-squads  &(!our in-subs)
    (skim all-squads |=((pair gid squad) (~(has in subs) p)))
  =?  all-squads  &(!our !in-subs)
    (skip all-squads |=((pair gid squad) |(=(our.bol host.p) (~(has in subs) p))))
  %+  turn  all-squads
  |=  (pair gid squad)
  ^-  manx
  ;option(value "{=>(<host.p> ?>(?=(^ .) t))}_{(trip name.p)}"): {(trip title.q)}
::
++  group-component
  |=  (pair gid squad)
  ^-  manx
  =/  polls=(list [=pid =poll =votes])
    ~(tap by (~(got by by-group) p))
  =/  open=@ud
    %-  lent
    %+  skim  polls
    |=  [* =poll *]
    (gth expiry.poll now.bol)
  =/  title=tape
    %+  weld  (trip title.q)
    ?:  =(0 open)
      ""
    " ({(a-co:co open)})"
  ;details(id "{=>(<host.p> ?>(?=(^ .) t))}_{(trip name.p)}", open "open")
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
    ;+  ?.  ?|  =(our.bol host.gid)
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
            ;form(method "post", action "/tally/withdraw")
              ;input
                =type  "hidden"
                =name  "gid"
                =value  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
                ;+  ;/("")
              ==
              ;input(type "hidden", name "pid", value (a-co:co pid));
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
            ;form(method "post", action "/tally/vote")
              ;input
                =type   "hidden"
                =name   "gid"
                =value  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
                ;+  ;/("")
              ==
              ;input(type "hidden", name "pid", value (a-co:co pid));
              ;input(id "yea", type "submit", name "choice", value "yea");
              ;input(id "nay", type "submit", name "choice", value "nay");
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
::
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
::
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
