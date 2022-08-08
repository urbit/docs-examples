import React, { Component } from 'react';

class SelectGid extends Component {

  handleClick = () => {
    if (this.props.currentGid.host === this.props.our) {
      (this.props.currentHut !== null) && this.props.deleteHut()
    } else this.props.leaveGid();
  }
  render() {
    const {
      our,
      titles,
      huts,
      currentGid,
      changeGid,
      patpShorten,
      viewSelect,
    } = this.props;
    return (
      <div Class="selectgid">
        <select
          onChange={e => changeGid(e.target.value)}
          value={viewSelect}>
          <option value="def">Select</option>
          {
            [...huts.keys()].map(gid =>
              <option value={gid.host + "/" + gid.name}>
                {
                  (titles.has(gid))
                    ? titles.get(gid)
                    : patpShorten(gid.host) + "/" + gid.name
                }
              </option>
            )
          }
        </select>
        <button
          Class="leave-button"
          onClick={() => (window.confirm('Are you sure?')) && this.handleClick()}
        >
          {(currentGid.host === our) ? "Delete Hut" : "Leave"}
        </button>
      </div>
    )
  }
}

export default SelectGid;
