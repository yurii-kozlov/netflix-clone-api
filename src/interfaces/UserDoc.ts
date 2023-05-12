import { Document } from "mongoose";
import { Plan } from "./Plan";
import { Movie } from "./Movie";

export interface UserDoc extends Document {
  email: string,
  password: string,
  activationLink: string,
  isActivated: boolean,
  plan: Plan,
  likedMovies: Movie[],
  watchLaterMovies: Movie[],
}
