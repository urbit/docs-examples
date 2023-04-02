import React from 'react';
import { appPoke, patpShorten, isRemoteGroup } from "~/lib";
import { OUR } from "~/const";

export default function SelectGid({
  huts,
  squads,
  currGid,
  setGid,
  viewSelect,
  setView,
  joinSelect,
  setJoin,
}) {
  const handleJoin = () => {
    if (joinSelect !== "def") {
      const [host, name] = joinSelect.split("/");
      appPoke({
        "join": {
          "gid" : {"host": host, "name": name},
          "who" : OUR
        }
      });
    }
  };

  const handleView = (newView) => {
    setView(newView);
    setGid((newView === "def") ? null : newView);
  };

  return (
    <div className="top-bar">
      <select
        onChange={e => handleView(e.target.value)}
        value={viewSelect}>
        <option value="def">Squads</option>
        {[...huts.keys()].map((gidStr) =>
          <option key={gidStr} value={gidStr}>
            {(squads.has(gidStr))
              ? squads.get(gidStr)
              : patpShorten(gidStr.split("/")[0]) + "/" + gidStr.split("/")[1]
            }
          </option>
        )}
      </select>
      {(currGid !== null) &&
        <span className="gid-title">
          {squads.has(currGid)
            ? squads.get(currGid)
            : currGid
          }
        </span>
      }
      <div>
        <select
            className="join-select"
            value={joinSelect}
            onChange={(e) => setJoin(e.target.value)}
            >
          <option value="def">Select</option>
          {[...squads].filter(
              ([gidStr, title]) => (isRemoteGroup(gidStr) && !(huts.has(gidStr)))
            ).map(([gidStr, title]) =>
              <option key={gidStr} value={gidStr}>{title}</option>
          )}
        </select>
        <a className='join-button' onClick={handleJoin}>
          Join
        </a>
      </div>
    </div>
  );
}
