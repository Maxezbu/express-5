import express, { json } from "express";
import { randomUUID } from "node:crypto";
import cors from 'cors'


// Como leer un JSON con ESModule
// import fs from 'node:fs/';
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

// Como leer un JSON con ESModule recomendado hasta que node.js soporte el import con assert o type
import { createRequire } from "node:module";
// este import tiene información, el meta.url es la url del archivo actual
const require = createRequire(import.meta.url);
const movies = require("./movies.json");

import { validateMovie, validatePatchMovie } from "./zod-schema.js";

const app = express();

const PORT = process.env.PORT ?? 1234;

app.disable("x-powered-by");

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

app.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  const movie = movies.find((mov) => mov.id == id);
  if (!movie) {
    return res.status(404).send("Movie not found");
  }
  res.json(movie);
});

app.get("/movies", (req, res) => {
  // esto con app.use(cors()) no es necesario pero es como se hace sin cors
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  const { genre } = req.query;
  console.log(genre);

  if (!genre) {
    return res.json(movies);
  }

  const _movies = movies.filter((movie) => {
    return movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase());
  });

  if (!_movies.length) {
    return res.status(404).send("Movie not found");
  }
  res.json(_movies);
});

app.post("/movies", (req, res) => {
  const _movies = movies;

  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(422).json({
      error: true,
      message: JSON.parse(result.error.message),
    });
  }

  const movie = {
    id: randomUUID(),
    ...result.data,
  };
  _movies.push(movie);

  res.status(201).json(movie);
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.findIndex((mov) => mov.id == id);

  if (movie === -1) {
    return res.status(404).send("Movie not found");
  }

  const result = validatePatchMovie(req.body);

  if (result.error) {
    return res.status(404).json({
      error: true,
      message: JSON.parse(result.error.message),
    });
  }

  movies[movie] = {
    ...movies[movie],
    ...result.data,
  };
  res.json(movies[movie]);
});

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
