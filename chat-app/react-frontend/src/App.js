import React, {Component} from "react";
import Urbit from "@urbit/http-api";
import "./App.css";
import ConnStatus from "./components/connStatus"
import JoinNew from "./components/joinNew"
import SelectGid from "./components/selectGid"
import Huts from "./components/huts"
import ChatInput from "./components/chatInput"
import People from "./components/people"
import Messages from "./components/messages"

class App extends Component {

  constructor(props) {
    super(props);
    window.urbit = new Urbit("");
    window.urbit.ship = window.ship;
    this.our = "~" + window.ship;
    this.state = {
      squads: new Map(),
      huts:   new Map(),
      msgJar: new Map(),
      joined: new Map(),
      currentGid: null,
      currentHut: null,
      conn: null,
      joinSelect: "def",
      viewSelect: "def",
      make: "",
      msg: "",
    };
    window.urbit.onOpen = () => this.setState({conn: "ok"});
    window.urbit.onRetry = () => this.setState({conn: "try"});
    window.urbit.onError = () => this.setState({conn: "err"});
    this.bottom = React.createRef();
  };

  componentDidMount() {
    this.getTitles();
    this.subscribe();
  };

  scrollToBottom = () => this.bottom.current.scrollIntoView();

  subscribe = () => {
    window.urbit.subscribe({
      app: "hut",
      path: "/all",
      event: this.handleUpdate
    });
  };

  getTitles = async () => {
    const titles = await window.urbit.scry({
      app: "squad",
      path: "/titles"
    });
    this.setState({squads: new Map(titles.map(obj => [obj.gid, obj.title]))})
  }

  handleUpdate = upd => {
    const {huts, msgJar, joined, currentGid, currentHut} = this.state;
    if ("init-all" in upd) {
      this.setState({
        huts: new Map(
          upd.initAll.huts.map(obj => [obj.gid, new Set(obj.names)])
        ),
        msgJar: new Map(upd.initAll.msgJar.map(obj => [obj.hut, obj.msgs])),
        joined: new Map(
          upd.initAll.joined.map(obj => [obj.gid, new Set(obj.ppl)])
        )
      })
    } else if ("init" in upd) {
      upd.init.msgJar.forEach(obj => (msgJar.set(obj.hut, obj.msgs)));
      this.setState({
        msgJar: msgJar,
        huts: huts.set(
          upd.init.huts[0].gid,
          new Set(upd.init.huts[0].names)
        ),
        joined: joined.set(
          upd.init.joined[0].gid,
          new Set(upd.init.joined[0].ppl)
        )
      })
    } else if ("new" in upd) {
      (huts.has(upd.new.hut.gid))
        ? huts.get(upd.new.hut.gid).add(upd.new.hut.name)
        : huts.set(upd.new.hut.gid, new Set([upd.new.hut.name]));
      this.setState({
        huts: huts,
        msgJar: msgJar.set(upd.new.hut, upd.new.msgs)
      })
    } else if ("post" in upd) {
      (msgJar.has(upd.post.hut))
        ? msgJar.get(upd.post.hut).push(upd.post.msg)
        : msgJar.set(upd.post.hut, [upd.post.msg]);
      this.setState({msgJar: msgJar})
    } else if ("join" in upd) {
      (joined.has(upd.join.gid))
        ? joined.get(upd.join.gid).add(upd.join.who)
        : joined.set(upd.join.gid, new Set([upd.join.who]));
      this.setState({joined: joined})
    } else if ("quit" in upd) {
      if ("~" + window.ship === upd.quit.who) {
        (huts.has(upd.quit.gid)) &&
          huts.get(upd.quit.gid).forEach(name =>
            msgJar.delete({gid: upd.quit.gid, name: name})
          );
        huts.delete(upd.quit.gid);
        joined.delete(upd.quit.gid);
        this.setState({
          msgJar: msgJar,
          huts: huts,
          joined: joined,
          currentGid: (currentGid === upd.quit.gid)
            ? null : currentGid,
          currentHut: (currentHut.gid === upd.quit.gid)
            ? null : currentHut,
          make: (currentGid === upd.quit.gid) ? "" : this.state.make
        })
      } else {
        (joined.has(upd.quit.gid)) &&
          joined.get(upd.quit.gid).delete(upd.quit.who);
        this.setState({joined: joined})
      }
    } else if ("del" in upd) {
      (huts.has(upd.del.hut.gid)) &&
        huts.get(upd.del.hut.gid).delete(upd.del.hut.name);
      msgJar.delete(upd.del.hut);
      this.setState({
        huts: huts,
        msgJar: msgJar,
        currentHut: (currentHut === upd.del.hut) ? null : currentHut
      })
    }
  };

