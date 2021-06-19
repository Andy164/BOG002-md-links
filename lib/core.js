import {
  getAbsolutePath,
  isDirectory,
  readMdFile,
  getAllMdFiles,
  getStatusCode,
} from "./utils.js";

export const getMdLinks = (path) => {
  const absolutePath = getAbsolutePath(path);
  const isDir = isDirectory(absolutePath);

  if (!isDir) return readMdFile(absolutePath);

  return getAllMdFiles(absolutePath).then((files) =>
    Promise.all(files.map((file) => readMdFile(file))).then((result) =>
      result.flat()
    )
  );
};

export const validateLinks = (infoLinks) =>
  Promise.all(
    infoLinks.map(
      (link) =>
        new Promise((res) => {
          getStatusCode(link.href, ({ statusCode }) => {
            const ok = statusCode >= 400 ? "fail" : "ok";
            res({ ...link, status: statusCode, ok });
          });
        })
    )
  );
