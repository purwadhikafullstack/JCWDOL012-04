/*
  Warnings:

  - You are about to drop the column `archieved` on the `UserCities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionUid]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `weight` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddressId` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionUid` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "mutationType" ADD VALUE 'TRANSACTION_REVERSAL';

-- DropForeignKey
ALTER TABLE "Mutations" DROP CONSTRAINT "Mutations_destinationWarehouseId_fkey";

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "weight" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "shippingAddressId" INTEGER NOT NULL,
ADD COLUMN     "transactionUid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserCities" ADD COLUMN  "closestWarehouseId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionUid_key" ON "Transactions"("transactionUid");

-- AddForeignKey
ALTER TABLE "UserCities" ADD CONSTRAINT "UserCities_closestWarehouseId_fkey" FOREIGN KEY ("closestWarehouseId") REFERENCES "Warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "UserCities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mutations" ADD CONSTRAINT "Mutations_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "Warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
