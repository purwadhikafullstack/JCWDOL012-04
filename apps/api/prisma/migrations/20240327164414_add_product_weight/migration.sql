/*
  Warnings:

  - You are about to drop the column `archieved` on the `UserCities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionUid]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `weight` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddressId` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionUid` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "Mutations" DROP CONSTRAINT "Mutations_destinationWarehouseId_fkey";

-- AddForeignKey
ALTER TABLE "Mutations" ADD CONSTRAINT "Mutations_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "Warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
