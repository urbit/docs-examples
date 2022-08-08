import React, { Component } from 'react';

class Huts extends Component {

  handleKey = (e) =>
    (e.key === "Enter") &&
      !e.shiftKey &&
        this.handleMake();

  handleMake = () =>
    /^[a-z][-a-z0-9]*$/.test(this.props.make) && this.props.makeHut();

  handleChange = (e) =>
    /(^$|^[a-z][-a-z0-9]*$)/.test(e.target.value) &&
      this.props.setMake(e.target.value);

  render() {
    const { currentHut, currentGid, huts, our, make, changeHut } = this.props;
    const theseHuts = (huts.has(currentGid))
          ? [...huts.get(currentGid)].map(name => {
            return {gid: currentGid, name: name}
          })
          : []
    return (
      <div Class="hut-list">
        {
          (currentGid.host === our) &&
            <div Class="make-hut">
              <input
                placeholder="my-hut123"
                type="text"
                value={make}
                onChange={this.handleChange}
                onKeyUp={this.handleKey}
              />
            </div>
        }
        {
          theseHuts.map(hut =>
            <div key={hut} onClick={() => changeHut(hut)}>
              {(hut === currentHut) ? <strong>{hut.name}</strong> : hut.name}
            </div>
          )
        }
      </div>
    )
  }
};

export default Huts;
