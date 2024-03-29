import { ProductsModel } from "@/model/ProductsModel";

export function getPrimaryImagePath(product?: ProductsModel) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_BACKEND_URL_DEV;
    const productImage = product?.productImages ?? [];
    const primaryImagePath = (productImage.length > 0 ? `${baseUrl}${productImage[0]?.path}` : '/asdf');
    return primaryImagePath;
}