import React, {Component} from "react";
import Urbit from "@urbit/http-api";
import ConnStatus from "./components/connStatus"
import SelectGid from "./components/selectGid"
import Huts from "./components/huts"
import ChatInput from "./components/chatInput"
import People from "./components/people"
import Messages from "./components/messages"
import "./app.css";

export class App extends Component {
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
    this.subscribe();
    this.getTitles();
  };

  scrollToBottom = () => this.bottom.current.scrollIntoView();

  gidToStr = gid => gid.host + "/" + gid.name;
  hutToStr = hut => {
    return hut.gid.host + "/" + hut.gid.name + "/" + hut.name;
  };

  subscribe = () => {
    window.urbit.subscribe({
      app: "hut",
      path: "/all",
      event: this.handleUpdate
    });
  };

  getTitles = async () => {
    const huts = this.state.huts;
    const titles = await window.urbit.scry({
      app: "squad",
      path: "/titles"
    });
    titles.forEach(obj => {
      const gidStr = this.gidToStr(obj.gid);
      !huts.has(gidStr)
        && (obj.gid.host === this.our)
        && huts.set(gidStr, new Set())
    })
    this.setState({
      squads: new Map(titles.map(obj =>
        [this.gidToStr(obj.gid), obj.title]
      )),
      huts: huts
    })
  }

  handleUpdate = upd => {
    const {huts, msgJar, joined, currentGid, currentHut} = this.state;
    if ("initAll" in upd) {
      upd.initAll.huts.forEach(obj =>
        huts.set(this.gidToStr(obj.gid), new Set(obj.names))
      );
      this.setState({
        huts: huts,
        msgJar: new Map(
          upd.initAll.msgJar.map(obj => [this.hutToStr(obj.hut), obj.msgs])
        ),
        joined: new Map(
          upd.initAll.joined.map(obj =>
            [this.gidToStr(obj.gid), new Set(obj.ppl)]
          )
        )
      })
    } else if ("init" in upd) {
      upd.init.msgJar.forEach(obj =>
        msgJar.set(this.hutToStr(obj.hut), obj.msgs)
      );
      this.setState({
        msgJar: msgJar,
        huts: huts.set(
          this.gidToStr(upd.init.huts[0].gid),
          new Set(upd.init.huts[0].names)
        ),
        joined: joined.set(
          this.gidToStr(upd.init.joined[0].gid),
          new Set(upd.init.joined[0].ppl)
        )
      })
    } else if ("new" in upd) {
      const gidStr = this.gidToStr(upd.new.hut.gid);
      const hutStr = this.hutToStr(upd.new.hut);
      (huts.has(gidStr))
        ? huts.get(gidStr).add(upd.new.hut.name)
        : huts.set(gidStr, new Set(upd.new.hut.name));
      this.setState({
        huts: huts,
        msgJar: msgJar.set(hutStr, upd.new.msgs)
      })
    } else if ("post" in upd) {
      const hutStr = this.hutToStr(upd.post.hut);
      (msgJar.has(hutStr))
        ? msgJar.get(hutStr).push(upd.post.msg)
        : msgJar.set(hutStr, [upd.post.msg]);
      this.setState(
        {msgJar: msgJar},
        () => {
          (hutStr === this.state.currentHut)
            && this.scrollToBottom();
        }
      )
    } else if ("join" in upd) {
      const gidStr = this.gidToStr(upd.join.gid);
      (joined.has(gidStr))
        ? joined.get(gidStr).add(upd.join.who)
        : joined.set(gidStr, new Set([upd.join.who]));
      this.setState({joined: joined})
    } else if ("quit" in upd) {
      const gidStr = this.gidToStr(upd.quit.gid);
      if ("~" + window.ship === upd.quit.who) {
        (huts.has(gidStr)) &&
          huts.get(gidStr).forEach(name =>
            msgJar.delete(gidStr + "/" + name)
          );
        huts.delete(gidStr);
        joined.delete(gidStr);
        this.setState({
          msgJar: msgJar,
          huts: huts,
          joined: joined,
          currentGid: (currentGid === gidStr)
            ? null : currentGid,
          currentHut: (currentHut === null) ? null :
            (
              currentHut.split("/")[0] + "/" + currentHut.split("/")[1]
                === gidStr
            )
            ? null : currentHut,
          make: (currentGid === gidStr) ? "" : this.state.make
        })
      } else {
        (joined.has(gidStr)) &&
          joined.get(gidStr).delete(upd.quit.who);
        this.setState({joined: joined})
      }
    } else if ("del" in upd) {
      const gidStr = this.gidToStr(upd.del.hut.gid);
      const hutStr = this.hutToStr(upd.del.hut);
      (huts.has(gidStr)) &&
        huts.get(gidStr).delete(upd.del.hut.name);
      msgJar.delete(hutStr);
      this.setState({
        huts: huts,
        msgJar: msgJar,
        currentHut: (currentHut === hutStr) ? null : currentHut
      })
    }
  };

  changeGid = str => {
    if (str === "def") {
      this.setState({
        currentGid: null,
        currentHut: null,
        viewSelect: "def",
        make: ""
      })
    } else {
      this.setState({
        currentGid: str,
        viewSelect: str,
        currentHut: null,
        make: ""
      })
    };
  };

  changeHut = hut => {
    this.setState({
      currentHut: hut,
      msg: ""
    }, () => this.scrollToBottom())
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
    if (this.state.currentGid === null) return;
    const [host, name] = this.state.currentGid.split("/");
    this.doPoke({
      "quit": {
        "gid": {"host": host, "name": name},
        "who": this.our
      }});
    this.setState({
      currentGid: null,
      viewSelect: "def"
    });
  };

  postMsg = () => {
    const { msg, currentHut } = this.state;
    const trimmed = msg.trim();
    if (trimmed !== "" && currentHut !== null) {
      const [host, gidName, hutName] = currentHut.split("/");
      this.doPoke(
        {
          "post": {
            "hut": {
              "gid": {"host": host, "name": gidName},
              "name": hutName
            },
            "msg": {"who": this.our, "what": trimmed}
          }
        }
      );
      this.setState({msg: ""})
    }
  };

  makeHut = () => {
    const { make, currentGid } = this.state;
    const trimmed = make.trim();
    if (trimmed === "" || currentGid === null) return;
    const [host, gidName] = currentGid.split("/");
    this.doPoke(
      {"new": {
        "hut": {"gid": {"host": host, "name": gidName}, "name": make},
        "msgs": []
      }}
    );
    this.setState({make: ""})
  };

  deleteHut = () => {
    const { currentHut } = this.state;
    if (currentHut === null) return;
    const [host, gidName, hutName] = currentHut.split("/")
    if (host !== this.our) return;
    this.doPoke({
      "del": {"hut": {"gid": {"host": host, "name": gidName}, "name": hutName}}
    });
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
        <SelectGid
          our={this.our}
          huts={this.state.huts}
          currentGid={this.state.currentGid}
          squads={this.state.squads}
          titles={this.state.squads}
          changeGid={this.changeGid}
          patpShorten={this.patpShorten}
          viewSelect={this.state.viewSelect}
          joinSelect={this.state.joinSelect}
          setJoin={e => this.setState({joinSelect: e.target.value})}
          joinGid={this.joinGid}
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
          <div className="content">
            <Messages
              currentHut={this.state.currentHut}
              msgJar={this.state.msgJar}
              bottom={this.bottom}
              patpShorten={this.patpShorten}
            />
            <ChatInput
              our={this.our}
              msg={this.state.msg}
              setMsg={e => this.setState({msg: e})}
              postMsg={this.postMsg}
              patpShorten={this.patpShorten}
              currentHut={this.state.currentHut}
            />
          </div>
          <People
            our={this.our}
            joined={this.state.joined}
            currentGid={this.state.currentGid}
            patpShorten={this.patpShorten}
            currentHut={this.state.currentHut}
            deleteHut={this.deleteHut}
            leaveGid={this.leaveGid}
          />
        </main>
      </React.Fragment>
    )
  }
};
