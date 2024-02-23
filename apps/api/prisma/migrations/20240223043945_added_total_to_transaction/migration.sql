/*
  Warnings:

  - You are about to drop the column `primaryAddressId` on the `Users` table. All the data in the column will be lost.
  - Added the required column `total` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "primaryAddressId";
