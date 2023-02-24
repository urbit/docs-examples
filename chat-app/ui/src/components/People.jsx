import React from 'react';
import { patpShorten, isLocalGroup, isRemoteGroup } from "./../lib";

export default function People({
  joined,
  currentGid,
  currentHut,
  deleteHut,
  leaveGid,
}) {
  const handleClick = () => (
    isLocalGroup(currentGid)
      ? (currentHut !== null) && deleteHut()
      : leaveGid()
  );

  const ppl = (currentGid === null)
    ? []
    : (joined.has(currentGid))
      ? [...joined.get(currentGid)]
      : [];

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
          {Array.from(ppl, (ship) =>
            <div key={ship}>
              {patpShorten(ship)}
            </div>
          )}
        </div>
      }
    </div>
  );
}
