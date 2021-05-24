#!/usr/bin/env node
// eslint-disable-next-line import/extensions
import mdLinks from "../index.js";

const [path, ...args] = process.argv.slice(2);
const validate = args.includes("--validate");
const stats = args.includes("--stats");

const printProcess = (arrLinks) => {
  const allStats = {
    total: arrLinks.length,
    unique: [...new Set(arrLinks.map(({ href }) => href))].length,
    broken: arrLinks.filter(({ ok }) => ok === "fail").length,
  };

  if (args.length > 0 && !validate && !stats) {
    process.stdout.write("No valid command.\n");
    return;
  }

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

mdLinks(path, { validate })
  .then((result) => printProcess(result))
  .catch((error) => process.stdout.write(error));
