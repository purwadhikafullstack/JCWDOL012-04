import { Request, Response } from 'express';
import { prisma } from '@/services/prisma.service';
import ProductStockService from '@/services/products/product.stock.service';
import distance from '@/lib/distance';

const productStockService = new ProductStockService();

export class ProductStockController {
  async createHistory(req: Request, res: Response) {
    try {
      const warehouseId = parseInt(req.params.id);
      const { productId, quantity, isAdd, mutationType } = req.body;
      const mutation = await productStockService.createHistory(
        productId,
        warehouseId,
        isAdd,
        quantity,
        mutationType,
      );
      const productWarehouse = await productStockService.findProductWarehouse(
        productId,
        warehouseId,
      );
      const stock = isAdd
        ? productWarehouse?.stock + quantity
        : productWarehouse?.stock! - quantity;
      await productStockService.updateStock(productWarehouse?.id!, stock);
      return res.status(201).json(mutation);
    } catch (error) {
      console.log(error);
    }
  }
  async createMutationRequest(req: Request, res: Response) {
    try {
      const { warehouseId, productId, destinationWarehouseId, quantity } =
        req.body;
      const mutationRequest = await productStockService.createMutationRequest(
        parseInt(productId),
        parseInt(warehouseId),
        parseInt(destinationWarehouseId),
        parseInt(quantity),
      );
      res.status(201).json(mutationRequest);
    } catch (error) {
      console.log(error);
    }
  }
  async processMutationRequest(req: Request, res: Response) {
    try {
      await prisma.$transaction(async (tx) => {
        const {
          mutationId,
          productId,
          warehouseId,
          destinationWarehouseId,
          isAccepted,
          quantity,
        } = req.body;
        const processedMutation =
          await productStockService.processMutationRequest(
            mutationId,
            isAccepted,
          );
        if (processedMutation.isAccepted) {
          const sourceWarehouse =
            await productStockService.findProductWarehouse(
              productId,
              warehouseId,
            );
          const destinationWarehouse =
            await productStockService.findProductWarehouse(
              productId,
              destinationWarehouseId,
            );
          const sourceStock = sourceWarehouse?.stock + quantity;
          const destinationStock = destinationWarehouse?.stock! - quantity;
          await productStockService.updateStock(
            sourceWarehouse?.id!,
            sourceStock,
          );
          await productStockService.updateStock(
            destinationWarehouse?.id!,
            destinationStock,
          );
          const response = {
            sourceWarehouse: sourceWarehouse,
            destinationWarehouse: destinationWarehouse,
          };
          return res.status(201).json(response);
        } else {
          return res.status(200).json({ message: 'mutation request declined' });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async automatedMutation(
    warehouseId: number,
    productId: number,
    transactionId: number,
    rawQuantity: number,
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        const warehouseStock = await productStockService.findProductWarehouse(
          productId,
          warehouseId,
        );
        let quantity = rawQuantity - warehouseStock?.stock!;
        const excludedId = [warehouseId];
        console.log(excludedId);
        do {
          const warehouses =
            await productStockService.getWarehousesExclude(excludedId);
          const selectedWarehouse =
            await productStockService.getProductWarehouse(warehouseId);
          let shortestDist = Infinity;
          let shortestWarehouseId = 0;
          warehouses.forEach((warehouse) => {
            const dist = distance(
              selectedWarehouse?.latitude!,
              selectedWarehouse?.longitude!,
              warehouse.latitude,
              warehouse.longitude,
            );
            dist < shortestDist
              ? (shortestDist = dist) && (shortestWarehouseId = warehouse.id)
              : '';
          });
          const sourceWarehouse =
            await productStockService.findProductWarehouse(
              productId,
              warehouseId,
            );
          const destinationWarehouse =
            await productStockService.findProductWarehouse(
              productId,
              shortestWarehouseId,
            );
          const automatedMutation = destinationWarehouse?.stock
            ? await productStockService.automatedMutationRequest(
                productId,
                warehouseId,
                shortestWarehouseId,
                transactionId,
                destinationWarehouse?.stock! >= quantity
                  ? quantity
                  : destinationWarehouse?.stock!,
              )
            : '';
          if (destinationWarehouse?.stock! >= quantity) {
            const destinationStock = destinationWarehouse?.stock! - quantity;
            const sourceStock = sourceWarehouse?.stock! + quantity;
            quantity = 0;
            await productStockService.updateStock(
              sourceWarehouse?.id!,
              sourceStock,
            );
            await productStockService.updateStock(
              destinationWarehouse?.id!,
              destinationStock,
            );
            return automatedMutation;
          } else {
            const sourceStock =
              sourceWarehouse?.stock! + destinationWarehouse?.stock!;
            quantity = quantity - destinationWarehouse?.stock!;
            await productStockService.updateStock(
              sourceWarehouse?.id!,
              sourceStock,
            );
            await productStockService.updateStock(destinationWarehouse?.id!, 0);
            excludedId.push(shortestWarehouseId);
          }
        } while (quantity);
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getMutationRequest(req: Request, res: Response) {
    try {
      const warehouseId = parseInt(req.params.id);
      const mutations =
        await productStockService.getMutationRequest(warehouseId);
      return res.status(200).json(mutations);
    } catch (error) {
      console.log(error);
    }
  }
  async getIncomingMutationRequest(req: Request, res: Response) {
    try {
      const destinationWarehouseId = parseInt(req.params.id);
      const mutations = await productStockService.getIncomingMutationRequest(
        destinationWarehouseId,
      );
      return res.status(200).json(mutations);
    } catch (error) {
      console.log(error);
    }
  }
  async getProductsWarehouses(req: Request, res: Response) {
    try {
      const warehouseId = parseInt(req.params.id);
      const excludedId = [warehouseId];
      const products = await productStockService.getProducts();
      const warehouses =
        await productStockService.getWarehousesExclude(excludedId);
      const response = {
        products,
        warehouses,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }
}
