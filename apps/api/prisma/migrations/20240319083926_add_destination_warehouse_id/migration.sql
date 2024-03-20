/*
  Warnings:

  - Added the required column `destinationWarehouseId` to the `Mutations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "mutationType" ADD VALUE 'REQUEST';

-- AlterTable
ALTER TABLE "Mutations" ADD COLUMN     "destinationWarehouseId" INTEGER,
ADD COLUMN     "isAccepted" BOOLEAN;

-- AddForeignKey
ALTER TABLE "Mutations" ADD CONSTRAINT "Mutations_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "Warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
