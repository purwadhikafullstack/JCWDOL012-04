/*
  Warnings:

  - The values [SENT] on the enum `orderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "orderStatus_new" AS ENUM ('PENDING_PROOF', 'PENDING_VERIFICATION', 'VERIFIED', 'FAILED_PAYMENT', 'CANCELLED', 'PROCESSING', 'SHIPPING', 'CONFIRMED');
ALTER TABLE "Transactions" ALTER COLUMN "orderStatus" DROP DEFAULT;
ALTER TABLE "Transactions" ALTER COLUMN "orderStatus" TYPE "orderStatus_new" USING ("orderStatus"::text::"orderStatus_new");
ALTER TYPE "orderStatus" RENAME TO "orderStatus_old";
ALTER TYPE "orderStatus_new" RENAME TO "orderStatus";
DROP TYPE "orderStatus_old";
ALTER TABLE "Transactions" ALTER COLUMN "orderStatus" SET DEFAULT 'PENDING_PROOF';
COMMIT;
