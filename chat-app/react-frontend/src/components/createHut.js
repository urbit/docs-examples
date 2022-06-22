import React, { Component } from 'react';

class CreateHut extends Component {

  handleKey = (e) =>
  (e.key === "Enter") &&
    !e.shiftKey &&
    this.handleMake();

  handleMake = () =>
  /^[a-z][-a-z0-9]*$/.test(this.props.make)
    && this.props.makeHut();

  handleChange = (e) =>
  /(^$|^[a-z][-a-z0-9]*$)/.test(e.target.value) &&
    this.props.setMake(e.target.value);

  render() {
    return (
      <p>
        <label>new:</label>
        <input
          placeholder="my-hut123"
          type="text"
          value={this.props.make}
          onChange={this.handleChange}
          onKeyUp={this.handleKey}
        />
      </p>
    )
  }
}

export default CreateHut;
