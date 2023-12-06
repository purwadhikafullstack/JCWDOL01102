import { IUser } from '../helper/interface/user/user.interface';

declare namespace Express {
  interface Request {
    user: IUser; // Replace 'any' with the actual type of your 'user' property
  }
}
