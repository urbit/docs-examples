import React, { Component } from 'react';

class Allow extends Component {

  handleKey = (e) =>
  (e.key === "Enter") &&
    !e.shiftKey &&
    this.props.addShip();

  render() {
    const { host, add, our } = this.props;
    return (
      <p style={{display: host === our ? "block" : "none"}}>
        <label>allow:</label>
        <input
          placeholder="~sampel"
          type="text"
          value={add}
          onChange={e => this.props.setAdd(e.target.value)}
          onKeyUp={this.handleKey}
        />
      </p>
    )
  }
}

export default Allow;
