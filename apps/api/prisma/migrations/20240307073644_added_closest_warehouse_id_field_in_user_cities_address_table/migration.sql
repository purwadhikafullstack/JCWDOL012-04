-- AlterTable
ALTER TABLE "UserCities" ADD COLUMN     "closestWarehouseId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserCities" ADD CONSTRAINT "UserCities_closestWarehouseId_fkey" FOREIGN KEY ("closestWarehouseId") REFERENCES "Warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
