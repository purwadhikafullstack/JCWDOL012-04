/*
  Warnings:

  - You are about to drop the column `archived` on the `UserCities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserCities" DROP COLUMN "archived",
ADD COLUMN     "archieved" BOOLEAN NOT NULL DEFAULT false;
