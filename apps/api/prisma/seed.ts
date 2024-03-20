// prisma/seed.ts
import { Transactions, PrismaClient, Mutations } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const rajaOngkirApiKey = process.env.RAJAONGKIR_API_KEY;
  const rajaOngkirUrl = process.env.RAJAONGKIR_URL;

  if (!rajaOngkirApiKey || !rajaOngkirUrl) {
    console.error('RAJAONGKIR_API_KEY or RAJAONGKIR_URL is not defined');
    process.exit(1);
  }
  const headers = new Headers();
  headers.append('key', rajaOngkirApiKey);

  const citiesRO = await fetch(`${rajaOngkirUrl}/city`, {
    method: 'GET',
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => data.rajaongkir.results)
    .catch((err) => console.error(err));

  const provincesRO = await fetch(`${rajaOngkirUrl}/province`, {
    method: 'GET',
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => data.rajaongkir.results)
    .catch((err) => console.error(err));

  console.log(provincesRO)

  for (const item of provincesRO) {
    await prisma.provinces.create({
      data: {
        id: parseInt(item.province_id),
        name: item.province,
      },
    });
    console.log(`Created province ${item.province}`);
  }

  for (const item of citiesRO) {
    await prisma.cities.create({
      data: {
        id: parseInt(item.city_id),
        name: item.city_name,
        type: item.type.toUpperCase(),
        provinceId: parseInt(item.province_id)
      }
    });
    console.log(`Created city ${item.city_name}`);
  }

  //20 customer
  for (let i = 1; i <= 20; i++) {
    let passwordUser = await hash(`password${i}`, await genSalt(10));
    await prisma.users.create({
      data: {
        firstName: 'customer' + i,
        lastName: 'lastName' + i,
        email: 'email' + i + '@bata.com',
        password: passwordUser,
        gender: 'gender' + i,
        phoneNumber: 'phoneNumber' + i,
        isVerified: true,
        role: 'CUSTOMER',
        profilePicture: '/images/profilePict1.jpeg',
      },
    });
    console.log(`Created customer ${i}`);
  }

  let passwordAdmin = await hash(`super_admin`, await genSalt(10));
  //1 superadmin
  await prisma.users.create({
    data: {
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@admin.com',
      password: passwordAdmin,
      gender: 'male',
      phoneNumber: '123456789',
      isVerified: true,
      role: 'SUPER_ADMIN',
      profilePicture: '/images/profilePict1.jpeg',
    },
  });
  console.log(`Created superadmin`);

  //5 warehouse
  for (let i = 1; i <= 5; i++) {
    await prisma.warehouses.create({
      data: {
        name: 'warehouse' + i,
        address: 'address' + i,
        cityId: i,
        latitude: 'latitude' + i,
        longitude: 'longitude' + i,
      },
    });
  }
  console.log(`Created warehouse`);

  //5 warehouse admin
  for (let i = 1; i <= 5; i++) {
    const warehouseId = i;
    let passwordWarehouseAdmin = await hash(
      `warehouse_admin`,
      await genSalt(10),
    );
    await prisma.users.create({
      data: {
        firstName: 'warehouse_admin' + i,
        lastName: 'warehouse_admin' + i,
        email: 'warehouse_admin' + i + '@admin.com',
        password: passwordWarehouseAdmin,
        gender: 'male',
        phoneNumber: '123456789',
        isVerified: true,
        wareHouseAdmin_warehouseId: warehouseId,
        role: 'WAREHOUSE_ADMIN',
        profilePicture: '/images/profilePict1.jpeg',
      },
    });
    console.log(`Created warehouse admin ${i}`);
  }

  //address
  for (let i = 1; i <= 20; i++) {
    let randAddressCount = Math.floor(Math.random() * 5) + 1;
    for (let j = 1; j <= randAddressCount; j++) {
      let randCityId = Math.floor(Math.random() * 5) + 1;
      let isPrimaryAddressTemp = j === 1;
      await prisma.userCities.create({
        data: {
          userId: i,
          cityId: randCityId,
          address: 'address' + j,
          latitude: 'latitude' + j,
          longitude: 'longitude' + j,
          isPrimaryAddress: isPrimaryAddressTemp,
          label: 'Address label' + j
        }
      });
      console.log(`Created address${j} for customer${i}`);
    }
  }

  //5 product categories
  for (let i = 1; i <= 5; i++) {
    await prisma.productCategories.create({
      data: {
        name: 'productCategory' + i,
        description: 'description' + i,
      },
    });
    console.log(`Created product category${i}`);
  }

  //30 products
  for (let i = 1; i <= 30; i++) {
    let categoryTemp = Math.floor(Math.random() * 5) + 1;
    let priceTemp = Math.floor(Math.random() * 20000000) + 1000;
    await prisma.products.create({
      data: {
        name: 'product' + i,
        description: 'description' + i,
        price: priceTemp,
        productCategoryId: categoryTemp,
      },
    });
    console.log(`Created product${i}`);
  }

  //product images
  for (let i = 1; i <= 30; i++) {
    let randImageCount = Math.floor(Math.random() * 7) + 2;
    for (let j = 1; j <= randImageCount; j++) {
      await prisma.productImages.create({
        data: {
          productId: i,
          path: '/images/products/product' + i + 'image' + j + '.jpeg',
        },
      });
      console.log(`Created product${i} image${j}`);
    }
  }

  //5 warehouses products
  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 30; j++) {
      let stockTemp =
        Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : 0;
      await prisma.productsWarehouses.create({
        data: {
          warehouseId: i,
          productId: j,
          stock: stockTemp,
        },
      });
      console.log(
        `Created product${j} to warehouse${i} with stock ${stockTemp}`,
      );
    }
  }

  // shopping cart
  for (let i = 1; i <= 20; i++) {
    let randProductCount = Math.floor(Math.random() * 5) + 1;
    for (let j = 1; j <= randProductCount; j++) {
      let productTemp = Math.floor(Math.random() * 30) + 1;
      let quantityTemp = Math.floor(Math.random() * 5) + 1;
      await prisma.shoppingCart.create({
        data: {
          userId: i,
          productId: productTemp,
          quantity: quantityTemp,
        },
      });
      console.log(
        `Created product${productTemp} to shopping cart of customer${i} with quantity ${quantityTemp}`,
      );
    }
  }

  let orderStatusEnum = [
    'PENDING_PROOF',
    'PENDING_VERIFICATION',
    'VERIFIED',
    'FAILED_PAYMENT',
    'CANCELLED',
    'PROCESSING',
    'SHIPPING',
    'SENT',
    'CONFIRMED',
  ];

  // 100 transaction
  for (let i = 1; i <= 100; i++) {
    let userIdTemp = Math.floor(Math.random() * 20) + 1;
    let orderStatusTemp: Transactions['orderStatus'] = orderStatusEnum[
      Math.floor(Math.random() * 9)
    ] as Transactions['orderStatus'];
    let warehouseIdTemp = Math.floor(Math.random() * 5) + 1;
    let shippingCostTemp = Math.floor(Math.random() * 100000) + 1000;
    let totalTemp = Math.floor(Math.random() * 1000000) + 1000;
    let paymentTypeTemp = Math.random() > 0.5 ? 'PAYMENT_GATEWAY' : 'TRANSFER';
    await prisma.transactions.create({
      data: {
        userId: userIdTemp,
        paymentType: paymentTypeTemp as Transactions['paymentType'],
        orderStatus: orderStatusTemp,
        warehouseId: warehouseIdTemp,
        shippingCost: shippingCostTemp,
        total: totalTemp,
      },
    });
    console.log(`Created transaction ${i}`);
  }

  //transaction products
  for (let i = 1; i <= 100; i++) {
    let transactionIdTemp = i;
    let productCountTemp = Math.floor(Math.random() * 5) + 1;
    for (let j = 1; j <= productCountTemp; j++) {
      let productIdTemp = Math.floor(Math.random() * 30) + 1;
      let quantityTemp = Math.floor(Math.random() * 5) + 1;
      let priceTemp = Math.floor(Math.random() * 100000) + 1000;
      await prisma.transactionsProducts.create({
        data: {
          transactionId: transactionIdTemp,
          productId: productIdTemp,
          quantity: quantityTemp,
          price: priceTemp,
        },
      });
      console.log(`Created transaction${i} product${j}`);
    }
  }

  let mutationType = ['TRANSACTION', 'MANUAL_ADMIN', 'AUTOMATED'];

  //mutations
  for (let i = 1; i <= 100; i++) {
    let productIdTemp = Math.floor(Math.random() * 30) + 1;
    let warehouseIdTemp = Math.floor(Math.random() * 5) + 1;
    let transactionIdTemp = Math.random() > 0.7 ? i : null;
    let isAddTemp = Math.random() > 0.5;
    let quantityTemp = Math.floor(Math.random() * 5) + 1;
    let mutationTypeTemp = mutationType[Math.floor(Math.random() * 3)];
    await prisma.mutations.create({
      data: {
        productId: productIdTemp,
        warehouseId: warehouseIdTemp,
        transactionId: transactionIdTemp,
        isAdd: isAddTemp,
        quantity: quantityTemp,
        mutationType: mutationTypeTemp as Mutations['mutationType'],
      },
    });
    console.log(`Created mutation ${i}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
