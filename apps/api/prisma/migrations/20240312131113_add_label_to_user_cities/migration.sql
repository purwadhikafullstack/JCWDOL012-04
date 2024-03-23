/*
  Warnings:

  - Added the required column `label` to the `UserCities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCities" ADD COLUMN     "label" TEXT NOT NULL;
