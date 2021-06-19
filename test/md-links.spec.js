import mdLinks from "../index.js";

describe("mdLinks", () => {
  it("should return a promise", () => {
    expect(typeof mdLinks("test\\prueba.md")).toBe("object");
  });

  it("should return an error when the path does not exist", (done) => {
    mdLinks(123).catch((e) => {
      expect(e.message).toBe("Invalid path");
      done();
    });
  });

  it("should return error when the file path has no has no markdown extension", (done) => {
    mdLinks("test\\prueba.js", { validate: false }).catch((e) => {
      expect(e.message).toBe(
        "Please enter an absolute or relative path to a markdown file"
      );
      done();
    });
  });

  it("should return an array of objects", (done) => {
    mdLinks("G:\\Laboratoria\\Projects\\BOG002-md-links\\test\\prueba.md", {
      validate: true,
    }).then((r) => {
      expect(Array.isArray(r)).toBeTruthy();
      expect(r[0].text).toBe("Markdown");
      expect(r[0]).toHaveProperty(
        "href",
        "https://es.wikipedia.org/wiki/Markdown"
      );
      expect(r[0].status).toBe(200);
      expect(r).toHaveLength(4);
      done();
    });
  });

  it("should return an empty array", (done) => {
    mdLinks("test\\dir2\\rrr.md", {
      validate: true,
    }).then((r) => {
      expect(Array.isArray(r)).toBeTruthy();
      expect(r).toHaveLength(0);
      done();
    });
  });

  it("should return an array of objects with validate false", (done) => {
    mdLinks(".\\test", { validate: false }).then((r) => {
      expect(Array.isArray(r)).toBeTruthy();
      expect(r).toHaveLength(16);
      done();
    });
  });
});
