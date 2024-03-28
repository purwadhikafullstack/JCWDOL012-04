import { MutationTypeModel } from './MutationTypeModel';
import { ProductsModel } from './ProductsModel';
import { TransactionsModel } from './TransactionsModel';
import { WarehousesModel } from './WarehousesModel';

export interface MutationsModel {
  id: number;
  productId: number;
  product?: ProductsModel;
  warehouseId: number;
  warehouse?: WarehousesModel;
  destinationWarehouseId: number;
  destinationWarehouse?: WarehousesModel;
  transactionId?: number;
  transaction?: TransactionsModel;
  isAdd: boolean;
  isAccepted: boolean;
  quantity: number;
  mutationType: MutationTypeModel;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
}
