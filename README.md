# Markdown Links

Markdown Links extracts and validates markdown file links (.md). You will also be able to obtain the statistics of the total of links, and the number of unique and broken links.

## Installation

In the same directory as your `package.json` file, create or edit an `.npmrc` file to include this line:

```
@andy164:registry=https://npm.pkg.github.com
```

### As a dependency in your project

```
npm install @andy164/md-links@0.1.0
```

## Usage

### 1. API

The mdLinks function is also usable through an API:

#### `mdLinks(path[,options])`

##### Arguments

- `path`: `<string>` | Absolute or relative path to the file or directory.
- `options`: `<string>` | An object with only the following property:
  - `validate`: Boolean that determines if you want to validate the links found.

##### Return value

`<Promise>` Fulfills with an array of objects, where each object represents a link and contains the following properties:

With `{ validate: false }`:

- `href`: URL found.
- `text`: Text before the link.
- `file`: Path of the file where the link was found.

Con `{ validate: true }` :

- `href`: URL found.
- `text`: Text before the link.
- `file`: Path of the file where the link was found.
- `status`: HTTP response code.
- `ok`: Message `fail` in case of failure or` ok` in case of success.

#### Example (results as comments)

```js
const mdLinks = require("md-links");

mdLinks("./some/example.md")
  .then((links) => {
    // => [{ href, text, file }, ...]
  })
  .catch(console.error);

mdLinks("./some/example.md", { validate: true })
  .then((links) => {
    // => [{ href, text, file, status, ok }, ...]
  })
  .catch(console.error);

mdLinks("./some/dir")
  .then((links) => {
    // => [{ href, text, file }, ...]
  })
  .catch(console.error);
```

### 2. CLI

Markdown Links can be run as follows via terminal:

`md-links <path-to-file> [options]`

Por ejemplo:

#### Options

##### `--validate`

The module makes an HTTP request to find out if the link works or not.

Por ejemplo:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

##### `--stats`

With which you can obtain basic statistics about the links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

You can also combine `--stats` and` --validate` to get needed statistics from the validation results.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## Objetivos de aprendizaje

### JavaScript

- [ X ] Uso de condicionales [(if-else | switch | operador ternario)](https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/conditionals)
- [ X ] Uso de funciones [(parámetros | argumentos | valor de retorno)](https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions)
- [ X ] Manipular arrays[(filter | map | sort | reduce)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/)
- [ X ] Manipular objects (key | value)
- [ X ] Uso ES modules ([`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
  | [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export))
- [ X ] Diferenciar entre expression y statements.
- [ X ] Diferenciar entre tipos de datos atómicos y estructurados.
- [ X ] [Uso de callbacks.](https://developer.mozilla.org/es/docs/Glossary/Callback_function)
- [ X ] [Consumo de Promesas.](https://scotch.io/tutorials/javascript-promises-for-dummies#toc-consuming-promises)
- [ X ] [Creación de Promesas.](https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8/)

### Node

- [ X ] Uso de sistema de archivos. ([fs](https://nodejs.org/api/fs.html), [path](https://nodejs.org/api/path.html))
- [ X ] Instalar y usar módulos. ([npm](https://www.npmjs.com/))
- [ X ] Creación de modules. [(CommonJS)](https://nodejs.org/docs/latest-v0.10.x/api/modules.html)
- [ X ] [Configuración de package.json.](https://docs.npmjs.com/files/package.json)
- [ X ] [Configuración de npm-scripts](https://docs.npmjs.com/misc/scripts)
- [ X ] Uso de CLI (Command Line Interface - Interfaz de Línea de Comando)

### Testing

- [ X ] [Testeo unitario.](https://jestjs.io/docs/es-ES/getting-started)
- [ X ] [Testeo asíncrono.](https://jestjs.io/docs/es-ES/asynchronous)
- [ X ] [Uso de librerias de Mock.](https://jestjs.io/docs/es-ES/manual-mocks)
- [ ] Uso de Mocks manuales.
- [ ] Testeo para múltiples Sistemas Operativos.

### Estructura del código y guía de estilo

- [ X ] Organizar y dividir el código en módulos (Modularización)
- [ X ] Uso de identificadores descriptivos (Nomenclatura | Semántica)
- [ X ] Uso de linter (ESLINT)

### Git y GitHub

- [ X ] Uso de comandos de git (add | commit | pull | status | push)
- [ X ] Manejo de repositorios de GitHub (clone | fork | gh-pages)
- [ X ] Colaboración en Github (branches | pull requests | |tags)
- [ X ] Organización en Github (projects | issues | labels | milestones)

### HTTP

- [ X ] [Códigos de status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

### Fundamentos de programación

- [ X ] [Recursión.](https://www.youtube.com/watch?v=lPPgY3HLlhQ)

---
