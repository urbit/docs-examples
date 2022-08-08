import React, { Component } from 'react';

class People extends Component {
  render() {
    const { joined, currentHut} = this.props;
    const ppl = joined.has(currentHut.gid)
          ? [...joined.get(currentHut.gid)] : [];
    return (
      <div Class="ppl">
        <div>people</div>
        <div>--------------</div>
        {
          Array.from(ppl, ship =>
            <div key={ship}>
              {this.props.patpShorten(ship)}
            </div>
          )
        }
      </div>
    )
  }
};

export default People;
