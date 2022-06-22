import React, { Component } from 'react';

class JoinNew extends Component {

  handleKey = (e) =>
  (e.key === "Enter") &&
    !e.shiftKey &&
    this.handleJoin(e.target.value);

  handleJoin = join => {
    const [host, name] = join.split('/');
    this.props.patpValidate(host) &&
      (/^[a-z][-a-z0-9]*$/.test(name)) &&
      this.props.joinHut({host: host, name: name})
  };

  render() {
    return (
      <p>
        <label>join:</label>
        <input
          type="text"
          placeholder="~sampel/name"
          value={this.props.join}
          onChange={e => this.props.setJoin(e.target.value)}
          onKeyUp={this.handleKey}
        />
      </p>
    )
  }
}

export default JoinNew;
