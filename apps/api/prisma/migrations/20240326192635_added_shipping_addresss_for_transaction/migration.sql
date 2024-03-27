/*
  Warnings:

  - Added the required column `shippingAddressId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "shippingAddressId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "UserCities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
