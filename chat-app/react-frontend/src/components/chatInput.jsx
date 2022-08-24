import React, { Component } from 'react';

class ChatInput extends Component {

  handleKey = (e) =>
  (e.key === "Enter") &&
    !e.shiftKey &&
    this.props.postMsg();

  render() {
    const {our, msg, currentHut} = this.props;
    return (
      (currentHut !== null) &&
        <div Class="input">
          <strong Class="our">{this.props.patpShorten(our)}</strong>
          <textarea
            value={msg}
            onChange={e => this.props.setMsg(e.target.value)}
            onKeyUp={this.handleKey}
          >
          </textarea>
        </div>
    )
  }
}

export default ChatInput;
