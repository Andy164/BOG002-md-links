import { isAbsolute, resolve, extname } from "path";
import { existsSync } from 'fs';
import { stat, readFile } from "fs/promises";

export default class MDLinkSystem {
  absolutePath;
  isValidPath;
  isMdExt;

  constructor(path, validate) {
    this.path = path;
    this.validate = validate;
  }

  getInitialInfoPath() {
    this.isValidPath = typeof this.path === "string";
    this.absolutePath = isAbsolute(this.path) ? this.path : resolve(this.path);
    this.isMdExt = extname(this.path) === ".md";
  }

  getTypePath = () => stat(this.path)
      .then((resp) => resp.isDirectory())
      .catch((err) => err);

  existsPath = () => ({
      status: existsSync(this.absolutePath),
      type: this.getTypePath() ? "directorio" : "archivo",
    });

  readMdFile = () => {
    // eslint-disable-next-line no-useless-escape
    const regExp = /\[([^\s].*)\]\((https?.*)\)/gm;
    return readFile(this.path, "utf-8")
      .then((str) => {
        const arrItr = [...str.matchAll(regExp)];
        return arrItr.map((item) => ({
          href: item[2],
          text: item[1],
          file: this.path,
        }));
      })
      .catch((e) => e);
  }

  init = (cb) => {
    if (!this.isValidPath) return cb(new Error("Ruta no válida."));

    const { status, type } = this.existsPath();
    if (!status) return cb(new Error(`El ${type} especificado no existe.`));

    return this.getTypePath()
      .then((resp) => {
        if (!resp) {
          if (!this.isMdExt) return cb(new Error("Se esperaba un archivo de tipo Markdown (.md)"));
          return this.readMdFile()
            .then((arrLinksInfo) => cb(null, arrLinksInfo))
            .catch((e) => e);
        }
        return cb(null, "Es directorio");
      })
      .catch((err) => cb(err));
  }
}
