import React, { useState, useEffect } from "react";
import Urbit from "@urbit/http-api";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-day-picker/lib/style.css";
import {
  Modal, Card, Stack, Tab, Tabs, Toast, ToastContainer,
  Button, Spinner, CloseButton,
} from "react-bootstrap";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { startOfDay, endOfDay } from "date-fns";
import { BottomScrollListener } from "react-bottom-scroll-listener";

////////////////////
// Main Component //
////////////////////

export default function App() {
  /////////////////////////
  /// Application State ///
  /////////////////////////

  // Control/Meta State //
  const [subEvent, setSubEvent] = useState({});
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [errors, setErrors] = useState(new Map());

  // Journal State //
  const [entries, setEntries] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [newDraft, setNewDraft] = useState({});
  const [entryToDelete, setEntryToDelete] = useState(null);

  // Search State //
  const [results, setResults] = useState([]);
  const [searchMeta, setSearchMeta] = useState({
    time: null,
    start: null,
    end: null,
  });

  ///////////////////////
  /// State Functions ///
  ///////////////////////

  const init = () => {
    getEntries().then(
      (result) => {
        setSubEvent(result);
        setLatestUpdate(result.time);
        subscribe();
      },
      (err) => {
        addError("Connection failed");
        setStatus("err");
      }
    );
  };

  const reconnect = () => {
    window.urbit.reset();
    if (latestUpdate === null) {
      init();
    } else {
      getUpdates().then(
        (result) => {
          result.logs.map(setSubEvent);
          subscribe();
        },
        (err) => {
          addError("Connection failed");
          setStatus("err");
        }
      );
    }
  };

  const subscribe = () => {
    try {
      window.urbit.subscribe({
        app: "journal",
        path: "/updates",
        event: setSubEvent,
        err: () => addError("Subscription rejected"),
        quit: () => addError("Kicked from subscription"),
      });
    } catch {
      addError("Subscription failed");
    }
  };

  const getUpdates = async () => {
    const since = latestUpdate === null ? Date.now() : latestUpdate;
    const path = `/updates/since/${since}`;
    return window.urbit.scry({
      app: "journal",
      path: path,
    });
  };

  const getEntries = async () => {
    const e = entries;
    const before = e.length === 0 ? Date.now() : e[e.length - 1].id;
    const max = 10;
    const path = `/entries/before/${before}/${max}`;
    return window.urbit.scry({
      app: "journal",
      path: path,
    });
  };

  const addError = (msg) => {
    const id = errorCount + 1;
    setErrors(new Map(errors.set(id, msg)));
    setErrorCount(id);
  };

  const rmError = (id) => {
    errors.delete(id);
    setErrors(new Map(errors));
  };

  ///////////////////
  // State Effects //
  ///////////////////

  useEffect(() => {
    window.urbit = new Urbit("");
    window.urbit.ship = window.ship;

    window.urbit.onOpen = () => setStatus("con");
    window.urbit.onRetry = () => setStatus("try");
    window.urbit.onError = () => setStatus("err");

    init();
  }, []);

  useEffect(() => {
    const getDataIndex = (id, data) => {
      let low = 0;
      let high = data.length;
      while (low < high) {
        let mid = (low + high) >>> 1;
        if (data[mid].id > id) low = mid + 1;
        else high = mid;
      }
      return low;
    };

    const isInSearch = (id, time) => (
      searchMeta.time !== null &&
      time >= searchMeta.time &&
      searchMeta.start.getTime() <= id &&
      searchMeta.end.getTime() >= id
    );

    if (subEvent.time !== latestUpdate) {
      if ("entries" in subEvent) {
        setEntries(entries.concat(subEvent.entries));
      } else if ("add" in subEvent) {
        const { time, add } = subEvent;
        const eInd = getDataIndex(add.id, entries);
        const rInd = getDataIndex(add.id, results);
        const toE = entries.length === 0 || add.id > entries[entries.length - 1].id;
        const toR = isInSearch(add.id, time);
        toE && entries.splice(eInd, 0, add);
        toR && results.splice(rInd, 0, add);
        toE && setEntries([...entries]);
        toR && setResults([...results]);
        setLatestUpdate(time);
      } else if ("edit" in subEvent) {
        const { time, edit } = subEvent;
        const eInd = entries.findIndex((e) => e.id === edit.id);
        const rInd = results.findIndex((e) => e.id === edit.id);
        const toE = eInd !== -1;
        const toR = rInd !== -1 && isInSearch(edit.id, time);
        if (toE) entries[eInd] = edit;
        if (toR) results[rInd] = edit;
        (toE || toR) && delete drafts[edit.id];
        toE && setEntries([...entries]);
        toR && setResults([...results]);
        (toE || toR) && setDrafts({...drafts});
        setLatestUpdate(time);
      } else if ("del" in subEvent) {
        const { time, del } = subEvent;
        const eInd = entries.findIndex((e) => e.id === del.id);
        const rInd = results.findIndex((e) => e.id === del.id);
        const toE = eInd !== -1;
        const toR = isInSearch(del.id, time) && rInd !== -1;
        toE && entries.splice(eInd, 1);
        toR && results.splice(rInd, 1);
        (toE || toR) && delete drafts[del.id];
        toE && setEntries([...entries]);
        toR && setResults([...results]);
        (toE || toR) && setDrafts({...drafts});
        setLatestUpdate(time);
      }
    }
  }, [subEvent]);

  /////////////////////
  // Rendering Logic //
  /////////////////////

  return (
    <React.Fragment>
      <RemoveModal
        deleteId={entryToDelete}
        setDeleteId={setEntryToDelete}
        setError={addError}
      />
      <div className="m-3 d-flex justify-content-center">
        <Card style={{ maxWidth: "50rem", width: "100%" }}>
          {/* Main Content */}
          <Tabs defaultActiveKey="journal" className="fs-2">
            <Tab eventKey="journal" title="Journal">
              {(entries.length > 0) &&
                <BottomScrollListener onBottom={() => getEntries().then(
                  (result) => setSubEvent(result),
                  (err) => addError("Fetching more entries failed")
                )}>
                  {(scrollRef) => (
                    <Stack gap={5} className="m-3 d-flex">
                      <InputEntry
                        draft={newDraft}
                        setDraft={setNewDraft}
                        setError={addError}
                      />
                      {entries.map((e) => (
                        <JournalEntry
                          key={e.id}
                          entry={e}
                          drafts={drafts}
                          setDrafts={setDrafts}
                          setDeleteId={setEntryToDelete}
                          setError={addError}
                        />
                      ))}
                    </Stack>
                  )}
                </BottomScrollListener>
              }
            </Tab>
            <Tab eventKey="search" title="Search">
              <Stack gap={5} className="m-3 d-flex">
                <SearchInput
                  searchMeta={searchMeta}
                  setSearchMeta={setSearchMeta}
                  setResults={setResults}
                  setError={addError}
                />
                {results.map((e) => (
                  <JournalEntry
                    key={e.id}
                    entry={e}
                    drafts={drafts}
                    setDrafts={setDrafts}
                    setDeleteId={setEntryToDelete}
                    setError={addError}
                  />
                ))}
              </Stack>
            </Tab>
          </Tabs>
          {/* Error Bar */}
          <ToastContainer
            style={{ position: "sticky", bottom: 0, width: "100%", zIndex: 50 }}
          >
            {[...errors].map(([id, txt]) => (
              <Toast
                key={id}
                className="ms-auto"
                onClose={() => rmError(id)}
                show={true}
                delay={3000}
                autohide
                style={{ width: "fit-content" }}
              >
                <Toast.Header className="d-flex justify-content-between">
                  {txt}
                </Toast.Header>
              </Toast>
            ))}
            <Toast
              bg={status === "try" ? "warning" : "danger"}
              className="w-100"
              show={status === "try" || status === "err"}
            >
              <Toast.Body
                className="d-flex justify-content-center align-items-center"
                onClick={status === "err" ? () => reconnect() : null}
                role={status === "err" ? "button" : undefined}
              >
                <strong style={{ color: "white" }}>
                  {status === "try" && (
                    <Spinner animation="border" size="sm" className="me-1" />
                  )}
                  {status === "try" && "Reconnecting"}
                  {status === "err" && "Reconnect"}
                </strong>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Card>
      </div>
    </React.Fragment>
  );
}

