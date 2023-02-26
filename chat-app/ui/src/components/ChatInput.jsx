import React, { useState } from "react";
import { appPoke, patpShorten } from "~/lib";
import { OUR } from "~/const";

export default function ChatInput({
  input,
  setInput,
  currHut,
}) {
  const handleKey = (e) => {
    const trimmed = input.trim();
    if ((e.key === "Enter") && !e.shiftKey
        && (trimmed !== "")
        && (currHut !== null)) {
      const [host, gidName, hutName] = currHut.split("/");
      appPoke({
        "post": {
          "hut": {"gid": {"host": host, "name": gidName}, "name": hutName},
          "msg": {"who": OUR, "what": trimmed}
        }
      });
      setInput("");
    }
  };

  return (currHut !== null) && (
    <div className="input">
      <strong className="our">{patpShorten(OUR)}</strong>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyUp={handleKey}
      />
    </div>
  );
}
