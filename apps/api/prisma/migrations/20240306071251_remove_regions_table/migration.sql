/*
  Warnings:

  - You are about to drop the column `regionId` on the `Provinces` table. All the data in the column will be lost.
  - You are about to drop the `Regions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Provinces" DROP CONSTRAINT "Provinces_regionId_fkey";

-- AlterTable
ALTER TABLE "Provinces" DROP COLUMN "regionId";

-- DropTable
DROP TABLE "Regions";
