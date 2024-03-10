import { ProductsModel } from './ProductsModel';

export interface ProductCategoriesModel {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  products?: ProductsModel[];
}
