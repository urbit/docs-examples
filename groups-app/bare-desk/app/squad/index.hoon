/-  *squad
|=  [bol=bowl:gall =squads =acls =members =page]
|^  ^-  octs
%-  as-octs:mimes:html
%-  crip
%-  en-xml:html
^-  manx
;html
  ;head
    ;title: squad
    ;meta(charset "utf-8");
    ;style
      ;+  ;/  style
    ==
  ==
  ;body
    ;+  ?.  =('generic' sect.page)
          ;/("")
        %+  success-component
          ?:(success.page "success" "failed")
        success.page
    ;h2: join
    ;+  join-component
    ;h2: create
    ;+  new-component
    ;+  ?~  squads
          ;/("")
        ;h2: squads
    ;*  %+  turn
          %+  sort  ~(tap by squads)
          |=  [a=[* =title *] b=[* =title *]]
          (aor title.a title.b)
        squad-component
  ==
==
::
++  success-component
  |=  [txt=tape success=?]
  ^-  manx
  ;span(class ?:(success "success" "failure")): {txt}
::
++  join-component
  ^-  manx
  ;form(method "post", action "/squad/join")
    ;input
      =type         "text"
      =id           "join"
      =name         "target-squad"
      =size         "30"
      =required     ""
      =placeholder  "~sampel-palnet/squad-name"
      ;+  ;/("")
    ==
    ;input(type "submit", value "join");
    ;+  ?.  =('join' sect.page)
          ;/("")
        %+  success-component
          ?:(success.page "request sent" "failed")
        success.page
  ==
::
++  new-component
  ^-  manx
  ;form(class "new-form", method "post", action "/squad/new")
    ;input
      =type         "text"
      =id           "new"
      =name         "title"
      =size         "30"
      =required     ""
      =placeholder  "My squad"
      ;+  ;/("")
    ==
    ;br;
    ;label(for "new-pub-checkbox"): Public:
    ;input
      =type   "checkbox"
      =id     "new-pub-checkbox"
      =name   "public"
      =value  "true"
      ;+  ;/("")
    ==
    ;br;
    ;input(type "submit", value "create");
    ;+  ?.  =('new' sect.page)
          ;/("")
        %+  success-component
          ?:(success.page "success" "failed")
        success.page
  ==
::
++  squad-component
  |=  [=gid =squad]
  ^-  manx
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  =/  summary=manx
    ;summary
      ;h3: {(trip title.squad)}
    ==
  =/  content=manx
    ;div
      ;p: id: {<host.gid>}/{(trip name.gid)}
      ;+  ?.  =(our.bol host.gid)
            ;/("")
          (squad-title-component gid squad)
      ;+  (squad-leave-component gid)
      ;+  ?.  =(our.bol host.gid)
            ;/("")
          (squad-public-component gid squad)
      ;+  (squad-acl-component gid squad)
      ;+  (squad-members-component gid squad)
    ==
  ?:  &(?=(^ gid.page) =(gid u.gid.page))
    ;details(id gid-str, open "open")
      ;+  summary
      ;+  content
    ==
  ;details(id gid-str)
    ;+  summary
    ;+  content
  ==
::
++  squad-title-component
  |=  [=gid =squad]
  ^-  manx
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  ;form(method "post", action "/squad/title")
    ;input(type "hidden", name "gid", value gid-str);
    ;label(for "title:{gid-str}"): title:
    ;input
      =type         "text"
      =id           "title:{gid-str}"
      =name         "title"
      =size         "30"
      =required     ""
      =placeholder  "My Squad"
      ;+  ;/("")
    ==
    ;input(type "submit", value "change");
    ;+  ?.  &(=('title' sect.page) ?=(^ gid.page) =(gid u.gid.page))
          ;/("")
        %+  success-component
          ?:(success.page "success" "failed")
        success.page
  ==
::
++  squad-public-component
  |=  [=gid =squad]
  ^-  manx
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  ;form(method "post", action "/squad/{?:(pub.squad "private" "public")}")
    ;input(type "hidden", name "gid", value gid-str);
    ;input(type "submit", value ?:(pub.squad "make private" "make public"));
    ;+  ?.  &(=('public' sect.page) ?=(^ gid.page) =(gid u.gid.page))
          ;/("")
        %+  success-component
          ?:(success.page "success" "failed")
        success.page
  ==
