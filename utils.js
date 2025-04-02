import { createRequire } from "node:module";

// Como leer un JSON con ESModule
// import fs from 'node:fs/';
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

// Como leer un JSON con ESModule recomendado hasta que node.js soporte el import con assert o type
// este import tiene información, el meta.url es la url del archivo actual
const require = createRequire(import.meta.url);
export const readJson = (path) => require(path);
