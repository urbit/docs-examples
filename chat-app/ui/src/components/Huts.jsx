import React, { useState } from "react";
import { appPoke, isLocalGroup } from "./../lib";

export default function Huts({
  input,
  setInput,
  currentHut,
  currentGid,
  huts,
  changeHut,
}) {
  const createHut = (e) => {
    const trimmed = input.trim();
    if ((e.key === "Enter") && !e.shiftKey
        && /^[a-z][-a-z0-9]*$/.test(input)
        && (trimmed !== "")
        && (currentGid !== null)) {
      const [host, gidName] = currentGid.split("/");
      appPoke({
        "new": {
          "hut": {"gid": {"host": host, "name": gidName}, "name": input},
          "msgs": []
        }
      });
      setInput("");
    }
  };

  return (currentGid !== null) && (
    <div className="left-menu">
      <p className="font-semibold text-wall-400 mb-2">Chats</p>
      {isLocalGroup(currentGid) &&
        <input
          className="make-hut"
          placeholder="new-hut123"
          type="text"
          value={input}
          onChange={e => {
            if (/(^$|^[a-z][-a-z0-9]*$)/.test(e.target.value)) {
              setInput(e.target.value)
            }
          }}
          onKeyUp={createHut}
        />
      }
      <div>
        {huts.map(hut =>
          <div
            className={(hut === currentHut) ? "current-hut" : "other-hut"}
            key={hut}
            onClick={() => changeHut(hut)}
          >
            {(hut === currentHut)
              ? <strong>{hut.split("/")[2]}</strong>
              : hut.split("/")[2]
            }
          </div>
        )}
      </div>
    </div>
  );
}
