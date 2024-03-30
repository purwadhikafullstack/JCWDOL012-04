// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
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

  console.log(provincesRO);

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
        provinceId: parseInt(item.province_id),
      },
    });
    console.log(`Created city ${item.city_name}`);
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

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