  changeGid = str => {
    if (str === "def") {
      this.setState({currentGid: null, currentHut: null})
    } else {
      const [host, name] = str.split("/");
      this.setState({
        currentGid: {host: host, name: name},
        currentHut: null,
        make: ""
      })
    };
  };

  changeHut = hut => {
    this.setState({
      currentHut: hut,
      msg: ""
    });
  };

  doPoke = jon => {
    window.urbit.poke({
      app: "hut",
      mark: "hut-do",
      json: jon,
    })
  };

  joinGid = () => {
    const joinSelect = this.state.joinSelect
    if (joinSelect === "def") return;
    const [host, name] = joinSelect.split("/");
    this.doPoke(
      {"join": {
        "gid" : {"host": host, "name": name},
        "who" : this.our
      }}
    );
    this.setState({joinSelect: "def"})
  };

  leaveGid = () => {
    const currentGid = this.state.currentGid;
    if (currentGid === null) return;
    this.doPoke({"quit": {"gid": currentGid, "who": this.our}})
  };

  postMsg = () => {
    const { msg, currentHut } = this.state;
    const trimmed = msg.trim();
    if (trimmed !== "" && currentHut !== null) {
      this.doPoke(
        {
          "post": {
            "hut": currentHut,
            "msg": {"who": this.our, "what": msg}
          }
        }
      );
      this.setState({msg: ""})
    }
  };

  makeHut = () => {
    const { make } = this.state;
    const trimmed = make.trim();
    if (trimmed === "") return;
    this.doPoke(
      {"new": {
        "hut": {"host": this.our, "name": make},
        "msgs": []
      }}
    );
    this.setState({make: ""})
  };

  deleteHut = () => {
    const { currentHut } = this.state;
    if (currentHut === null || currentHut.gid.host !== this.our) return;
    this.doPoke({"del": {"hut": currentHut}});
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
          <JoinNew
            our={this.our}
            huts={this.state.huts}
            squads={this.state.squads}
            joinSelect={this.state.joinSelect}
            setJoin={e => this.setState({joinSelect: e})}
            joinGid={this.joinGid}
          />
        </header>
        <SelectGid
          currentGid={this.state.currentGid}
          our={this.our}
          titles={this.state.squads}
          huts={this.state.huts}
          leaveGid={this.leaveHut}
          changeGid={this.changeGid}
          patpShorten={this.patpShorten}
          viewSelect={this.state.viewSelect}
          currentHut={this.state.currentHut}
          deleteHut={this.deleteHut}
        />
        <main>
          <Huts
            currentHut={this.state.currentHut}
            currentGid={this.state.currentGid}
            huts={this.state.huts}
            our={this.our}
            changeHut={this.changeHut}
            make={this.state.make}
            setMake={e => this.setState({make: e})}
            makeHut={this.makeHut}
          />
          <Messages
            currentHut={this.state.currentHut}
            msgJar={this.state.msgJar}
            bottom={this.bottom}
            patpShorten={this.patpShorten}
          />
          <People
            joined={this.state.joined}
            currentHut={this.state.currentHut}
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
