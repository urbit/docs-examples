import React, { Component } from 'react';

class LeaveHut extends Component {

  handleClick = () =>
  this.props.areYouSure ? this.props.leaveHut()
    : this.props.setAreYouSure();

  render() {
    const {host, our, areYouSure} = this.props;
    return (
      <p style={{display: host !== null ? "block" : "none"}}>
        <label>{(host === our) ? "delete:" : "leave:"}</label>
        <button onClick={this.handleClick}>
          {
            (areYouSure) ? "r u sure?"
            : (host === our) ? "delete"
            : "leave"
          }
        </button>
      </p>
    )
  }
}

export default LeaveHut;
