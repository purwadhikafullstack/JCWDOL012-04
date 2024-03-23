-- CreateEnum
CREATE TYPE "CityType" AS ENUM ('KABUPATEN', 'KOTA');

-- AlterTable
ALTER TABLE "Cities" ADD COLUMN     "type" "CityType" NOT NULL DEFAULT 'KOTA';
