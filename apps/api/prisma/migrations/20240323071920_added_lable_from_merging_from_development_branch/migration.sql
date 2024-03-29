/*
  Warnings:

  - You are about to drop the column `archieved` on the `UserCities` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "mutationType" ADD VALUE 'TRANSACTION_REVERSAL';

-- AlterTable
ALTER TABLE "UserCities" DROP COLUMN "archieved",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
