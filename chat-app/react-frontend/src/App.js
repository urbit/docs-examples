import React, {Component} from "react";
import Urbit from "@urbit/http-api";
import "./App.css";
import ConnStatus from "./components/connStatus"
import JoinNew from "./components/joinNew"
import LeaveHut from "./components/leaveHut"
import Allow from "./components/allow"
import CreateHut from "./components/createHut"
import ChatInput from "./components/chatInput"
import People from "./components/people"
import Messages from "./components/messages"
import SelectHut from "./components/selectHut"
import patpValidate from "./patpValidate";

class App extends Component {

  constructor(props) {
    super(props);
    window.urbit = new Urbit("");
    window.urbit.ship = window.ship;
    this.our = "~" + window.ship;
    this.state = {
      conn: null,
      huts: [],
      select: "def",
      make: "",
      add: "",
      id: null,
      host: null,
      name: null,
      msg: "",
      msgs: [],
      ppl: new Map(),
      hover: null,
      join: "",
      areYouSure: false,
    };
    window.urbit.onOpen = () => this.setState({conn: "ok"});
    window.urbit.onRetry = () => this.setState({conn: "try"});
    window.urbit.onError = () => this.setState({conn: "err"});
    this.bottom = React.createRef();
  };

  componentDidMount() {this.getHuts()};

  scrollToBottom = () => this.bottom.current.scrollIntoView();

  getHuts = async () => {
    const huts = await window.urbit.scry({app: "hut", path: "/huts"});
    this.setState({huts: huts});
  };

  resetState = async () => {
    const id = this.state.id;
    (id !== null) && await window.urbit.unsubscribe(id);
    await this.getHuts();
    this.setState({
      id: null,
      host: null,
      name: null,
      msg: "",
      msgs: [],
      ppl: new Map(),
      join: "",
      add: "",
      make: "",
      areYouSure: false
    });
  };

  doPoke = (jon, succ) => {
    window.urbit.poke({
      app: "hut",
      mark: "hut-do",
      json: jon,
      onSuccess: succ
    })
  };

  openHut = async hut => {
    await this.resetState();
    const newID = await window.urbit.subscribe({
      app: "hut",
      path: "/" + hut.host + "/" + hut.name,
      event: this.handleUpdate,
      quit: () => (this.state.host === hut.host) &&
        this.openHut(hut),
      err: () => this.resetState()
    });
    this.setState({
        id: newID,
        host: hut.host,
        name: hut.name,
        select: hut.host + "/" + hut.name,
    })
  };

  joinHut = async hut => {
    if (hut.host === this.our) return;
    this.doPoke(
      {"join": {"host": hut.host, "name": hut.name}},
      () => this.openHut(hut)
    )
  };

  leaveHut = async () => {
    const { host, name } = this.state;
    if (host === null) return;
    this.doPoke(
      {"quit": {"host": host, "name": name}},
      this.resetState
    );
  };

  postMsg = () => {
    const { msg, host, name } = this.state;
    const trimmed = msg.trim();
    (trimmed !== "") &&
      this.doPoke(
        {
          "post": {
            "hut": {"host": host, "name": name},
            "msg": {"who": this.our, "what": msg}
          }
        },
        () => this.setState({msg: ""})
      )
  };

  makeHut = () => {
    const { make } = this.state;
    this.doPoke(
      {"make": {"host": this.our, "name": make}},
      () => {
        this.getHuts();
        this.setState({
          select: this.our + "/" + make,
          make: ""
        });
        this.openHut({host: this.our, name: make})
      }
    )
  };

  addShip = () => {
    const { add, host, name } = this.state;
    (host === this.our && patpValidate(add)) &&
      this.doPoke(
        {
          "ship": {
            "hut": {"host": host, "name": name},
            "who": add
          }
        },
        () => this.setState({add: ""})
      )
  };

  kickShip = ship => {
    const { host, name } = this.state;
    (host === this.our && ship !== this.our) &&
      this.doPoke(
        {
          "kick": {
            "hut": {"host": host, "name": name},
            "who": ship
          }
        }, () => null
      )
  };

  handleUpdate = upd => {
    const { ppl, msgs } = this.state;
    if ("init" in upd)
      this.setState({
        msgs: upd.init.msgs,
        ppl: new Map(upd.init.ppl)
      }, () => {
        this.scrollToBottom()
      });
    else if ("join" in upd)
      this.setState({ppl: ppl.set(upd.join, true)});
    else if ("quit" in upd)
      this.setState({ppl: ppl.set(upd.quit, false)});
    else if ("ship" in upd)
      this.setState({ppl: ppl.set(upd.ship, false)});
    else if ("post" in upd)
      this.setState({
        msgs: [...msgs.slice(-49), upd.post]
      }, () => {
        this.scrollToBottom()
      });
    else if ("kick" in upd)
      if (this.our === upd.kick)
        this.setState({select: "def"}, () => this.resetState());
      else {
        ppl.delete(upd.kick);
        this.setState({ppl: ppl})
      }
  };

  patpShorten = patp => {
    if (patp.length <= 14) return patp;
    else if (patp.length <= 28) {
      const [a, b] = patp.split("-").slice(-2);
      return "~" + a + "^" + b;
    }
    else {
      const parts = patp.split("-");
      return parts[0] + "_" + parts[parts.length - 1];
    }
  };

  render() {
    return (
      <React.Fragment>
        <ConnStatus conn={this.state.conn}/>
        <header>
          <SelectHut
            huts={this.state.huts}
            select={this.state.select}
            setSelect={e => this.setState({select: e})}
            openHut={this.openHut}
            patpShorten={this.patpShorten}
          />
          <CreateHut
            make={this.state.make}
            setMake={e => this.setState({make: e})}
            makeHut={this.makeHut}
          />
          <JoinNew
            join={this.state.join}
            joinHut={this.joinHut}
            setJoin={e => this.setState({join: e})}
            patpValidate={patpValidate}
          />
          <Allow
            host={this.state.host}
            add={this.state.add}
            our={this.our}
            setAdd={e => this.setState({add: e})}
            addShip={this.addShip}
          />
          <LeaveHut
            host={this.state.host}
            our={this.our}
            areYouSure={this.state.areYouSure}
            leaveHut={this.leaveHut}
            setAreYouSure={() => this.setState({areYouSure: true})}
          />
        </header>
          <div Class="hut">
            {
              (this.state.host !== null) &&
                this.patpShorten(this.state.host) + '/' + this.state.name
            }
          </div>
        <main>
          <Messages
            msgs={this.state.msgs}
            bottom={this.bottom}
            patpShorten={this.patpShorten}
          />
          <People
            ppl={this.state.ppl}
            hover={this.state.hover}
            host={this.state.host}
            our={this.our}
            setHover={e => this.setState({hover: e})}
            kickShip={this.kickShip}
            patpShorten={this.patpShorten}
          />
        </main>
        <ChatInput
          our={this.our}
          msg={this.state.msg}
          setMsg={e => this.setState({msg: e})}
          postMsg={this.postMsg}
          patpShorten={this.patpShorten}
        />
      </React.Fragment>
    )
  }
};

export default App;
