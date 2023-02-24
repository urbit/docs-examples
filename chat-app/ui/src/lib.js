import { OUR } from "./const";
import api from "./api";

export function appPoke(jon) {
  return api.poke({
    app: "hut",
    mark: "hut-do",
    json: jon,
  });
}

export function isLocalGroup(gid) {
  return (gid !== null) && (gid.split("/")[0] === OUR);
}

export function isRemoteGroup(gid) {
  return (gid !== null) && (gid.split("/")[0] !== OUR);
}

export function patpShorten(patp) {
  let short = "";

  if (patp.length <= 14) {
    short = patp;
  } else if (patp.length <= 28) {
    const [a, b] = patp.split("-").slice(-2);
    short = `~${a}^${b}`;
  } else {
    const parts = patp.split("-");
    short = `${parts[0]}_${parts[parts.length - 1]}`;
  }

  return short;
}
