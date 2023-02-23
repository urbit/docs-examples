import React from 'react';

export default function People({
  our,
  joined,
  currentGid,
  patpShorten,
  currentHut,
  deleteHut,
  leaveGid,
}) {
  const isOurGroup = () => (
    (currentGid !== null) && (currentGid.split("/")[0] === our)
  );
  const isntOurGroup = () => (
    (currentGid !== null) && (currentGid.split("/")[0] !== our)
  );

  const handleClick = () => (
    isOurGroup()
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
      {(isOurGroup() && (currentHut !== null)) &&
        <button
            className="leave-button"
            onClick={() =>
              (window.confirm('Are you sure?')) && handleClick()
            }
            >
          Delete
        </button>
      }
      {(isntOurGroup()) &&
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
