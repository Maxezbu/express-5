import { object, array, string, number, enum as _enum } from "zod";

export const movieSchema = object({
  title: string({
    invalid_type_error: "Title must be a string",
    required_error: "Title is required",
  }).min(1),
  year: number().int().min(1900).max(2026),
  genre: array(
    _enum([
      "Action",
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Sci-Fi",
      "Adventure",
      "Fantasy",
    ]),
    {
      invalid_type_error: "Genre must be an array of strings",
      required_error: "Genre is required",
    }
  ),
  director: string({
    invalid_type_error: "Director must be a string",
    required_error: "Director is required",
  }).min(1),
  duration: number().int().positive().optional(),
  rate: number().min(0).max(10).default(5),
  poster: string().url({
    message: "Poster must be a valid URL",
  }),
});

export const validateMovie = (object) => {
  return movieSchema.safeParse(object);
};


export const validatePatchMovie = (object) => {
    return movieSchema.partial().safeParse(object);
}
