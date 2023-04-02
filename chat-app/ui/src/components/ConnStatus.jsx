import React from 'react';

export default function ConnStatus({conn}) {
  return (
    <div
      className={`conn
          ${(conn !== null) ? "block" : "none"}
          ${(conn === "ok") ? "text-green-400" : ""}
          ${(conn === "try") ? "text-yellow-400" : ""}
          ${(conn === "err") ? "text-red" : ""}
      `}
    >
      {(conn === "ok")
        ? "connected"
        : (conn === "try")
          ? "reconnecting"
          : (conn === "err")
            ? "disconnected"
            : null
      }
    </div>
  );
};
