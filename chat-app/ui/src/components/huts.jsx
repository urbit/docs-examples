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
    if (currentGid === null) return null;
    const theseHuts = (huts.has(currentGid))
          ? [...huts.get(currentGid)].map(name => currentGid + "/" + name)
          : []
    return (
      <div className="left-menu">
        <p className="font-semibold text-wall-400 mb-2">Chats</p>
        {
          (currentGid !== null) &&
            (currentGid.split("/")[0] === our) &&
            <input
              className="make-hut"
              placeholder="new-hut123"
              type="text"
              value={make}
              onChange={this.handleChange}
              onKeyUp={this.handleKey}
            />
        }
        <div>
          {
            theseHuts.map(hut =>
              <div
                className={(hut === currentHut) ? "current-hut" : "other-hut"}
                key={hut}
                onClick={() => changeHut(hut)}
              >
                {
                  (hut === currentHut)
                    ? <strong>{hut.split("/")[2]}</strong>
                  : hut.split("/")[2]
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
};

export default Huts;
