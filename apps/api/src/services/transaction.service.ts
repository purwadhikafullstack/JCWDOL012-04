import { prisma } from "./prisma.service";
import { Transactions, orderStatus } from "@prisma/client";
import { TransactionsCreateModel } from "@/model/transaction.create.model";
import { MutationCreateModel } from "@/model/transaction.mutation.create.model";
import { transactionProductCreateModel } from "@/model/transaction.product.create.model";
import { midtransRequest } from "@/model/transaction.midtrans.create.model";


export default class TransactionService {
    rajaOngkirApiKey;
    rajaOngkirUrl;
    constructor() {
        this.rajaOngkirApiKey = process.env.RAJAONGKIR_API_KEY ?? '';
        this.rajaOngkirUrl = process.env.RAJAONGKIR_URL ?? '';
        if (!this.rajaOngkirApiKey || !this.rajaOngkirUrl) {
            console.error('RAJAONGKIR_API_KEY or RAJAONGKIR_URL is not defined');
            process.exit(1);
        }
    }

    async getAllTransactionAdmin(): Promise<Transactions[]> {
        return await prisma.transactions.findMany({
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                productImages: {
                                    where: {
                                        archived: false,
                                    },
                                },
                            }
                        }
                    }
                },
                mutations: true
            },
            where: {
                archived: false,
            },
            orderBy: {
                id: 'desc'
            }
        });
    }

    async getAllTransactionAdminWarehouse(wareHouseAdmin_warehouseId: number): Promise<Transactions[]> {
        return await prisma.transactions.findMany({
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                productImages: {
                                    where: {
                                        archived: false,
                                    },
                                },
                            }
                        }
                    }
                },
                mutations: true
            },
            where: {
                warehouseId: wareHouseAdmin_warehouseId,
                archived: false,
            },
            orderBy: {
                id: 'desc'
            }
        });
    }

    async getByTransactionUid(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.findFirst({
            where: {
                transactionUid: transactionUid,
                archived: false
            },
            include: {
                shippingAddress: true,
                products: {
                    include: {
                        product: {
                            include: {
                                productImages: {
                                    where: {
                                        archived: false,
                                    },
                                },
                            }
                        }
                    }
                }
            }
        });
    }

    async getLatestTransactionUid(userId: number): Promise<string> {
        return await prisma.transactions.findFirst({
            where: {
                userId: userId
            },
            orderBy: {
                id: 'desc'
            }
        }).then(transaction => transaction?.transactionUid ?? '');
    }

    async getAllTransactionCustomer(userId: number): Promise<Transactions[]> {
        return await prisma.transactions.findMany({
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                productCategory: true,
                                productImages: {
                                    where: {
                                        archived: false,
                                    },
                                },
                            }
                        }
                    }
                }
            },
            where: {
                userId: userId,
                archived: false,
            },
            orderBy: {
                id: 'desc'
            }
        });
    }

    async getAllOrderStatus(): Promise<orderStatus[]> {
        return Object.values(orderStatus);
    }

    async create(transaction: TransactionsCreateModel, transactionProductTempData: transactionProductCreateModel[]): Promise<Transactions> {
        const temp = await prisma.$transaction(async (prisma) => {
            const transactionData = await prisma.transactions.create({
                data: transaction
            });
            for (const product of transactionProductTempData) {
                await prisma.transactionsProducts.create({
                    data: {
                        ...product,
                        transactionId: transactionData.id
                    }
                });
            }
            await prisma.shoppingCart.deleteMany({
                where: {
                    userId: transaction.userId
                }
            });
            return transactionData;
        })
        if (temp) {
            return temp;
        } else {
            return {} as Transactions;
        }
    }

    async getByTransactionUidAdmin(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.findFirst({
            where: {
                transactionUid: transactionUid,
                archived: false
            },
            include: {
                shippingAddress: true,
                products: {
                    include: {
                        product: {
                            include: {
                                productImages: {
                                    where: {
                                      archived: false,
                                    },
                                  },
                            }
                        }
                    }
                },
                warehouse: true
            }
        });
    }

    async cancelTransaction(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid,
                archived: false
            },
            data: {
                orderStatus: 'CANCELLED',
                cancelledDate: new Date()
            }
        });
    }

    async postPaymentProof(transactionUid: string, paymentProof: string) {
        const temp = await prisma.$transaction(async (prisma) => {
            const update = await prisma.transactions.update({
                where: {
                    transactionUid: transactionUid,
                    archived: false
                },
                data: {
                    paymentProof: paymentProof
                }
            });
            if (update) {
                const updateOrderStatus = await prisma.transactions.update({
                    where: {
                        transactionUid: transactionUid,
                        archived: false
                    },
                    data: {
                        orderStatus: 'PENDING_VERIFICATION',
                        paymentProofDate: new Date()
                    }
                });
            }
            return update;
        })
        if (temp) {
            return temp;
        } else {
            return {} as Transactions;
        }
    }

    async confirmTransaction(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid,
                archived: false
            },
            data: {
                orderStatus: 'CONFIRMED',
                confirmationDate: new Date()
            }
        });
    }

    async paymentGatewayFailed(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid
            },
            data: {
                orderStatus: 'FAILED_PAYMENT',
                failedPaymentDate: new Date()
            }
        });
    }

    async paymentGatewaySuccess(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid
            },
            data: {
                orderStatus: 'PROCESSING',
                verifiedDate: new Date(),
                processDate: new Date()
            }
        });
    }

    async verifyPayment(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid
            },
            data: {
                orderStatus: 'VERIFIED',
                verifiedDate: new Date()
            }
        });
    }

    async createMidtransTransaction(midtransReq: midtransRequest) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')
        };

        const result = await fetch(`${process.env.MIDTRANS_SANDBOX_URL}/snap/v1/transactions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(midtransReq)
        })
            .then(response => response.json())
            .catch(err => console.error(err));
        return result;
    }

    async getLatestId(): Promise<number> {
        return await prisma.transactions.findFirst({
            orderBy: {
                id: 'desc'
            }
        }).then(transaction => transaction?.id ?? 0);
    }

    async getByUserId(userId: number): Promise<Transactions[]> {
        return await prisma.transactions.findMany({
            where: {
                userId: userId,
                archived: false
            },
            include: {
                products: true,
                mutations: true
            }
        });
    }

    async getById(id: number): Promise<Transactions | null> {
        return await prisma.transactions.findUnique({
            where: {
                id: id,
                archived: false
            },
            include: {
                products: true,
                mutations: true
            }
        });
    }

    async update(id: number, transaction: Transactions): Promise<Transactions> {
        return await prisma.transactions.update({
            where: {
                id: id
            },
            data: transaction
        });
    }

    async fetchRajaOngkir(data: any): Promise<{}> {
        const headers = new Headers();
        headers.append('key', this.rajaOngkirApiKey);
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        const result = await fetch(`${this.rajaOngkirUrl}/cost`, {
            method: 'POST',
            headers: headers,
            body: formData
        })
            .then(response => response.json())
            .then(data => data.rajaongkir.results)
            .catch(err => console.error(err));
        return result;
    }

    async getOngkir(cityId: number, warehouseCityId: number, weight: number): Promise<{}> {
        const baseData = { origin: "" + warehouseCityId, destination: "" + cityId, weight: weight };
        const dataJne = { ...baseData, courier: 'jne' };
        const dataPos = { ...baseData, courier: 'pos' };
        const dataTiki = { ...baseData, courier: 'tiki' };
        const ongkirJne = await this.fetchRajaOngkir(dataJne);
        const ongkirPos = await this.fetchRajaOngkir(dataPos);
        const ongkirTiki = await this.fetchRajaOngkir(dataTiki);
        return {
            jne: ongkirJne,
            pos: ongkirPos,
            tiki: ongkirTiki
        };
    }

    async denyPayment(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid
            },
            data: {
                orderStatus: 'PENDING_PROOF'
            }
        });
    }

    async processOrder(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid
            },
            data: {
                orderStatus: 'PROCESSING',
                processDate: new Date()
            }
        });
    }

    async shipTransaction(transactionUid: string): Promise<Transactions | null> {
        return await prisma.transactions.update({
            where: {
                transactionUid: transactionUid
            },
            data: {
                orderStatus: 'SHIPPING',
                shippingDate: new Date()
            }
        });
    }

}