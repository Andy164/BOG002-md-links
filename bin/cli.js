#!/usr/bin/env node
import yargs from "yargs";
// eslint-disable-next-line import/extensions
import { hideBin } from "yargs/helpers";
import mdLinks from "../index.js";

const version = "2.0.1";
const [path] = process.argv.slice(2);
const yargsFn = yargs(hideBin(process.argv));

const { argv } = yargsFn
  .scriptName("md-links")
  .usage("Usage: $0 <path-to-file> [options]")
  .option("validate", {
    alias: "vd",
    describe: "Makes an HTTP request to find out if the link works or not",
    type: "boolean",
  })
  .option("stats", {
    alias: "st",
    describe: "Obtain basic statistics about the links",
    type: "boolean",
  })
  .help("help", "Show this help and exit")
  .version(version);

if (!path || typeof path !== "string") {
  yargsFn.showHelp();
  console.error("\nInvalid argument: 'path-to-file' must be a string");
  process.exit(1);
}

const stdoutResult = (arrLinks) => {
  const allStats = {
    total: arrLinks.length,
    unique: [...new Set(arrLinks.map(({ href }) => href))].length,
    broken: arrLinks.filter(({ ok }) => ok === "fail").length,
  };
  const { validate, stats } = argv;

  if (validate && stats) {
    process.stdout.write(
      `Total: ${allStats.total}\nUnique: ${allStats.unique}\nBroken: ${allStats.broken}\n`
    );
    return;
  }
  if (!validate && !stats)
    arrLinks.forEach(({ href, text, file }) => {
      const textTrunc = text.length > 50 ? `${text.slice(0, 50)}...` : text;
      process.stdout.write(`${file} ${href} ${textTrunc}\n`);
    });

  if (validate)
    arrLinks.forEach(({ href, text, file, ok, status }) => {
      const textTrunc = text.length > 50 ? `${text.slice(0, 50)}...` : text;
      process.stdout.write(`${file} ${href} ${ok} ${status} ${textTrunc}\n`);
    });

  if (stats)
    process.stdout.write(
      `Total: ${allStats.total}\nUnique: ${allStats.unique}\n`
    );
};

const validate = argv.validate || false;

mdLinks(path, { validate })
  .then((result) => stdoutResult(result))
  .catch((error) => console.error(error));
