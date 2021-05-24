import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import mdLinks from "../index";

const mock = new MockAdapter(axios);
mock.onGet("https://es.wikipedia.org/wiki/Markdown").reply(200, {});
mock.onGet("https://nodejs.org/").reply(200, {});
mock
  .onGet(
    "https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg"
  )
  .reply(200, {});
mock.onGet("https://es.wikipedia.org/wiki/Xy1zz").reply(404, {});
mock.onGet("https://es.wikdia.org/wiki/Xy1zz").reply(500, {});

global.axios = mock;

describe("mdLinks", () => {
  it("should return a promise", () => {
    expect(typeof mdLinks("test\\prueba.md")).toBe("object");
  });

  it("should return an error when the type of the path argument is other than string", () => {
    expect.assertions(1);
    return mdLinks(123).catch((r) => {
      expect(r.message).toBe(
        'The "path" argument must be of type string. Received type number (123).'
      );
    });
  });

  it("should return error when the type of the options argument is other than object", () => {
    expect.assertions(1);
    return mdLinks("test\\prueba.md", "string").catch((r) => {
      expect(r.message).toBe(
        'The "options" argument must be of type object. Received type string (string).'
      );
    });
  });

  it("should return error when the options argument does not have the 'validate' property", () => {
    expect.assertions(1);
    return mdLinks("test\\prueba.md", { option: "string" }).catch((r) => {
      expect(r.message).toBe(
        'The "options" argument must be an object with a "validate" property.'
      );
    });
  });

  it("should return error when the the path does not exist", () => {
    expect.assertions(1);
    return mdLinks("test\\prueba2", { validate: false }).catch((r) => {
      expect(r.message).toBe("The received file or directory does not exist.");
    });
  });

  it("should return error when the file path has no .md extension", () => {
    expect.assertions(1);
    return mdLinks("test\\prueba.js", { validate: false }).catch((r) => {
      expect(r.message).toBe(
        "The file extension must be of .md. Received extension .js."
      );
    });
  });

  it("should return an array of objects", () => {
    expect.assertions(5);
    return mdLinks(
      "G:\\Laboratoria\\Projects\\BOG002-md-links\\test\\prueba.md",
      { validate: true }
    ).then((r) => {
      expect(Array.isArray(r)).toBeTruthy();
      expect(r[0].text).toBe("Markdown");
      expect(r[0]).toHaveProperty(
        "href",
        "https://es.wikipedia.org/wiki/Markdown"
      );
      expect(r[0].status).toBe(200);
      expect(r).toHaveLength(5);
    });
  });

  it("should return an array of objects with .................", () => {
    expect.assertions(1);
    return mdLinks(".\\test", { validate: false }).then((r) => {
      expect(Array.isArray(r)).toBeTruthy();
      expect(r).toHaveLength(15);
    });
  });
});
