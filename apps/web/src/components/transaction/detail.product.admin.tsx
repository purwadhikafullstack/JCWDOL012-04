'use client'
import { useEffect, useState } from "react";
import { TransactionsModel } from "@/model/TransactionsModel";
import { ProductsModel } from "@/model/ProductsModel";
import { TransactionProductWithStockModel } from "@/model/TransactionProductWithStockModel";
import { TransactionsProductsModel } from "@/model/TransactionsProductsModel";
import ImagePlaceholder from "@/components/image.placeholder";
import { getPrimaryImagePath } from "@/lib/product.image.primary.path";
import TransactionProductApi from "@/api/transaction.product.api";
import idr from "@/lib/idrCurrency";

export default function TransactionProductDetail({ handleUpdate, transaction, transactionProductWithStock }: { handleUpdate: () => void, transaction: TransactionsModel, transactionProductWithStock: TransactionProductWithStockModel[] }) {
    const products = transactionProductWithStock;
    const transactionProductApi = new TransactionProductApi();

    function handleRequestMutation(id: string) {
        const transactionProductId = parseInt(id);
        const transactionProduct = products.find((item) => item.id === transactionProductId);

        if (transactionProduct) {
            const data = {
                warehouseId: transaction.warehouseId,
                productId: transactionProduct.productId,
                transactionId: transaction.id,
                rawQuantity: transactionProduct.quantity
            }
            transactionProductApi.requestStock(data)
            .then(() => {
                handleUpdate();
            }).catch((err) => {
                console.log(err)
            });
        }
    }

    return (
        <div className="border border-[var(--lightPurple)] rounded-xl">
            <h2 className="text-xl font-semibold p-5">Products detail</h2>
            <hr />
            <div className="flex flex-col gap-2 m-2">
                {products.map((item) => {
                    return (
                        <div key={item.id}>
                            <div className="flex gap-2 py-5 m-2 justify-between">
                                <div className="flex">
                                    <ImagePlaceholder primaryImagePath={getPrimaryImagePath(item.product)} alt={`${item.id}`} />
                                    <a href={`/products/${item.productId}`} className="px-6 py-4 hover:underline">{item.product?.name}</a>
                                </div>
                                <div className="flex-col" >
                                    <div className="flex items-center">
                                        <p className="mr-2 font-semibold">x {item.quantity}</p>
                                        <p className="py-4 font-semibold ml-auto">@{idr(item.product?.price ?? 0)}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="font-bold text-lg flex" key={item.product?.price}>{idr((item.product?.price ?? 0) * item.quantity)}</p>
                                    </div>
                                </div>
                                <div className="py-4">
                                    <p className="font-semibold">Warehouse Stock: {item.stock}</p>
                                    <p className="font-semibold">Global Stock: {item.globalStock}</p>
                                    <button value={item.id} className={`${(item.quantity > item.stock && item.quantity < item.globalStock) ? "bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] text-white" : "bg-gray-400"} rounded-md px-4 py-2 mt-2`} onClick={(e) => { handleRequestMutation((e.target as HTMLButtonElement).value) }} disabled={(item.quantity < item.stock) || (item.quantity > item.globalStock)}>Request Stock</button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}