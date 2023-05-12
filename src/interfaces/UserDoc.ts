import { Document } from "mongoose";
import { Plan } from "interfaces/Plan";
import { Movie } from "interfaces/Movie";

export interface UserDoc extends Document {
  email: string,
  password: string,
  activationLink: string,
  isActivated: boolean,
  plan: Plan,
  likedMovies: Movie[],
  watchLaterMovies: Movie[],
}
