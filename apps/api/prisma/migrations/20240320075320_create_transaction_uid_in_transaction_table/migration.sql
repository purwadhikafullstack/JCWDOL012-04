/*
  Warnings:

  - A unique constraint covering the columns `[transactionUid]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionUid` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "transactionUid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionUid_key" ON "Transactions"("transactionUid");
