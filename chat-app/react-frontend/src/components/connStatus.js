import React, { Component } from 'react';

class ConnStatus extends Component {
  render() {
    const conn = this.props.conn;
    return (
      <div
        Class="conn"
        style={{
          display: (conn === null) ? "none" : "block",
          color: (conn === "ok") ? "#a1b56c"
            : (conn === "try") ? "#dc9656"
            : (conn === "err") ? "#ab4642"
            : null
        }}
      >
        {
          (conn === "ok") ? "connected"
            : (conn === "try") ? "reconnecting"
            : (conn === "err") ? "disconnected"
            : null
        }
      </div>
    )
  }
}

export default ConnStatus;
