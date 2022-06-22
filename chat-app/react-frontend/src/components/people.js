import React, { Component } from 'react';

class People extends Component {
  render() {
    const { ppl, hover, host, our } = this.props;
    return (
      <div Class="ppl">
        <div>people</div>
        <div>--------------</div>
        {
          Array.from(ppl, ([ship, join]) =>
            <div
              key={ship}
              onMouseOver={(e) => this.props.setHover(ship)}
              onMouseOut={(e) => this.props.setHover(null)}
            >
              {
                (host === our && hover === ship) ?
                  <button
                    Class="kick"
                    onClick={() => this.props.kickShip(ship)}
                  >
                    {"[    kick    ]"}
                  </button>
                : <strong Class={join ? "in" : "out"}>
                    {this.props.patpShorten(ship)}
                  </strong>
              }
            </div>
          )
        }
      </div>
    )
  }
};

export default People;
