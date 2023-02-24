import React from 'react';
import { patpShorten, isRemoteGroup } from "./../lib";

export default function SelectGid({
  huts,
  squads,
  titles,
  changeGid,
  currentGid,
  viewSelect,
  joinSelect,
  setJoin,
  joinGid,
}) {
  return (
    <div className="top-bar">
      <select
        onChange={e => changeGid(e.target.value)}
        value={viewSelect}>
        <option value="def">Squads</option>
        {[...huts.keys()].map((gidStr) =>
          <option key={gidStr} value={gidStr}>
            {(titles.has(gidStr))
              ? titles.get(gidStr)
              : patpShorten(gidStr.split("/")[0]) + "/" + gidStr.split("/")[1]
            }
          </option>
        )}
      </select>
      {(currentGid !== null) &&
        <span className="gid-title">
          {squads.has(currentGid)
            ? squads.get(currentGid)
            : currentGid
          }
        </span>
      }
      <div>
        <select className="join-select" onChange={setJoin} value={joinSelect}>
          <option value="def">Select</option>
          {[...squads].filter(
              ([gidStr, title]) => (isRemoteGroup(gidStr) && !(huts.has(gidStr)))
            ).map(([gidStr, title]) =>
              <option key={gidStr} value={gidStr}>{title}</option>
          )}
        </select>
        <a className='join-button' onClick={() => joinGid()}>
          Join
        </a>
      </div>
    </div>
  );
}
