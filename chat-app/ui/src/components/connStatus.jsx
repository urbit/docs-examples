import React, { Component } from 'react';

class ConnStatus extends Component {
  render() {
    const conn = this.props.conn;
    return (
      <div
        className={`conn
            ${(conn !== null) ? "block" : "none"}
            ${(conn === "ok") ? "text-green-400" : ""}
            ${(conn === "err") ? "text-red" : ""}
            ${(conn === "err") ? "text-yellow-400" : ""}
        `}
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
