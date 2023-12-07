import { IUser } from './helper/interface/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: IUser; // or the type of your User entity
    }
  }
}
