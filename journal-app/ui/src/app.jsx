// import React, { Component } from "react";
import React, {useState, useEffect} from "react";
import Urbit from "@urbit/http-api";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-day-picker/lib/style.css";
import TextareaAutosize from "react-textarea-autosize";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import DayPickerInput from "react-day-picker/DayPickerInput";
import endOfDay from "date-fns/endOfDay";
import startOfDay from "date-fns/startOfDay";
import { BottomScrollListener } from "react-bottom-scroll-listener";

export default function App() {
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
  const [searchTime, setSearchTime] = useState(null);
  const [searchStart, setSearchStart] = useState(null);
  const [searchEnd, setSearchEnd] = useState(null);
  const [resultStart, setResultStart] = useState(null);
  const [resultEnd, setResultEnd] = useState(null);

  const getUpdates = async () => {
    const latest = latestUpdate;
    const since = latest === null ? Date.now() : latest;
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

  const init = () => {
    getEntries().then(
      (result) => {
        setSubEvent(result);
        setLatestUpdate(result.time);
        subscribe();
      },
      (err) => {
        setErrorMsg("Connection failed");
        setStatus("err");
      }
    );
  };

  const reconnect = () => {
    window.urbit.reset();
    const latest = latestUpdate;
    if (latest === null) {
      init();
    } else {
      getUpdates().then(
        (result) => {
          result.logs.map(setSubEvent); // FIXME?
          subscribe();
        },
        (err) => {
          setErrorMsg("Connection failed");
          setStatus("err");
        }
      );
    }
  };

  const moreEntries = () => {
    getEntries().then(
      (result) => {
        setSubEvent(result);
      },
      (err) => {
        setErrorMsg("Fetching more entries failed");
      }
    );
  };

  const subscribe = () => {
    try {
      window.urbit.subscribe({
        app: "journal",
        path: "/updates",
        event: setSubEvent,
        err: () => setErrorMsg("Subscription rejected"),
        quit: () => setErrorMsg("Kicked from subscription"),
      });
    } catch {
      setErrorMsg("Subscription failed");
    }
  };

  const submitDelete = (id) => {
    window.urbit.poke({
      app: "journal",
      mark: "journal-action",
      json: { del: { id: id } },
      onError: () => setErrorMsg("Deletion rejected"),
    });
    setEntryToDelete(null);
  };

  const submitEdit = (id, txt) => {
    if (txt !== null) {
      window.urbit.poke({
        app: "journal",
        mark: "journal-action",
        json: { edit: { id: id, txt: txt } },
        onError: () => setErrorMsg("Edit rejected"),
      });
    } else cancelEdit(id);
  };

  const submitNew = (id, txt) => {
    window.urbit.poke({
      app: "journal",
      mark: "journal-action",
      json: { add: { id: id, txt: txt } },
      onSuccess: () => setNewDraft({}),
      onError: () => setErrorMsg("New entry rejected"),
    });
  };

  const getSearch = async () => {
    const ss = searchStart;
    const se = searchEnd;
    const lu = latestUpdate;
    if (lu !== null && ss !== null && se !== null) {
      let start = ss.getTime();
      let end = se.getTime();
      if (start < 0) start = 0;
      if (end < 0) end = 0;
      const path = `/entries/between/${start}/${end}`;
      window.urbit
        .scry({
          app: "journal",
          path: path,
        })
        .then(
          (result) => {
            setSearchTime(result.time);
            setSearchStart(null);
            setSearchEnd(null);
            setResultStart(ss);
            setResultEnd(se);
            setResults(result.entries);
          },
          (err) => {
            setErrorMsg("Search failed");
          }
        );
    } else {
      lu !== null && setErrorMsg("Searh failed");
    }
  };

  const spot = (id, data) => {
    let low = 0;
    let high = data.length;
    while (low < high) {
      let mid = (low + high) >>> 1;
      if (data[mid].id > id) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  const inSearch = (id, time) => {
    return (
      searchTime !== null &&
      time >= searchTime &&
      resultStart.getTime() <= id &&
      resultEnd.getTime() >= id
    );
  };

  const cancelEdit = (id) => {
    delete drafts[id];
    setDrafts({...drafts});
  };

  const saveDraft = (id, text) => {
    drafts[id] = text;
    setDrafts({...drafts});
  };

  const setEdit = (id) => {
    if (!(id in drafts)) {
      drafts[id] = null;
      setDrafts({...drafts});
    }
  };

  const saveNew = (id, txt) => {
    txt !== ""
      ? setNewDraft({ id: id, txt: txt })
      : setNewDraft({})
  };

  const newEntry = () => {
    const n = newDraft;
    const isNew = Object.keys(n).length === 0;
    const now = Date.now();
    return (
      <div className="d-flex flex-column">
        <TextareaAutosize
          className="w-100 form-control"
          placeholder="New journal entry"
          value={isNew ? "" : n.txt}
          onChange={(e) => saveNew(isNew ? now : n.id, e.target.value)}
        />
        {!isNew && (
          <Button
            className="w-100 mt-3"
            variant="outline-primary"
            onClick={() => submitNew(n.id, n.txt)}
          >
            Submit
          </Button>
        )}
      </div>
    );
  };

  const rmModal = () => {
    const id = entryToDelete;
    if (id !== null) {
      return (
        <Modal
          size="lg"
          centered
          show={id !== null}
          onHide={() => setEntryToDelete(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this journal entry?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={() => submitDelete(id)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  };

  const editBox = (id, txt, draft) => {
    return (
      <TextareaAutosize
        className="w-100 form-control"
        value={draft === null ? txt : draft}
        onChange={(e) => saveDraft(id, e.target.value)}
      />
    );
  };

  const printEntry = ({ id, txt }) => {
    const edit = id in drafts;
    const draft = id in drafts ? drafts[id] : null;
    const reg = /(?:\r?\n[ \t]*){2,}(?!\s*$)/;
    let d = new Date(id);
    return (
      <Card key={id}>
        <Card.Header className="fs-4 d-flex align-items-center justify-content-between">
          {d.toLocaleString()}
          <CloseButton
            className="fs-6"
            onClick={() => (edit ? cancelEdit(id) : setEntryToDelete(id))}
          />
        </Card.Header>
        <Card.Body onClick={() => setEdit(id)}>
          {edit
            ? editBox(id, txt, draft)
            : txt.split(reg).map((e, ind) => <p key={ind}>{e}</p>)}
        </Card.Body>
        {edit && (
          <Button
            variant="outline-primary"
            className="mx-3 mb-3"
            onClick={() => submitEdit(id, draft)}
          >
            Submit
          </Button>
        )}
      </Card>
    );
  };

  const doSetSearchStart = (when) => {
    if (when instanceof Date && !isNaN(when)) {
      const date = startOfDay(when);
      setSearchStart(date);
    } else setSearchStart(null);
  };

  const doSetSearchEnd = (when) => {
    if (when instanceof Date && !isNaN(when)) {
      const date = endOfDay(when);
      setSearchEnd(date);
    } else setSearchEnd(null);
  };

  const searcher = () => {
    const ss = searchStart;
    const se = searchEnd;
    const rs = resultStart;
    const re = resultEnd;
    return (
      <Stack gap={5}>
        <div className="d-flex justify-content-between">
          <div className="me-2 d-flex justify-content-start align-items-center flex-wrap">
            <DayPickerInput
              value={ss}
              placeholder="FROM  YYYY-M-D"
              onDayChange={(day) => doSetSearchStart(day)}
              style={{ margin: "5px 5px 5px 0" }}
            />
            <DayPickerInput
              value={se}
              placeholder="TO  YYYY-M-D"
              onDayChange={(day) => doSetSearchEnd(day)}
              style={{ margin: "5px 5px 5px 0" }}
            />
          </div>
          <Button
            className="w-20"
            variant={
              ss === null || se === null
                ? "outline-secondary"
                : "outline-primary"
            }
            disabled={ss === null || se === null}
            onClick={() => getSearch()}
          >
            Search
          </Button>
        </div>
        {rs !== null && re !== null && (
          <div className="fs-4">
            Results for {rs.toLocaleDateString()} to {re.toLocaleDateString()}
          </div>
        )}
      </Stack>
    );
  };

  const setErrorMsg = (msg) => {
    const id = errorCount + 1;
    setErrors(new Map(errors.set(id, msg)));
    setErrorCount(id);
  };

  const rmErrorMsg = (id) => {
    errors.delete(id);
    setErrors(new Map(errors));
  };

  const errorMsg = (id, msg) => {
    return (
      <Toast
        key={id}
        className="ms-auto"
        onClose={() => rmErrorMsg(id)}
        show={true}
        delay={3000}
        autohide
        style={{ width: "fit-content" }}
      >
        <Toast.Header className="d-flex justify-content-between">
          {msg}
        </Toast.Header>
      </Toast>
    );
  };

  const getStatus = () => {
    return (
      <ToastContainer
        style={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          zIndex: 50,
        }}
      >
        {[...errors].map((e) => errorMsg(e[0], e[1]))}
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
    );
  };

  useEffect(() => {
    window.urbit = new Urbit("");
    window.urbit.ship = window.ship;

    window.urbit.onOpen = () => setStatus("con");
    window.urbit.onRetry = () => setStatus("try");
    window.urbit.onError = () => setStatus("err");

    init();
  }, []);

  useEffect(() => {
    const upd = subEvent;
    if (upd.time !== latestUpdate) {
      if ("entries" in upd) {
        setEntries(entries.concat(upd.entries));
      } else if ("add" in upd) {
        const { time, add } = upd;
        const eInd = spot(add.id, entries);
        const rInd = spot(add.id, results);
        const toE =
          entries.length === 0 || add.id > entries[entries.length - 1].id;
        const toR = inSearch(add.id, time);
        toE && entries.splice(eInd, 0, add);
        toR && results.splice(rInd, 0, add);
        toE && setEntries([...entries]);
        toR && setResults([...results]);
        setLatestUpdate(time);
      } else if ("edit" in upd) {
        const { time, edit } = upd;
        const eInd = entries.findIndex((e) => e.id === edit.id);
        const rInd = results.findIndex((e) => e.id === edit.id);
        const toE = eInd !== -1;
        const toR = rInd !== -1 && inSearch(edit.id, time);
        if (toE) entries[eInd] = edit;
        if (toR) results[rInd] = edit;
        (toE || toR) && delete drafts[edit.id];
        toE && setEntries([...entries]);
        toR && setResults([...results]);
        (toE || toR) && setDrafts({...drafts});
        setLatestUpdate(time);
      } else if ("del" in upd) {
        const { time, del } = upd;
        const eInd = entries.findIndex((e) => e.id === del.id);
        const rInd = results.findIndex((e) => e.id === del.id);
        const toE = eInd !== -1;
        const toR = inSearch(del.id, time) && rInd !== -1;
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

  return (
    <React.Fragment>
      {rmModal()}
      <div className="m-3 d-flex justify-content-center">
        <Card style={{ maxWidth: "50rem", width: "100%" }}>
          <Tabs defaultActiveKey="journal" className="fs-2">
            <Tab eventKey="journal" title="Journal">
              <BottomScrollListener onBottom={() => moreEntries()}>
                {(scrollRef) => (
                  <Stack gap={5} className="m-3 d-flex">
                    {newEntry()}
                    {entries.map((e) => printEntry(e))}
                  </Stack>
                )}
              </BottomScrollListener>
            </Tab>
            <Tab eventKey="search" title="Search">
              <Stack gap={5} className="m-3 d-flex">
                {searcher()}
                {results.map((e) => printEntry(e))}
              </Stack>
            </Tab>
          </Tabs>
          {getStatus()}
        </Card>
      </div>
    </React.Fragment>
  );
}
