import React, {useState, useEffect} from "react";
import ConnStatus from "./components/ConnStatus";
import SelectGid from "./components/SelectGid";
import Huts from "./components/Huts";
import ChatInput from "./components/ChatInput";
import People from "./components/People";
import Messages from "./components/Messages";
import { appPoke, gidToStr, hutToStr } from "~/lib";
import { OUR } from "~/const";
import api from "~/api";
import "~/app.css";

export default function App() {
  const [subEvent, setSubEvent] = useState({});   // object
  const [conn, setConn] = useState(null);         // string?

  // gid: ~host/squad-name
  // hut: hut-name
  const [squads, setSquads] = useState(new Map());             // gid => title
  const [huts, setHuts] = useState(new Map());                 // gid => {hut, ...}
  const [chatContents, setChatContents] = useState(new Map()); // hut => [string, ...]
  const [chatMembers, setChatMembers] = useState(new Map());   // gid => {~member, ...}

  const [chatInput, setChatInput] = useState("");      // string
  const [hutInput, setHutInput] = useState("");        // string
  const [joinSelect, setJoinSelect] = useState("def"); // string (option)
  const [viewSelect, setViewSelect] = useState("def"); // string (option)
  const [currGid, setCurrGid] = useState(null);        // gid?
  const [currHut, setCurrHut] = useState(null);        // hut?

  useEffect(() => {
    api.onOpen = () => setConn("ok");
    api.onRetry = () => setConn("try");
    api.onError = () => setConn("err");

    const subscription = api.subscribe({
      app: "hut",
      path: "/all",
      event: setSubEvent,
    });
    return () => {
      api.unsubscribe(subscription);
    };
  }, [api]);

  useEffect(() => {
    api.scry({
      app: "squad",
      path: "/titles",
    }).then((titles) => {
      let newHuts = new Map();
      titles.forEach(obj => {
        const gidStr = gidToStr(obj.gid);
        if (!newHuts.has(gidStr) && (obj.gid.host === OUR)) {
          newHuts.set(gidStr, new Set());
        }
      });
      const newSquads = new Map(
        titles.map(obj => [gidToStr(obj.gid), obj.title])
      );

      setHuts(newHuts);
      setSquads(newSquads);
    });
  }, []);

  useEffect(() => {
    const updateFuns = {
      "initAll": (update) => {
        update.huts.forEach(obj =>
          huts.set(gidToStr(obj.gid), new Set(obj.names))
        );

        setHuts(new Map(huts));
        setChatContents(new Map(
          update.msgJar.map(o => [hutToStr(o.hut), o.msgs])
        ));
        setChatMembers(new Map(
          update.joined.map(o => [gidToStr(o.gid), new Set(o.ppl)])
        ));
      }, "init": (update) => {
        setChatContents(new Map(update.msgJar.reduce(
          (a, n) => a.set(hutToStr(n.hut), n.msgs)
        , chatContents)));
        setHuts(new Map(huts.set(
          gidToStr(update.huts[0].gid),
          new Set(update.huts[0].names)
        )));
        setChatMembers(new Map(chatMembers.set(
          gidToStr(update.joined[0].gid),
          new Set(update.joined[0].ppl)
        )));
      }, "new": (update) => {
        const gidStr = gidToStr(update.hut.gid);
        const hutStr = hutToStr(update.hut);
        if (huts.has(gidStr)) {
          huts.get(gidStr).add(update.hut.name);
        } else {
          huts.set(gidStr, new Set(update.hut.name));
        }

        setHuts(new Map(huts));
        setChatMembers(new Map(chatMembers.set(hutStr, update.msgs)));
      }, "post": (update) => {
        const newHut = hutToStr(update.hut);
        if (chatContents.has(newHut)) {
          chatContents.set(newHut, [...chatContents.get(newHut), update.msg]);
        } else {
          chatContents.set(newHut, [update.msg]);
        }

        setChatContents(new Map(chatContents));
      }, "join": (update) => {
        const gidStr = gidToStr(update.gid);
        if (chatMembers.has(gidStr)) {
          chatMembers.get(gidStr).add(update.who)
        } else {
          chatMembers.set(gidStr, new Set([update.who]));
        }

        setChatMembers(new Map(chatMembers));
        setJoinSelect("def");
      }, "quit": (update) => {
        const gidStr = gidToStr(update.gid);
        if (update.who === OUR) {
          huts.delete(gidStr);
          chatMembers.delete(gidStr);
          if(huts.has(gidStr)) {
            huts.get(gidStr).forEach(name =>
              chatContents.delete(gidStr + "/" + name)
            );
          }

          setHuts(new Map(huts));
          setChatMembers(new Map(chatMembers));
          setChatContents(new Map(chatContents));
          setCurrGid((currGid === gidStr) ? null : currGid);
          setCurrHut((currHut === null)
            ? null
            : (`${currHut.split("/")[0]}/${currHut.split("/")[1]}` === gidStr)
              ? null
              : currHut
          );
          setViewSelect("def");
          setHutInput((currGid === gidStr) ? "" : hutInput);
        } else {
          if (chatMembers.has(gidStr)) {
            chatMembers.get(gidStr).delete(update.who);
          }

          setChatMembers(new Map(chatMembers));
        }
      }, "del": (update) => {
        const gidStr = gidToStr(update.hut.gid);
        const hutStr = hutToStr(update.hut);
        if (huts.has(gidStr)) {
          huts.get(gidStr).delete(update.hut.name);
        }
        chatContents.delete(hutStr);

        setHuts(new Map(huts));
        setChatContents(new Map(chatContents));
        setCurrHut((currHut === hutStr) ? null : currHut);
      },
    };

    const eventTypes = Object.keys(subEvent);
    if (eventTypes.length > 0) {
      const eventType = eventTypes[0];
      updateFuns[eventType](subEvent[eventType]);
    }
  }, [subEvent]);

  return (
    <React.Fragment>
      <ConnStatus conn={conn}/>
      <SelectGid
        huts={huts}
        squads={squads}
        currGid={currGid}
        setGid={e => {setCurrGid(e); setCurrHut(null); setHutInput("");}}
        viewSelect={viewSelect}
        setView={setViewSelect}
        joinSelect={joinSelect}
        setJoin={setJoinSelect}
      />
      <main>
        <Huts
          huts={(!huts.has(currGid))
            ? []
            : [...huts.get(currGid)].map(name => `${currGid}/${name}`)
          }
          input={hutInput}
          setInput={setHutInput}
          currHut={currHut}
          setHut={setCurrHut}
          currGid={currGid}
        />
        <div className="content">
          <Messages
            content={(!chatContents.has(currHut))
              ? []
              : chatContents.get(currHut)
            }
          />
          <ChatInput
            input={chatInput}
            setInput={setChatInput}
            currHut={currHut} />
        </div>
        <People
          ships={(currGid === null)
            ? []
            : (!chatMembers.has(currGid))
              ? []
              : [...chatMembers.get(currGid)]
          }
          currGid={currGid}
          currHut={currHut}
        />
      </main>
    </React.Fragment>
  );
}
