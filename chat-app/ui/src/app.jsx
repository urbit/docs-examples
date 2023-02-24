import React, {Component} from "react";
import Urbit from "@urbit/http-api";
import ConnStatus from "./components/ConnStatus";
import SelectGid from "./components/SelectGid";
import Huts from "./components/Huts";
import ChatInput from "./components/ChatInput";
import People from "./components/People";
import Messages from "./components/Messages";
import { appPoke } from "./lib";
import { OUR } from "./const";
import api from "./api";
import "./app.css"; // FIXME: Not applying 'textarea' css properly

export default class App extends Component {
  constructor(props) {
    super(props);
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
    api.onOpen = () => this.setState({conn: "ok"});
    api.onRetry = () => this.setState({conn: "try"});
    api.onError = () => this.setState({conn: "err"});
    this.bottom = React.createRef();
  };

  componentDidMount() {
    this.subscribe();
    this.getTitles();
  };

  scrollToBottom = () => this.bottom.current.scrollIntoView();

  gidToStr = gid => `${gid.host}/${gid.name}`;
  hutToStr = hut => `${hut.gid.host}/${hut.gid.name}/${hut.name}`;

  subscribe = () => {
    api.subscribe({
      app: "hut",
      path: "/all",
      event: this.handleUpdate
    });
  };

  getTitles = async () => {
    const huts = this.state.huts;
    const titles = await api.scry({
      app: "squad",
      path: "/titles"
    });
    titles.forEach(obj => {
      const gidStr = this.gidToStr(obj.gid);
      !huts.has(gidStr)
        && (obj.gid.host === OUR)
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
      if (OUR === upd.quit.who) {
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
          viewSelect: "def",
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

  joinGid = () => {
    const joinSelect = this.state.joinSelect
    if (joinSelect === "def") return;
    const [host, name] = joinSelect.split("/");
    appPoke({
      "join": {
        "gid" : {"host": host, "name": name},
        "who" : OUR
      }
    });
    this.setState({joinSelect: "def"})
  };

  render() {
    return (
      <React.Fragment>
        <ConnStatus conn={this.state.conn}/>
        <SelectGid
          huts={this.state.huts}
          currentGid={this.state.currentGid}
          squads={this.state.squads}
          titles={this.state.squads}
          changeGid={this.changeGid}
          viewSelect={this.state.viewSelect}
          joinSelect={this.state.joinSelect}
          setJoin={e => this.setState({joinSelect: e.target.value})}
          joinGid={this.joinGid}
        />
        <main>
          <Huts
            huts={(!this.state.huts.has(this.state.currentGid))
              ? []
              : [...this.state.huts.get(this.state.currentGid)].map(name =>
                this.state.currentGid + "/" + name
              )
            }
            input={this.state.make}
            setInput={e => this.setState({make: e})}
            currentHut={this.state.currentHut}
            currentGid={this.state.currentGid}
            changeHut={this.changeHut}
          />
          <div className="content">
            <Messages
              content={this.state.msgJar.has(this.state.currentHut)
                ? this.state.msgJar.get(this.state.currentHut)
                : []
              }
              bottom={this.bottom}
            />
            <ChatInput
              input={this.state.msg}
              setInput={e => this.setState({msg: e})}
              currentHut={this.state.currentHut} />
          </div>
          <People
            ships={(this.state.currentGid === null)
              ? []
              : (this.state.joined.has(this.state.currentGid))
                ? [...this.state.joined.get(this.state.currentGid)]
                : []
            }
            currentGid={this.state.currentGid}
            currentHut={this.state.currentHut}
          />
        </main>
      </React.Fragment>
    )
  }
};
