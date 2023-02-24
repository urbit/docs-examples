import React from 'react';
import { isLocalGroup } from "./../lib";

export default function Huts({
  currentHut,
  currentGid,
  huts,
  make,
  setMake,
  makeHut,
  changeHut,
}) {
  const handleMake = () => (
    /^[a-z][-a-z0-9]*$/.test(make) && makeHut()
  );
  const handleKey = (e) => (
    (e.key === "Enter") && !e.shiftKey && handleMake()
  );
  const handleChange = (e) => (
    /(^$|^[a-z][-a-z0-9]*$)/.test(e.target.value) && setMake(e.target.value)
  );

  const theseHuts = (!huts.has(currentGid))
    ? []
    : [...huts.get(currentGid)].map(name => currentGid + "/" + name);

  return (currentGid !== null) && (
    <div className="left-menu">
      <p className="font-semibold text-wall-400 mb-2">Chats</p>
      {isLocalGroup(currentGid) &&
        <input
          className="make-hut"
          placeholder="new-hut123"
          type="text"
          value={make}
          onChange={handleChange}
          onKeyUp={handleKey}
        />
      }
      <div>
        {theseHuts.map(hut =>
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
