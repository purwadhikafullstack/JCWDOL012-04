// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data here



//   id                         Int         @id @default(autoincrement())
//   firstName                  String
//   lastName                   String
//   email                      String      @unique
//   password                   String?
//   gender                     String
//   phoneNumber                String
//   isVerified                 Boolean     @default(false)
//   role                       Role        @default(CUSTOMER)
//   primaryAddressId           Int?
//   wareHouseAdmin_warehouseId Int?
//   wareHouseAdmin             Warehouses? @relation(fields: [wareHouseAdmin_warehouseId], references: [id])
//   profilePicture             String?
//   createdAt                  DateTime    @default(now())
//   updatedAt                  DateTime    @updatedAt
//   archived                   Boolean     @default(false)

for(let i = 1; i <= 20; i++){
    await prisma.users.create({
      data: {
        firstName: 'customer'+i,
        lastName: 'lastName'+i,
        email: 'email'+i+'@bata.com',
        password: 'password'+i,
        gender: 'gender'+i,
        phoneNumber: 'phoneNumber'+i,
        isVerified: true,
        role: 'CUSTOMER',
        profilePicture: '/images/profilePict1.jpeg'
      },
    });
}

await prisma.users.create({
    data: {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        gender: 'male',
        phoneNumber: '123456789',
        isVerified: true,
        role: 'SUPER_ADMIN',
        profilePicture: '/images/profilePict1.jpeg'
}});

for(let i = 1; i <= 5; i++){
    await prisma.users.create({
        data: {
            firstName: 'warehouse_admin'+i,
            lastName: 'warehouse_admin'+i,
            email: 'warehouse_admin'+i+'@admin.com',
            password: 'warehouse_admin'+i,
            gender: 'male',
            phoneNumber: '123456789',
            isVerified: true,
            role: 'WAREHOUSE_ADMIN',
            profilePicture: '/images/profilePict1.jpeg'
    }});
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });