import { UserDoc } from "../interfaces/UserDoc";
import { Plan } from '../interfaces/Plan';
import { Movie } from "../interfaces/Movie";

class UserDto {
  email: string;
  id: number;
  isActivated: boolean;
  plan: Plan;
  watchLaterMovies: Movie[];
  likedMovies: Movie[]

  constructor(model: UserDoc) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.plan = model.plan;
    this.watchLaterMovies = model.watchLaterMovies;
    this.likedMovies = model.likedMovies;
  }
}

export default UserDto;
