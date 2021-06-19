import { existsSync, statSync } from "fs";
import { isAbsolute, resolve, extname, relative } from "path";
import { readFile, readdir } from "fs/promises";
import http from "http";
import https from "https";

export const getAbsolutePath = (path) =>
  isAbsolute(path) ? path : resolve(path);

const isMdFile = (path) => {
  const extensions = [".md", ".markdown", ".markdn", ".mdown"];
  const ext = extname(path);
  return extensions.includes(ext);
};

const existSource = (path) => existsSync(path);

export const isDirectory = (path) => statSync(path).isDirectory();

export const validatePath = (path, cb) => {
  const exist = existSource(path);
  if (!exist) {
    cb(new Error("Por favor, ingrese una ruta válida"));
    return false;
  }
  const fileExtValid = isMdFile(path);
  const isDir = isDirectory(path);
  if (!isDir && !fileExtValid) {
    cb(new Error("Por favor, ingrese una ruta a un archivo md"));
    return false;
  }
  return true;
};

// Obtener ruta relativa
const getRelativePath = (path) =>
  isAbsolute(path) ? path : relative(process.cwd(), path);

export const readMdFile = (path) => {
  const regExp = /\[([^\]]*)\]\(([^)]*)\)/g;
  return readFile(path, "utf-8")
    .then((str) => {
      const arrItr = [...str.matchAll(regExp)];
      const arrLinks = [];
      arrItr.forEach((item) => {
        if (item[2].startsWith("http"))
          arrLinks.push({
            href: item[2],
            text: item[1],
            file: getRelativePath(path),
          });
      });
      return arrLinks;
    })
    .catch((e) => e);
};

export const getAllMdFiles = (dir, arrMdFiles = []) => {
  const arrPath = arrMdFiles;
  return readdir(dir, { withFileTypes: true }).then((files) =>
    Promise.all(
      files.map((file) => {
        const fullPath = resolve(dir, file.name);
        if (extname(file.name) === ".md") arrPath.push(fullPath);
        return file.isDirectory() ? getAllMdFiles(fullPath, arrPath) : fullPath;
      })
    ).then(() => arrPath)
  );
};

const isProtocolHTTP = (value) => {
  const url = new URL(value);
  const { protocol } = url;
  return protocol === "http";
};

export const getStatusCode = (link, cb) => {
  const protocol = isProtocolHTTP(link) ? http : https;
  protocol.get(link, cb);
};
