import express, { json } from "express";
import cors from "cors";

import { validateMovie, validatePatchMovie } from "./zod-schema.js";
// import { readJson } from "./utils.js";

import { moviesRouter } from './routes/movies.js';

const app = express();

const PORT = process.env.PORT ?? 1234;

//const movies = readJson("./movies.json");

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World");
});

// esto es lo mismo que todo lo de abajo comentado
app.use(json());

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:1234",
        "http://localhost:4200",
      ];
      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
  })
);

/* app.use((req, res, next) => {
  if (req.method !== "POST") return next();
  if (req.headers["content-type"] !== "application/json") return next();

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    data.timpestamp = Date.now();
    JSON.parse(body);
    req.body = data;
    next();
  });
}); */

app.use('/movies', moviesRouter)


app.options("/movies", (req, res) => {
  // esto con app.use(cors()) no es necesario pero es como se hace sin cors
  // para metodos como put, delete, patch, los navegadores hacen una peticion OPTIONS (preflight)
  // y se debe agregar Access-Control-Allow-Origin
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  //res.send();
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
