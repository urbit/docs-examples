/-  *tally, *squad
|=  [bol=bowl:gall =by-group voted=(set pid) withdrawn=(set pid)]
^-  manx
?.  .^(? %gu /(scot %p our.bol)/squad/(scot %da now.bol))
  ;html
    ;head
      ;title: Tally
      ;meta(charset "utf-8");
      ;link(href "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Source+Code+Pro:wght@400;600&display=swap", rel "stylesheet");
      ;style
        ;+  ;/
            ^~
            ^-  tape
            %-  trip
            '''
            body {width: 100%; height: 100%; margin: 0;}
            * {font-family: "Inter", sans-serif;}
            div {
              border: 1px solid #ccc;
              border-radius: 5px;
              padding: 1rem;
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
    ;link(href "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Source+Code+Pro:wght@400;600&display=swap", rel "stylesheet");
    ;style
      ;+  ;/  style
    ==
  ==
  ;body
    ;main
      ;h1: Tally
      ;div(style "margin-bottom: 1rem;")
        ;button(id "sub-button", class "active", onclick "{(trip sub-button)}"): Subscriptions
        ;button(id "new-button", class "inactive", onclick "{(trip new-button)}"): New
        ;button(id "group-button", class "inactive", onclick "{(trip group-button)}"): Groups
      ==
      ;div(class "flex col", id "sub")
        ;form(method "post", action "/tally/watch")
          ;select
            =name      "gid"
            =required  ""
            ;*  (group-options-component %.n %.n)
          ==
          ;input(id "s", type "submit", value "Watch");
        ==
        ;form(method "post", action "/tally/leave")
          ;select
            =name      "gid"
            =required  ""
            ;*  (group-options-component %.n %.y)
          ==
          ;input(id "u", type "submit", value "Leave");
        ==
      ==
      ;div(id "new", class "none")
        ;form(method "post", action "/tally/new", class "col align-start")
          ;div
            ;label(for "n-gid"): Group:
            ;select
              =id        "n-gid"
              =name      "gid"
              =style     "margin-left: 1rem"
              =required  ""
              ;*  (group-options-component %.y %.y)
            ==
          ==
          ;br;
          ;label(for "days"): Duration:
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
          ;label(for "proposal"): Proposal:
          ;input
            =type      "text"
            =id        "proposal"
            =name      "proposal"
            =size      "50"
            =required  ""
            ;+  ;/("")
          ==
          ;br;
          ;input(id "submit", type "submit", class "bg-green-400 text-white", value "Submit");
        ==
      ==
      ;div(class "none", id "group")
        ;*  ?~  has-polls
              ~[;/("")]
            (turn has-polls group-component)
      ==
    ==
  ==
==
::
++  sub-button
  '''
    document.getElementById('new').classList = 'none'; 
    document.getElementById('group').classList = 'none'; 
    document.getElementById('sub').classList = 'flex col';
    document.getElementById('sub-button').classList = 'active';
    document.getElementById('new-button').classList = 'inactive';
    document.getElementById('group-button').classList = 'inactive';
  '''
::
++  new-button
  '''
    document.getElementById('new').classList = 'flex col'; 
    document.getElementById('group').classList = 'none'; 
    document.getElementById('sub').classList = 'none';
    document.getElementById('sub-button').classList = 'inactive';
    document.getElementById('new-button').classList = 'active';
    document.getElementById('group-button').classList = 'inactive';
  '''
::
++  group-button
  '''
    document.getElementById('new').classList = 'none'; 
    document.getElementById('group').classList = 'flex col'; 
    document.getElementById('sub').classList = 'none';
    document.getElementById('sub-button').classList = 'inactive';
    document.getElementById('new-button').classList = 'inactive';
    document.getElementById('group-button').classList = 'active';
  '''
::
++  group-options-component
  |=  [our=? in-subs=?]
  ^-  marl
  =/  subs=(set gid)
    %-  ~(gas in *(set gid))
    %+  turn
      %+  skim  ~(tap by wex.bol)
      |=  [[=wire *] *]
      ?=([@ @ ~] wire)
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
      ;h3(class "inline"): {title}
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
              ;input(type "submit", value "withdraw", class "bg-red text-white");
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
    body { 
      display: flex; 
      width: 100%; 
      height: 100%; 
      justify-content: center; 
      align-items: center; 
      font-family: "Inter", sans-serif;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    main {
      width: 100%;
      max-width: 500px;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 1rem;
      min-height: 0;
      max-height: 500px;
      overflow-y: auto;
    }
    button {
      -webkit-appearance: none;
      border: none;
      outline: none;
      border-radius: 100px; 
      font-weight: 500;
      font-size: 1rem;
      padding: 12px 24px;
      cursor: pointer;
    }
    button:hover {
      opacity: 0.8;
    }
    button.inactive {
      background-color: #F4F3F1;
      color: #626160;
    }
    button.active {
      background-color: #000000;
      color: white;
    }
    a {
      text-decoration: none;
      font-weight: 600;
      color: rgb(0,177,113);
    }
    a:hover, input[type="submit"]:hover {
      opacity: 0.8;
      cursor: pointer;
    }
    .none {
      display: none;
    }
    .block {
      display: block;
    }
    code, .code {
      font-family: "Source Code Pro", monospace;
    }
    .bg-green {
      background-color: #12AE22;
    }
    .bg-green-400 {
      background-color: #4eae75;
    }
    .bg-red {
      background-color: #ff4136;
    }
    .text-white {
      color: #fff;
    }
    h3 {
      font-weight: 600;
      font-size: 1rem;
      color: #626160;
    }
    form {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    form button, button[type="submit"] {
      border-radius: 10px;
    }
    input {
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .flex {
      display: flex;
    }
    .col {
      flex-direction: column;
    }
    .align-center {
      align-items: center;
    }
    .align-start {
      align-items: flex-start;
    }
    .justify-between {
      justify-content: space-between;
    }
    .grow {
      flex-grow: 1;
    }
    .inline {
      display: inline;
    }
    @media screen and (max-width: 480px) {
      main {
        padding: 1rem;
      }
    }
  '''
--
