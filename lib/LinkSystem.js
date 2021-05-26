/* eslint-disable lines-between-class-members */
import { isAbsolute, resolve, extname, relative } from "path";
import { existsSync, statSync } from "fs";
import { readFile, readdir } from "fs/promises";
import axios from "axios";

export default class MDLinkSystem {
  #arrLinksInfo = [];
  #arrMdFiles = [];
  #path;
  #validate;
  #absolutePath;
  #existsPath;
  #isMdExt;
  #typePath;

  constructor(path, validate) {
    this.#path = path;
    this.#validate = validate;
    this.getInitialInfoPath();
  }

  getInitialInfoPath() {
    this.#absolutePath = isAbsolute(this.#path)
      ? this.#path
      : resolve(this.#path);
    this.#existsPath = existsSync(this.#absolutePath);
    this.#isMdExt = {
      ext: extname(this.#path),
      isMd: extname(this.#path) === ".md",
    };
    this.#typePath = this.#existsPath
      ? statSync(this.#path).isDirectory()
      : null;
  }

  getRelativePath = (path) =>
    isAbsolute(this.#path) ? path : relative(process.cwd(), path);

  readMdFile = (path = this.#path) => {
    // eslint-disable-next-line no-useless-escape
    const regExp = /\[([^\]]*)\]\(([^)]*)\)/g;
    return readFile(path, "utf-8")
      .then((str) => {
        const arrItr = [...str.matchAll(regExp)];
        return arrItr.map((item) => ({
          href: item[2],
          text: item[1],
          file: this.getRelativePath(path),
        }));
      })
      .catch((e) => e);
  };

  getAllMdFiles = (dir) =>
    readdir(dir, { withFileTypes: true }).then((files) =>
      Promise.all(
        files.map((file) => {
          const joinPath = resolve(dir, file.name);
          if (extname(joinPath) === ".md") this.#arrMdFiles.push(joinPath);
          return file.isDirectory() ? this.getAllMdFiles(joinPath) : null;
        })
      )
    );

  fetchLinks = (obj) =>
    axios
      .get(obj.href)
      .then((result) => {
        const { ...objURL } = { ...obj, status: result.status, ok: "ok" };
        return objURL;
      })
      .catch((error) => {
        const status = error.response ? error.response.status : error.code;
        const { ...objURL } = {
          ...obj,
          status,
          ok: "fail",
        };
        return objURL;
      });

  getLinksInfo = (pathFile) =>
    this.readMdFile(pathFile)
      .then((allLinks) => {
        this.#arrLinksInfo = allLinks.filter((obj) =>
          obj.href.startsWith("http")
        );
        if (!this.#validate.validate) return this.#arrLinksInfo;

        const allPromises = this.#arrLinksInfo.map((obj) =>
          this.fetchLinks(obj)
        );
        return Promise.all(allPromises)
          .then((results) => results)
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));

  init = (cb) => {
    if (this.#existsPath) {
      if (!this.#typePath) {
        if (!this.#isMdExt.isMd)
          cb(
            new Error(
              `The file extension must be of .md. Received extension ${
                this.#isMdExt.ext
              }.`
            )
          );
        else this.getLinksInfo(this.#path).then((result) => cb(null, result));
      } else {
        this.getAllMdFiles(this.#path).then((arrPromises) => {
          Promise.all(arrPromises).then(() => {
            const arrPromisesMdFiles = this.#arrMdFiles.map((file) =>
              this.getLinksInfo(file).then((result) => result)
            );
            Promise.all(arrPromisesMdFiles).then((result) => {
              this.#arrLinksInfo = result.flat();
              cb(null, this.#arrLinksInfo);
            });
          });
        });
      }
    } else cb(new Error(`The received file or directory does not exist.`));
  };
}
