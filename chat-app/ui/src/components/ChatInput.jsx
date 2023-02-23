import React from 'react';

export default function ChatInput({
  our,
  msg,
  setMsg,
  postMsg,
  patpShorten,
  currentHut,
}) {
  const handleKey = (e) => (
    (e.key === "Enter") && !e.shiftKey && postMsg()
  );

  return (currentHut !== null) && (
    <div className="input">
      <strong className="our">{patpShorten(our)}</strong>
      <textarea
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyUp={handleKey}
      />
    </div>
  );
}
