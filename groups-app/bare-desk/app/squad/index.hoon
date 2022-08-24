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
    ;link(href "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Source+Code+Pro:wght@400;600&display=swap", rel "stylesheet");
    ;style
      ;+  ;/  style
    ==
  ==
  ;body
    ;main
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
      =class        "code"
      =size         "30"
      =required     ""
      =placeholder  "~sampel-palnet/squad-name"
      ;+  ;/("")
    ==
    ;button(type "submit"): Join
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
    ;div(style "border: 1px solid #ccc; border-radius: 5px; padding: 0.5rem;")
      ;input
        =type   "checkbox"
        =id     "new-pub-checkbox"
        =style  "margin-right: 0.5rem"
        =name   "public"
        =value  "true"
        ;+  ;/("")
      ==
      ;label(for "new-pub-checkbox"): Public
    ==
    ;br;
    ;button(type "submit"): Create
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
      ;h3(class "inline"): {(trip title.squad)}
    ==
  =/  content=manx
    ;div
      ;p
        ;span(style "margin-right: 2px;"): id:
        ;span(class "code"): {<host.gid>}/{(trip name.gid)}
      ==
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
    ;button(type "submit"): Change
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
    ;button(type "submit"): {?:(pub.squad "make private" "make public")}
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
    ;button(type "submit", class "bg-red text-white"): {?:(=(our.bol host.gid) "delete" "leave")}
  ==
::
++  squad-acl-component
  |=  [=gid =squad]
  ^-  manx
  =/  acl=(list @p)  ~(tap in (~(get ju acls) gid))
  =/  gid-str=tape  "{=>(<host.gid> ?>(?=(^ .) t))}_{(trip name.gid)}"
  =/  summary=manx
    ;summary
      ;h4(class "inline"): {?:(pub.squad "blacklist" "whitelist")} ({(a-co:co (lent acl))})
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
      ;h4(class "inline"): members ({(a-co:co (lent members))})
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
    a:hover {
      opacity: 0.8;
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
