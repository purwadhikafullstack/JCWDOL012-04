/*
  Warnings:

  - The values [PAYMENT_GATEWAY] on the enum `paymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "paymentType_new" AS ENUM ('PAYMENTGATEWAY', 'TRANSFER');
ALTER TABLE "Transactions" ALTER COLUMN "paymentType" TYPE "paymentType_new" USING ("paymentType"::text::"paymentType_new");
ALTER TYPE "paymentType" RENAME TO "paymentType_old";
ALTER TYPE "paymentType_new" RENAME TO "paymentType";
DROP TYPE "paymentType_old";
COMMIT;
