import React, { Component } from 'react';
import cn from 'classnames';

class ConnStatus extends Component {
  render() {
    const conn = this.props.conn;
    return (
      <div
        className={cn("conn", {
          "block": (conn !== null),
          "none": (conn === null),
          "text-green-400": (conn === "ok"),
          "text-red": (conn === "err"),
          "text-yellow-400": (conn === "try")
        })}
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
