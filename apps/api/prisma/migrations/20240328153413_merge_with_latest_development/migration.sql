/*
  Warnings:

  - You are about to drop the column `archived` on the `UserCities` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mutations" DROP CONSTRAINT "Mutations_destinationWarehouseId_fkey";

-- AlterTable
ALTER TABLE "UserCities" DROP COLUMN "archived",
ADD COLUMN     "archieved" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Mutations" ADD CONSTRAINT "Mutations_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "Warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
