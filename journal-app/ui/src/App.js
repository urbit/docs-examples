import React, {Component} from 'react';
import Urbit from '@urbit/http-api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import TextareaAutosize from 'react-textarea-autosize';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import CloseButton from 'react-bootstrap/CloseButton';
import Modal from 'react-bootstrap/Modal';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import {BottomScrollListener} from 'react-bottom-scroll-listener';


class App extends Component {
  state = {
    entries: [],
    drafts: {},
    newDraft: {},
    results: [],
    searchTime: null,
    searchStart: null,
    searchEnd: null,
    resultStart: null,
    resultEnd: null,
    latestUpdate: null,
    entryToDelete: null,
    status: null,
    errorCount: 0,
    errors: new Map(),
  };

  componentDidMount() {
    window.urbit = new Urbit("");
    window.urbit.ship = window.ship;
    window.urbit.onOpen = () => this.setState({status: "con"});
    window.urbit.onRetry = () => this.setState({status: "try"});
    window.urbit.onError = (err) => this.setState({status: "err"});
    this.init();
  };

  init = () => {
    this.getEntries()
    .then(
      (result) => {
        this.handleUpdate(result);
        this.setState({latestUpdate: result.time});
        this.subscribe()
      },
      (err) => {
        this.setErrorMsg("Connection failed");
        this.setState({status: "err"})
      }
    )
  };

  reconnect = () => {
    window.urbit.reset();
    const latest = this.state.latestUpdate;
    if (latest === null) {
      this.init();
    } else {
      this.getUpdates()
      .then(
        (result) => {
          result.logs.map(e => this.handleUpdate(e));
          this.subscribe()
        },
        (err) => {
          this.setErrorMsg("Connection failed");
          this.setState({status: "err"})
        }
      )
    }
  };

  getUpdates = async () => {
    const {latestUpdate: latest} = this.state;
    const since = (latest === null) ? Date.now() : latest;
    const path = `/updates/since/${since}`;
    return window.urbit.scry({
      app: "journal",
      path: path
    })
  };

  getEntries = async () => {
    const {entries: e} = this.state;
    const before = (e.length === 0) ? Date.now() : e[e.length - 1].id;
    const max = 10;
    const path = `/entries/before/${before}/${max}`;
    return window.urbit.scry({
      app: "journal",
      path: path
    })
  };

  moreEntries = () => {
    this.getEntries()
    .then(
      (result) => {this.handleUpdate(result)},
      (err) => {this.setErrorMsg("Fetching more entries failed")}
    )
  };

  subscribe = () => {
    try {
      window.urbit.subscribe({
        app: "journal",
        path: "/updates",
        event: this.handleUpdate,
        err: ()=>this.setErrorMsg("Subscription rejected"),
        quit: ()=>this.setErrorMsg("Kicked from subscription")
      })
    } catch {
      this.setErrorMsg("Subscription failed")
    }
  };

  delete = (id) => {
    window.urbit.poke({
      app: "journal",
      mark: "journal-action",
      json: {"del": {"id": id}},
      onError: ()=>this.setErrorMsg("Deletion rejected")
    })
    this.setState({rmModalShow: false, entryToDelete: null})
  };

  submitEdit = (id, txt) => {
    if (txt !== null) {
      window.urbit.poke({
        app: "journal",
        mark: "journal-action",
        json: {"edit": {"id": id, "txt": txt}},
        onError: ()=>this.setErrorMsg("Edit rejected")
      })
    } else this.cancelEdit(id)
  };

  submitNew = (id, txt) => {
    window.urbit.poke({
      app: "journal",
      mark: "journal-action",
      json: {"add": {"id": id, "txt": txt}},
      onSuccess: ()=>this.setState({newDraft: {}}),
      onError: ()=>this.setErrorMsg("New entry rejected")
    })
  };

  getSearch = async () => {
    const {
      searchStart: ss,
      searchEnd: se,
      latestUpdate: lu
    } = this.state;
    if (lu !== null && ss !== null && se !== null) {
      let start = ss.getTime();
      let end = se.getTime();
      if (start < 0) start = 0;
      if (end < 0) end = 0;
      const path = `/entries/between/${start}/${end}`;
      window.urbit.scry({
        app: "journal",
        path: path
      })
      .then(
        (result) => {
          this.setState({
            searchTime: result.time,
            searchStart: null,
            searchEnd: null,
            resultStart: ss,
            resultEnd: se,
            results: result.entries
          })
        },
        (err) => {
          this.setErrorMsg("Search failed")
        }
      )
    } else {
      (lu !== null) && this.setErrorMsg("Searh failed")
    }
  };

