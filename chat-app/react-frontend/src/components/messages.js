import React, { Component } from 'react';

class Messages extends Component {
  render() {
    return (
      <div Class="msgs">
        <div Class="fix"/>
        {
          this.props.msgs.map((msg, ind) =>
            <p Class="msg" key={ind}>
              <span Class="who">
                {this.props.patpShorten(msg.who) + '>'}
              </span>
              <span Class="what" lang="en">{msg.what}</span>
            </p>
          )
        }
        <div ref={this.props.bottom} />
      </div>
    )
  }
};

export default Messages;
