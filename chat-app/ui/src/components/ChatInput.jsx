import React, { useState, useCallback } from "react";
import { appPoke, patpShorten } from "./../lib";
import { OUR } from "./../const";

export default function ChatInput({currentHut}) {
  const [content, setContent] = useState("");

  const handleKey = (e) => {
    const trimmed = content.trim();
    if ((e.key === "Enter") && !e.shiftKey
        && (trimmed !== "")
        && (currentHut !== null)) {
      const [host, gidName, hutName] = currentHut.split("/");
      appPoke({
        "post": {
          "hut": {"gid": {"host": host, "name": gidName}, "name": hutName},
          "msg": {"who": OUR, "what": trimmed}
        }
      });
      setContent("");
    }
  };

  return (currentHut !== null) && (
    <div className="input">
      <strong className="our">{patpShorten(OUR)}</strong>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyUp={handleKey}
      />
    </div>
  );
}
