'use client'
import { useState, useEffect } from "react";
import { TransactionsModel } from "@/model/TransactionsModel";
import TransactionApi from "@/api/transaction.user.api.withAuth";
import TransactionWarehouseApi from "@/api/transaction.warehouse.api";
import idr from "@/lib/idrCurrency";
import { ProductsModel } from "@/model/ProductsModel";
import { WarehousesModel } from "@/model/WarehousesModel";
import { OrderStatusModel } from "@/model/OrderStatusModel";
import { date_format } from "@/lib/date.format";
import ImagePlaceholder from "@/components/image.placeholder";
import { getPrimaryImagePath } from "@/lib/product.image.primary.path";
import { TransactionsProductsModel } from "@/model/TransactionsProductsModel";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { useUpdateCart } from "@/lib/cart.provider.update";


export default function TransactionHistory() {
    const updateCart = useUpdateCart();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionsModel[]>([]);
    const [searchByOrderIdTerm, setSearchByOrderIdTerm] = useState('');
    const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
    const [warehouseTerm, setWarehouseTerm] = useState<number>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatusModel[]>([]);
    const [orderStatusTerm, setOrderStatusTerm] = useState<OrderStatusModel>();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const transactionApi = new TransactionApi();
    const transactionWarehouseApi = new TransactionWarehouseApi();
    const router = useRouter();
    const auth = useAuth();
    const isAuthenticated = auth?.user?.isAuthenticated;
    const role = auth?.user?.data?.role;

    useEffect(() => {
        updateCart();
        transactionApi.getAllForAdmin().then((response) => {
            setTransactions(response.data);
        }).catch((error) => {
            console.log(error);
        });

        transactionApi.getAllOrderStatus().then((response) => {
            setOrderStatus(response.data);
        }).catch((error) => {
            console.log(error);
        });

        transactionWarehouseApi.getAllWarehouses().then((response) => {
            setWarehouses(response.data);
        }).catch((error) => {
            console.log(error);
        });

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Loading...
            </div>
        )
    }

    if (!isAuthenticated || (role !== 'SUPER_ADMIN' && role !== "WAREHOUSE_ADMIN")) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Unauthorized | 401
            </div>
        )
    }



    let filteredTransactions = transactions;

    if (searchByOrderIdTerm !== '' || startDate || endDate || orderStatusTerm || warehouseTerm) {
        filteredTransactions = transactions.filter(transaction => {
            const orderIdMatch = transaction.transactionUid.toLowerCase().includes(searchByOrderIdTerm.toLowerCase());
            const dateMatch = (!startDate || new Date(transaction.createdAt) >= startDate) &&
                (!endDate || new Date(transaction.createdAt) <= endDate);
            const orderStatusMatch = orderStatusTerm ? transaction.orderStatus === orderStatusTerm : true;
            const warehouseMatch = warehouseTerm ? transaction.warehouseId === warehouseTerm : true;
            return orderIdMatch && dateMatch && orderStatusMatch && warehouseMatch;
        });
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="h-fit overflow-auto pb-[120px]">
            <div className="flex flex-col gap-4 px-6 rounded-xl bg-white py-6">
                <h1 className="text-base font-bold">Transaction History</h1>
                <div>
                    <div className="lg:flex lg:gap-5">
                        <input
                            type="text"
                            value={searchByOrderIdTerm}
                            onChange={e => setSearchByOrderIdTerm(e.target.value)}
                            placeholder="Search by order-id"
                            className="rounded-xl p-2"
                        />
                        {role == "SUPER_ADMIN" &&
                            <select
                                value={warehouseTerm}
                                onChange={e => setWarehouseTerm(parseInt(e.target.value))}
                                className="rounded-xl p-2 min-w-56"
                            >
                                <option value="">Warehouse</option>
                                {warehouses.map(warehouse => (
                                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                ))}
                            </select>
                        }
                        <input
                            type="date"
                            value={startDate?.toISOString().substr(0, 10) || ''}
                            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                            placeholder="Start date"
                            className="rounded-xl p-2"
                        />
                        <div className="lg:text-center my-auto">to</div>
                        <input
                            type="date"
                            value={endDate?.toISOString().substr(0, 10) || ''}
                            onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                            placeholder="End date"
                            className="rounded-xl p-2"
                        />
                    </div>
                    <div className="2xl:flex 2xl:gap-2 my-2">
                        {orderStatus.map(status => (
                            <button key={status} onClick={() => { setOrderStatusTerm(status) }} className={`p-2 my-2 mx-2 2xl:mx-0 2xl:my-0 rounded-xl border-2 border-[var(--lightPurple)] hover:bg-[var(--lightPurple)] hover:text-white ${orderStatusTerm == status ? 'bg-[var(--lightPurple)] text-white' : 'bg-white'}`}>
                                <p>{status}</p>
                            </button>
                        ))}
                        <button onClick={() => { setOrderStatusTerm(undefined) }} className={`p-2 rounded-xl border-2 border-[var(--lightPurple)] hover:bg-[var(--lightPurple)] hover:text-white ${orderStatusTerm == undefined ? 'bg-[var(--lightPurple)] text-white' : 'bg-white'}`}>
                            <p>ALL</p>
                        </button>
                        <div>

                        </div>
                    </div>
                    <div className="py-5">
                        {currentItems.map((transaction) => {
                            let product: ProductsModel = {} as ProductsModel;
                            let transactionProducts: TransactionsProductsModel[] = [];
                            let transactionProduct: TransactionsProductsModel = {} as TransactionsProductsModel;
                            if (transaction.products !== undefined && transaction.products.length > 0) {
                                product = transaction.products[0].product ?? {} as ProductsModel;
                                transactionProduct = transaction.products[0];
                                transactionProducts = transaction.products;
                            }
                            return (
                                <div key={transaction.id} className="lg:max-w-[888px] lg:min-h-[200px] border-[2px] border-[var(--primaryColor)] rounded-xl mb-5 p-4">
                                    <div className="lg:flex lg:gap-2 ">
                                        <p className="">{transaction.transactionUid}</p>
                                        <p className="text-gray-500 items-end">{'- ' + date_format(new Date(transaction.createdAt))}</p>
                                        <p className="ml-auto text-gray-500">{transaction.orderStatus}</p>
                                    </div>
                                    <div key={product.id} className="lg:flex gap-2 py-5 m-2">
                                        <div className="lg:flex mr-auto">
                                            <ImagePlaceholder primaryImagePath={getPrimaryImagePath(product)} alt={`${product.id}`} />
                                            <div className="px-6 py-2">
                                                <p className="">{product.name}</p>
                                                <p className="mr-2 text-sm text-gray-500">{transactionProduct.quantity} {transactionProduct.quantity > 1 ? 'items' : 'item'} x {idr(product.price ?? 0)}</p>
                                                {transactionProducts.length > 1 && <a href={`/orders/${transaction.transactionUid}`} className="text-sm text-gray-500 hover:underline">+ {transactionProducts.length - 1} other {transactionProducts.length > 2 ? "products" : "product"}</a>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="py-2">{idr(transaction.total)}</p>
                                            <button className="bg-[var(--primaryColor)] text-white rounded-xl p-2 min-h-10 min-w-28 self-end hover:bg-[var(--lightPurple)]" onClick={() => router.push(`orders/${transaction.transactionUid}`)}>View Details</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 justify-center">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={filteredTransactions.length > 10 ? 'border border-[var(--primaryColor)] rounded-xl p-2 mt-2 hover:bg-[var(--primaryColor)] hover:text-white' : 'hidden'}
                >
                    Previous
                </button>
                <button
                    disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={filteredTransactions.length > 10 ? 'border border-[var(--primaryColor)] rounded-xl p-2 mt-2 hover:bg-[var(--primaryColor)] hover:text-white' : 'hidden'}
                >
                    Next
                </button>
            </div>
        </div>
    );
}