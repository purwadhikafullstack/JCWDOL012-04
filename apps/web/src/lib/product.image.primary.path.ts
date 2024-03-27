import { ProductsModel } from "@/model/ProductsModel";

export function getPrimaryImagePath(product?: ProductsModel) {
    const productImage = product?.productImages ?? [];
    const primaryImagePath = (productImage.length > 0 ? productImage[0]?.path : '/asdf');
    return primaryImagePath;
}