///////////////////////
// Helper Components //
///////////////////////

const InputEntry = ({ draft, setDraft, setError }) => {
  const isNew = Object.keys(draft).length === 0;

  const createEntry = (id, txt) => {
    window.urbit.poke({
      app: "journal",
      mark: "journal-action",
      json: { add: { id: id, txt: txt } },
      onSuccess: () => setDraft({}),
      onError: () => setError("New entry rejected"),
    });
  };

  return (
    <div className="d-flex flex-column">
      <AutoResizeTextArea
        placeholder="New journal entry"
        value={isNew ? "" : draft.txt}
        onChange={(e) => {
          setDraft({
            id: isNew ? Date.now() : draft.id,
            txt: e.target.value,
          });
        }}
      />
      {!isNew && (
        <Button
          className="w-100 mt-3"
          variant="outline-primary"
          onClick={() => createEntry(draft.id, draft.txt)}
        >
          Submit
        </Button>
      )}
    </div>
  );
};

const JournalEntry = ({ entry, drafts, setDrafts, setDeleteId, setError }) => {
  const { id, txt } = entry;
  const isEdit = id in drafts;
  const draft = id in drafts ? drafts[id] : null;

  const editEntry = (id, txt) => {
    if (txt === null) {
      delete drafts[id];
      setDrafts({...drafts});
    } else {
      window.urbit.poke({
        app: "journal",
        mark: "journal-action",
        json: { edit: { id: id, txt: txt } },
        onError: () => setError("Edit rejected"),
      });
    }
  };

  return (
    <Card key={id}>
      <Card.Header className="fs-4 d-flex align-items-center justify-content-between">
        {new Date(id).toLocaleString()}
        <CloseButton
          className="fs-6"
          onClick={() => {
            if (isEdit) {
              delete drafts[id];
              setDrafts({...drafts});
            } else {
              setDeleteId(id);
            }
          }}
        />
      </Card.Header>
      <Card.Body onClick={() => setDrafts({ [id]: null, ...drafts })}>
        {isEdit
          ? <AutoResizeTextArea
              value={draft === null ? txt : draft}
              onChange={(e) => setDrafts({ ...drafts, [id]: e.target.value })}
            />
          : txt.split(/(?:\r?\n[ \t]*){2,}(?!\s*$)/).map(
              (e, i) => (<p key={i}>{e}</p>)
            )
        }
      </Card.Body>
      {isEdit && (
        <Button
          variant="outline-primary"
          className="mx-3 mb-3"
          onClick={() => editEntry(id, draft)}
        >
          Submit
        </Button>
      )}
    </Card>
  );
};

