import React from 'react';
import { appPoke, patpShorten, isLocalGroup, isRemoteGroup } from "~/lib";
import { OUR } from "~/const";

export default function People({
  ships,
  currGid,
  currHut,
}) {
  const deleteHut = () => {
    if (currHut !== null) {
      const [host, gidName, hutName] = currHut.split("/")
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
    if (currGid !== null) {
      const [host, name] = currGid.split("/");
      appPoke({
        "quit": {
          "gid": {"host": host, "name": name},
          "who": OUR
        }
      });
    }
  };

  const handleClick = () => (
    isLocalGroup(currGid)
      ? (currHut !== null) && deleteHut()
      : leaveGid()
  );

  return (currGid !== null) && (
    <div className="right-menu">
      {(isLocalGroup(currGid) && (currHut !== null)) &&
        <button
            className="leave-button"
            onClick={() =>
              (window.confirm('Are you sure?')) && handleClick()
            }
            >
          Delete
        </button>
      }
      {isRemoteGroup(currGid) &&
        <button
            className="leave-button"
            onClick={() =>
              (window.confirm('Are you sure?')) && handleClick()
            }
            >
          Leave
        </button>
      }
      {(currGid !== null) &&
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
