import { validatePath, getMdLinks, validateLinks } from "./lib/index.js";

const mdLinks = (path, options = { validate: false }) =>
  new Promise((res, rej) => {
    const isValidPath = validatePath(path, (err) => (err ? rej(err) : null));
    if (!isValidPath) return;
    getMdLinks(path).then((result) => {
      if (!options.validate) res(result);
      else validateLinks(result).then((newInfo) => res(newInfo));
    });
  });

export default mdLinks;
