import React, { Component } from 'react';

class SelectHut extends Component {

  handleSelect = e => {
    this.props.setSelect(e.target.value);
    const [host, name] = e.target.value.split("/");
    (e.target.value !== "def") &&
      this.props.openHut({host: host, name: name})
  };

  render() {
    const { huts, select } = this.props;
    return (
      <p>
        <label>open:</label>
        <select
          onChange={this.handleSelect}
          value={select}>
          <option value="def">Select</option>
          {
            huts.map(({host, name}) =>
              <option value={host + "/" + name}>
                {this.props.patpShorten(host) + "/" + name}
              </option>
            )
          }
        </select>
      </p>
    )
  }
};

export default SelectHut;
