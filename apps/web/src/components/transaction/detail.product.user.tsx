'use client'
import { useEffect, useState } from "react";
import { TransactionsModel } from "@/model/TransactionsModel";
import { ProductsModel } from "@/model/ProductsModel";
import { TransactionsProductsModel } from "@/model/TransactionsProductsModel";
import ImagePlaceholder from "@/components/image.placeholder";
import { getPrimaryImagePath } from "@/lib/product.image.primary.path";
import idr from "@/lib/idrCurrency";

export default function TransactionProductDetailUser({ transaction }: { transaction: TransactionsModel }) {
    const products = transaction.products as TransactionsProductsModel[];

    return (
        <div className="border border-[var(--lightPurple)] rounded-xl">
            <h2 className="text-xl font-semibold p-5">Products detail</h2>
            <hr />
            <div className="flex flex-col gap-2 m-2">
                {products.map((item) => {
                    return (
                        <div key={item.id}>
                            <div className="flex gap-2 py-5 m-2">
                                <div className="flex mr-auto">
                                    <ImagePlaceholder primaryImagePath={getPrimaryImagePath(item.product)} alt={`${item.id}`} />
                                    <a href={`/products/${item.productId}`} className="px-6 py-4 hover:underline">{item.product?.name}</a>
                                </div>
                                <div className="ml-auto flex-col" >
                                    <div className="flex items-center">
                                        <p className="mr-2 font-semibold">x {item.quantity}</p>
                                        <p className="py-4 font-semibold ml-auto">@{idr(item.product?.price ?? 0)}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="font-bold text-lg flex" key={item.product?.price}>{idr((item.product?.price ?? 0) * item.quantity)}</p>
                                    </div>
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