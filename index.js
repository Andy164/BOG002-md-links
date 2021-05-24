// eslint-disable-next-line import/extensions
import MDLink from "./lib/LinkSystem.js";

const mdLinks = (path, options = { validate: false }) => {
  const arg2 =
    typeof options !== "object"
      ? `The "options" argument must be of type object. Received type ${typeof options} (${options}).`
      : false;
  const propArg2 = Object.keys(options).includes("validate")
    ? false
    : `The "options" argument must be an object with a "validate" property.`;
  const linkSystem =
    typeof path === "string" ? new MDLink(path, options) : false;
  const error = arg2 || propArg2;
  return new Promise((resolve, reject) => {
    if (!linkSystem)
      reject(
        new Error(
          `The "path" argument must be of type string. Received type ${typeof path} (${path}).`
        )
      );
    else if (error) {
      reject(new Error(error));
    } else linkSystem.init((err, info) => (err ? reject(err) : resolve(info)));
  });
};

export default mdLinks;
