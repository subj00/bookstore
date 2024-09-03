import { Book } from './book';

export type Order = {
  _id?: string;
  products: (Book & { quantity: number })[];
  user?: string;
  date?: string;
};
