// eslint-disable-next-line import/extensions
import MDLink from "./lib/LinkSystem.js";

const mdLinks = (path, options) => {
  const arg2 = typeof options === "undefined" ? { validate: false } : options;
  const linkSystem = new MDLink(path, arg2);
  return new Promise((resolve, reject) => {
    linkSystem.init((err, info) => (err ? reject(err) : resolve(info)));
  });
};

mdLinks("..\\README.md")
  .then((r) => console.log(r)).catch((e) => console.log(e));