  spot = (id, data) => {
    let low = 0
    let high = data.length;
    while (low < high) {
      let mid = (low + high) >>> 1;
      if (data[mid].id > id) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  inSearch = (id, time) => {
    const {
      searchTime,
      resultStart,
      resultEnd
    } = this.state;
    return (
      searchTime !== null &&
        time >= searchTime &&
        resultStart.getTime() <= id &&
        resultEnd.getTime() >= id
    )
  };

  handleUpdate = (upd) => {
    const {entries, drafts, results, latestUpdate} = this.state;
    if (upd.time !== latestUpdate) {
      if ("entries" in upd) {
        this.setState({entries: entries.concat(upd.entries)})
      } else if ("add" in upd) {
        const {time, add} = upd;
        const eInd = this.spot(add.id, entries);
        const rInd = this.spot(add.id, results);
        const toE = (entries.length === 0) ||
              (add.id > entries[entries.length - 1].id);
        const toR = (this.inSearch(add.id, time));
        toE && entries.splice(eInd, 0, add);
        toR && results.splice(rInd, 0, add);
        this.setState({
          ...(toE && {entries: entries}),
          ...(toR && {results: results}),
          latestUpdate: time
        })
      } else if ("edit" in upd) {
        const {time, edit} = upd;
        const eInd = entries.findIndex(e => e.id === edit.id);
        const rInd = results.findIndex(e => e.id === edit.id);
        const toE = eInd !== -1;
        const toR = rInd !== -1 && this.inSearch(edit.id, time);
        if (toE) entries[eInd] = edit;
        if (toR) results[rInd] = edit;
        (toE || toR) && delete drafts[edit.id];
        this.setState({
          ...(toE && {entries: entries}),
          ...(toR && {results: results}),
          ...((toE || toR) && {drafts: drafts}),
          latestUpdate: time
        })
      } else if ("del" in upd) {
        const {time, del} = upd;
        const eInd = entries.findIndex(e => e.id === del.id);
        const rInd = results.findIndex(e => e.id === del.id);
        const toE = eInd !== -1;
        const toR = (this.inSearch(del.id, time)) && rInd !== -1;
        (toE) && entries.splice(eInd, 1);
        (toR) && results.splice(rInd, 1);
        (toE || toR) && delete drafts[del.id];
        this.setState({
          ...(toE && {entries: entries}),
          ...(toR && {results: results}),
          ...((toE || toR) && {drafts: drafts}),
          latestUpdate: time
        })
      }
    }
  };

  cancelEdit = (id) => {
    const {drafts} = this.state;
    delete drafts[id];
    this.setState({drafts: drafts})
  };

  saveDraft = (id, text) => {
    const {drafts} = this.state;
    drafts[id] = text;
    this.setState({drafts: drafts})
  };

  setEdit = (id) => {
    const {drafts} = this.state;
    if (!(id in drafts)) {
      drafts[id] = null;
      this.setState({drafts: drafts})
    }
  };

  saveNew = (id, txt) => {
    (txt !== "")
      ? this.setState({newDraft: {id: id, txt: txt}})
      : this.setState({newDraft: {}})
  };

  newEntry = () => {
    const {newDraft: n} = this.state;
    const isNew = (Object.keys(n).length === 0);
    const now = Date.now();
    return (
      <div className="d-flex flex-column">
        <TextareaAutosize
          className="w-100 form-control"
          placeholder="New journal entry"
          value={(isNew) ? "" : n.txt}
          onChange={e => this.saveNew((isNew) ? now : n.id, e.target.value)}
        />
        {(!isNew) &&
          <Button
            className="w-100 mt-3"
            variant="outline-primary"
            onClick={()=>this.submitNew(n.id, n.txt)}
          >
            Submit
          </Button>
        }
      </div>
    )
  };

  closeRmModal = () => {
    this.setState({entryToDelete: null})
  };

  openRmModal = (id) => {
    this.setState({entryToDelete: id})
  };

  rmModal = () => {
    const id = this.state.entryToDelete;
    if (id !== null) {
      return (
        <Modal
          size="lg"
          centered
          show={(id !== null)}
          onHide={()=>this.closeRmModal()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this journal entry?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-danger"
              onClick={()=>this.delete(id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )
    }
  };

  editBox = (id, txt, draft) => {
    return (
      <TextareaAutosize
        className="w-100 form-control"
        value={(draft === null) ? txt : draft}
        onChange={(e) => this.saveDraft(id, e.target.value)}
      />
    );
  };

  printEntry = ({id, txt}) => {
    const {drafts} = this.state;
    const edit = (id in drafts);
    const draft = (id in drafts) ? drafts[id] : null;
    const reg = /(?:\r?\n[ \t]*){2,}(?!\s*$)/;
    let d = new Date(id);
    return (
      <Card key={id}>
        <Card.Header
          className="fs-4 d-flex align-items-center justify-content-between"
        >
          {d.toLocaleString()}
          <CloseButton
            className="fs-6"
            onClick={() => (edit) ? this.cancelEdit(id) : this.openRmModal(id)}
          />
        </Card.Header>
        <Card.Body onClick={()=>this.setEdit(id)}>
          {(edit)
           ? this.editBox(id, txt, draft)
           : txt.split(reg).map((e, ind) => <p key={ind}>{e}</p>)
          }
        </Card.Body>
        {(edit) &&
          <Button
            variant="outline-primary"
            className="mx-3 mb-3"
            onClick={()=>this.submitEdit(id, draft)}
          >
            Submit
          </Button>
        }
      </Card>
    )
  };

  setSearchStart = (when) => {
    if (when instanceof Date && !isNaN(when)) {
      const date = startOfDay(when);
      this.setState({searchStart: date})
    } else this.setState({searchStart: null})
  };

  setSearchEnd = (when) => {
    if (when instanceof Date && !isNaN(when)) {
      const date = endOfDay(when);
      this.setState({searchEnd: date})
    } else this.setState({searchEnd: null})
  };

  searcher = () => {
    const {
      searchStart: ss,
      searchEnd: se,
      resultStart: rs,
      resultEnd: re
    } = this.state;
    return (
      <Stack gap={5}>
        <div className="d-flex justify-content-between">
          <div
            className="me-2 d-flex justify-content-start align-items-center flex-wrap"
          >
            <DayPickerInput
              value={ss}
              placeholder="FROM  YYYY-M-D"
              onDayChange={day => this.setSearchStart(day)}
              style={{margin: "5px 5px 5px 0"}}
            />
            <DayPickerInput
              value={se}
              placeholder="TO  YYYY-M-D"
              onDayChange={day => this.setSearchEnd(day)}
              style={{margin: "5px 5px 5px 0"}}
            />
          </div>
          <Button
            className="w-20"
            variant={
              (ss === null || se === null)
                ? "outline-secondary" : "outline-primary"
            }
            disabled={ss === null || se === null}
            onClick={()=>this.getSearch()}
          >
            Search
          </Button>
        </div>
        { (rs !== null && re !== null) &&
            <div className="fs-4">
              Results for {rs.toLocaleDateString()} to {re.toLocaleDateString()}
            </div>
        }
      </Stack>
    )
  };

  setErrorMsg = (msg) => {
    const {errors, errorCount} = this.state;
    const id = errorCount + 1;
    this.setState({
      errors: errors.set(id, msg),
      errorCount: id
    })
  };

  rmErrorMsg = (id) => {
    const {errors} = this.state;
    errors.delete(id);
    this.setState({
      errors: errors,
    })
  };

  errorMsg = (id, msg) => {
    return (
      <Toast
        key={id}
        className="ms-auto"
        onClose={() => this.rmErrorMsg(id)}
        show={true}
        delay={3000}
        autohide
        style={{width: "fit-content"}}
      >
        <Toast.Header className="d-flex justify-content-between">
          {msg}
        </Toast.Header>
      </Toast>
    )
  };

  status = () => {
    const {status, errors} = this.state;
    return (
      <ToastContainer
        style={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          zIndex: 50
        }}
      >
        {[...errors].map((e) => this.errorMsg(e[0],e[1]))}
        <Toast
          bg={(status === "try") ? "warning" : "danger"}
          className="w-100"
          show={(status === "try" || status === "err")}
        >
          <Toast.Body
            className="d-flex justify-content-center align-items-center"
            onClick={(status === "err") ? () => this.reconnect() : null}
            role={(status === "err") ? "button" : undefined}

          >
            <strong style={{color: "white"}}>
              {
                (status === "try")
                  && <Spinner animation="border" size="sm" className="me-1"/>
              }
              {(status === "try") && "Reconnecting"}
              {(status === "err") && "Reconnect"}
            </strong>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    )
  };

  render() {
    return (
      <React.Fragment>
        {this.rmModal()}
        <div className="m-3 d-flex justify-content-center">
          <Card style={{maxWidth: "50rem", width: "100%"}}>
            <Tabs defaultActiveKey="journal" className="fs-2">
              <Tab eventKey="journal" title="Journal">
                <BottomScrollListener onBottom={()=>this.moreEntries()}>
                  {(scrollRef) =>
                    <Stack gap={5} className="m-3 d-flex">
                      {this.newEntry()}
                      {this.state.entries.map(e => this.printEntry(e))}
                    </Stack>
                  }
                </BottomScrollListener>
              </Tab>
              <Tab eventKey="search" title="Search">
                <Stack gap={5} className="m-3 d-flex">
                  {this.searcher()}
                  {this.state.results.map(e => this.printEntry(e))}
                </Stack>
              </Tab>
            </Tabs>
            {this.status()}
          </Card>
        </div>
      </React.Fragment>
    )
  }
}

export default App;
