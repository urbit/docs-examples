import React, { Component } from 'react';

class JoinNew extends Component {

  render() {
    const { our, huts, squads, joinSelect, setJoin, joinGid } = this.props;
    return (
      <p>
        <select onChange={setJoin} value={joinSelect}>
          <option value="def">Select</option>
          {
            [...squads].filter(
              ([gid, title]) => ((gid.host !== our) && !(huts.has(gid)))
            ).map(([gid, title]) =>
              <option value={gid.host + "/" + gid.name}>{title}</option>
            )
          }
        </select>
        <button Class="join-button" onClick={() => joinGid()}>
          join
        </button>
 
      </p>
    )
  }
};

export default JoinNew;

