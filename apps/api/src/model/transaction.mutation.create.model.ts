import { mutationType } from "@prisma/client";

export type MutationCreateModel = {
    transactionId: number;
    productId: number;
    warehouseId: number;
    isAdd: boolean;
    quantity: number;
    mutationType: mutationType;
}