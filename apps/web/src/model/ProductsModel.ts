import { MutationsModel } from "./MutationsModel";
import { ProductCategoriesModel } from "./ProductCategoriesModel";
import { ProductImagesModel } from "./ProductImagesModel";
import { ProductWarehousesModel } from "./ProductWarehousesModel";
import { ShoppingCartModel } from "./ShoppingCartModel";
import { TransactionsProductsModel } from "./TransactionsProductsModel";


export interface ProductsModel {
    id: number;
    name: string;
    description: string;
    price: number;
    productCategoryId: number;
    productCategory: ProductCategoriesModel;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    productImages?: ProductImagesModel[];
    productsWarehouses?: ProductWarehousesModel[];
    transactionsProducts?: TransactionsProductsModel[];
    mutations?: MutationsModel[];
    shoppingCart?: ShoppingCartModel[];
}