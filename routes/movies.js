import { Router } from "express";
import { readJson } from '../utils.js';
import { randomUUID } from "node:crypto";


export const moviesRouter = Router();

const movies = readJson('./movies.json');

moviesRouter.get("/", (req, res) => {
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

moviesRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  const movie = movies.find((mov) => mov.id == id);
  if (!movie) {
    return res.status(404).send("Movie not found");
  }
  res.json(movie);
});

moviesRouter.post("/", (req, res) => {
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

moviesRouter.patch("/:id", (req, res) => {
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
