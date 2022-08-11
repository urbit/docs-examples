import React, { Component } from 'react';

class SelectGid extends Component {

  render() {
    const {
      our,
      huts,
      squads,
      titles,
      changeGid,
      currentGid,
      patpShorten,
      viewSelect,
      joinSelect,
      setJoin,
      joinGid
    } = this.props;
    return (
      <div Class="top-bar">
        <select
          Class="gid-select"
          onChange={e => changeGid(e.target.value)}
          value={viewSelect}>
          <option value="def">---squad---</option>
          {
            [...huts.keys()].map((gidStr) =>
              <option value={gidStr}>
                {
                  (titles.has(gidStr))
                    ? titles.get(gidStr)
                    : patpShorten(gidStr.split("/")[0])
                      + "/" + gidStr.split("/")[1]
                }
              </option>
            )
          }
        </select>
        {
          (currentGid !== null) &&
            <span Class="gid-title">
              {
                squads.has(currentGid) ? squads.get(currentGid) : currentGid
              }
            </span>
        }
        <span Class="join-span">
          <select Class="join-select" onChange={setJoin} value={joinSelect}>
            <option value="def">select</option>
            {
              [...squads].filter(
                ([gidStr, title]) =>
                ((gidStr.split("/")[0] !== our) && !(huts.has(gidStr)))
              ).map(([gidStr, title]) =>
                <option value={gidStr}>{title}</option>
              )
            }
          </select>
          <button Class="join-button" onClick={() => joinGid()}>
            join
          </button>
        </span>
      </div>
    )
  }
}

export default SelectGid;
