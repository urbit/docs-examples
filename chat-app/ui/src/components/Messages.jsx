import React from 'react';
import { patpShorten } from "./../lib";

export default function Messages({
  currentHut,
  msgJar,
  bottom,
}) {
  const msgs = (!msgJar.has(currentHut)) ? [] : msgJar.get(currentHut);
  return (
    <div className="msgs">
      <div className="fix"/>
        {msgs.map((msg, ind) =>
          <p className="msg" key={ind}>
            <span className="who">
              {patpShorten(msg.who) + '>'}
            </span>
            <span className="what" lang="en">{msg.what}</span>
          </p>
        )}
      <div ref={bottom} />
    </div>
  );
}