::
++  squad-leave-component
  |=  =gid
  ^-  manx
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  ;form
    =class     ?:(=(our.bol host.gid) "delete-form" "leave-form")
    =method    "post"
    =action    ?:(=(our.bol host.gid) "/squad/delete" "/squad/leave")
    =onsubmit  ?.(=(our.bol host.gid) "" "return confirm('Are you sure?');")
    ;input(type "hidden", name "gid", value gid-str);
    ;input(type "submit", value ?:(=(our.bol host.gid) "delete" "leave"));
  ==
::
++  squad-acl-component
  |=  [=gid =squad]
  ^-  manx
  =/  acl=(list @p)  ~(tap in (~(get ju acls) gid))
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  =/  summary=manx
    ;summary
      ;h4: {?:(pub.squad "blacklist" "whitelist")} ({(a-co:co (lent acl))})
    ==
  =/  kick-allow-form=manx
    ;form(method "post", action "/squad/{?:(pub.squad "kick" "allow")}")
      ;input(type "hidden", name "gid", value gid-str);
      ;input
        =type         "text"
        =id           "acl-diff:{gid-str}"
        =name         "ship"
        =size         "30"
        =required     ""
        =placeholder  "~sampel-palnet"
        ;+  ;/("")
      ==
      ;input(type "submit", value ?:(pub.squad "blacklist" "whitelist"));
      ;+  ?.  &(=('kick' sect.page) ?=(^ gid.page) =(gid u.gid.page))
            ;/("")
          %+  success-component
            ?:(success.page "success" "failed")
          success.page
    ==
  =/  ships=manx
    ;div(id "acl:{gid-str}")
      ;*  %+  turn
            %+  sort  acl
            |=([a=@p b=@p] (aor (cite:^title a) (cite:^title b)))
          |=(=ship (ship-acl-item-component gid ship pub.squad))
    ==
  ?.  &(=('kick' sect.page) ?=(^ gid.page) =(gid u.gid.page))
    ;details
      ;+  summary
      ;div
        ;+  ?.  =(our.bol host.gid)
              ;/("")
            kick-allow-form
        ;+  ships
      ==
    ==
  ;details(open "open")
    ;+  summary
    ;div
      ;+  ?.  =(our.bol host.gid)
            ;/("")
          kick-allow-form
      ;+  ships
    ==
  ==
::
++  ship-acl-item-component
  |=  [=gid =ship pub=?]
  ^-  manx
  ?.  =(our.bol host.gid)
    ;span(class "ship-acl-span"): {(cite:^title ship)}
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  ;form
    =class   "ship-acl-form"
    =method  "post"
    =action  "/squad/{?:(pub "allow" "kick")}"
    ;input(type "hidden", name "gid", value gid-str);
    ;input(type "hidden", name "ship", value <ship>);
    ;input(type "submit", value "{(cite:^title ship)} ×");
  ==
::
++  squad-members-component
  |=  [=gid =squad]
  ^-  manx
  =/  members=(list @p)  ~(tap in (~(get ju members) gid))
  ;details
    ;summary
      ;h4: members ({(a-co:co (lent members))})
    ==
    ;div
      ;*  %+  turn
            %+  sort  members
            |=([a=@p b=@p] (aor (cite:^title a) (cite:^title b)))
          |=  =ship
          ^-  manx
          ;span(class "ship-members-span"): {(cite:^title ship)}
    ==
  ==
++  style
  ^~
  %-  trip
  '''
  body {
    background-color: white;
    color: black;
  }
  * {font-family: monospace}
  summary > * {display: inline}
  details > div {margin: 1em 2ch}
  label {padding-right: 1ch}
  .success {
    background-color: #bfee90;
    color: green;
    padding: 3px;
    border: 1px solid green;
    border-radius: 2px;
  }
  .failure {
    background-color: #ab4642;
    padding: 3px;
    color: white;
    border: 1px solid darkred;
    border-radius: 2px;

  }
  .success:not(:first-child), .failure:not(:first-child) {
    margin-left: 1ch
  }
  .delete-form > input:hover {
    background-color: #ab4642;
    color: white;
    border-color: #ab4642;
  }
  .ship-acl-form {display: inline}
  .ship-acl-form > input {
    background-color: white;
    border: 1px solid lightgrey;
  }
  .ship-acl-form > input:hover {
    background-color: #ab4642;
    color: white;
    border-color: #ab4642;
  }
  .ship-acl-form:not(:last-child) {
    padding-right: 1ch;
  }
  .ship-members-span:not(:last-child), .ship-acl-span:not(:last-child) {
    padding-right: 1ch;
  }
  .new-form {line-height: 300%}
  input[type=text] + input[type=submit] {margin-left: 1ch}
  '''
--
