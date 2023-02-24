import React from 'react';
import { appPoke, patpShorten, isLocalGroup, isRemoteGroup } from "./../lib";
import { OUR } from "./../const";

export default function People({
  ships,
  currentGid,
  currentHut,
}) {
  const deleteHut = () => {
    if (currentHut !== null) {
      const [host, gidName, hutName] = currentHut.split("/")
      if (host === OUR) {
        appPoke({
          "del": {
            "hut": {"gid": {"host": host, "name": gidName}, "name": hutName}
          }
        });
      }
    }
  };

  const leaveGid = () => {
    if (currentGid !== null) {
      const [host, name] = currentGid.split("/");
      appPoke({
        "quit": {
          "gid": {"host": host, "name": name},
          "who": OUR
        }
      });
    }
  };

  const handleClick = () => (
    isLocalGroup(currentGid)
      ? (currentHut !== null) && deleteHut()
      : leaveGid()
  );

  return (currentGid !== null) && (
    <div className="right-menu">
      {(isLocalGroup(currentGid) && (currentHut !== null)) &&
        <button
            className="leave-button"
            onClick={() =>
              (window.confirm('Are you sure?')) && handleClick()
            }
            >
          Delete
        </button>
      }
      {isRemoteGroup(currentGid) &&
        <button
            className="leave-button"
            onClick={() =>
              (window.confirm('Are you sure?')) && handleClick()
            }
            >
          Leave
        </button>
      }
      {(currentGid !== null) &&
        <div className="ppl">
          <div className="font-semibold text-wall-400">People</div>
          {Array.from(ships, (ship) =>
            <div key={ship}>
              {patpShorten(ship)}
            </div>
          )}
        </div>
      }
    </div>
  );
}