const SearchInput = ({
  searchMeta: { start: searchStart, end: searchEnd },
  setSearchMeta,
  setResults,
  setError,
}) => {
  const [inputStart, setInputStart] = useState(null);
  const [inputEnd, setInputEnd] = useState(null);

  const searchEntries = async () => {
    const start = Math.max(inputStart.getTime(), 0);
    const end = Math.max(inputEnd.getTime(), 0);
    window.urbit.scry({
      app: "journal",
      path: `/entries/between/${start}/${end}`,
    }).then(
      (result) => {
        setInputStart(null);
        setInputEnd(null);
        setResults(result.entries);
        setSearchMeta({
          time: result.time,
          start: inputStart,
          end: inputEnd
        });
      },
      (err) => {
        setError("Search failed");
      }
    );
  };

  return (
    <Stack gap={5}>
      <div className="d-flex justify-content-between">
        <div className="me-2 d-flex justify-content-start align-items-center flex-wrap">
          <DayPickerInput
            value={inputStart}
            placeholder="FROM  YYYY-M-D"
            onDayChange={(day) => setInputStart(
              day instanceof Date && !isNaN(day)
                ? startOfDay(day)
                : null
            )}
            style={{ margin: "5px 5px 5px 0" }}
          />
          <DayPickerInput
            value={inputEnd}
            placeholder="TO  YYYY-M-D"
            onDayChange={(day) => setInputEnd(
              day instanceof Date && !isNaN(day)
                ? endOfDay(day)
                : null
            )}
            style={{ margin: "5px 5px 5px 0" }}
          />
        </div>
        <Button
          className="w-20"
          variant={
            inputStart === null || inputEnd === null
              ? "outline-secondary"
              : "outline-primary"
          }
          disabled={inputStart === null || inputEnd === null}
          onClick={() => searchEntries()}
        >
          Search
        </Button>
      </div>
      {searchStart !== null && searchEnd !== null && (
        <div className="fs-4">
          Results for {searchStart.toLocaleDateString()} to {searchEnd.toLocaleDateString()}
        </div>
      )}
    </Stack>
  );
};

const RemoveModal = ({ deleteId, setDeleteId, setError }) => {
  const deleteEntry = (id) => {
    window.urbit.poke({
      app: "journal",
      mark: "journal-action",
      json: { del: { id: id } },
      onError: () => setError("Deletion rejected"),
    });
    setDeleteId(null);
  };

  return (deleteId !== null) && (
    <Modal
      size="lg"
      centered
      show={deleteId !== null}
      onHide={() => setDeleteId(null)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this journal entry?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={() => deleteEntry(deleteId)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const AutoResizeTextArea = ({ onChange, ...props }) => (
  <div className="grow-wrap">
    <textarea
      className="w-100 form-control"
      onChange={(e) => {
        const { target: { value, parentNode } } = e;
        parentNode.dataset.replicatedValue = value;
        onChange(e);
      }}
      {...props}
    />
  </div>
);
