import { IUser } from './IUser';

export interface ICreateSessionRequest {
  email: string;
  password: string;
}
export interface ICreateSessionResponse {
  user: IUser;
  token: string;
}
