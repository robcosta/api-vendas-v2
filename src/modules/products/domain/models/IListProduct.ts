import { IProduct } from './IProduct';
export interface IListProduct {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: IProduct[];
}
