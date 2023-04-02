import React, {useRef, useEffect} from 'react';
import { patpShorten } from "~/lib";

export default function Messages({content}) {
  const bottom = useRef();

  useEffect(() => {
    bottom.current.scrollIntoView()
  }, [content]);

  return (
    <div className="msgs">
      <div className="fix"/>
        {content.map((msg, ind) =>
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
