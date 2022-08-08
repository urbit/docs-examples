import React, { Component } from 'react';

class Messages extends Component {
  render() {
    const { msgJar, bottom, patpShorten, currentHut } = this.props;
    const msgs = msgJar.has(currentHut) ? msgJar.get(currentHut) : [];
    return (
      <div Class="msgs">
        <div Class="fix"/>
        {
          msgs.map((msg, ind) =>
            <p Class="msg" key={ind}>
              <span Class="who">
                {patpShorten(msg.who) + '>'}
              </span>
              <span Class="what" lang="en">{msg.what}</span>
            </p>
          )
        }
        <div ref={bottom} />
      </div>
    )
  }
};

export default Messages;
