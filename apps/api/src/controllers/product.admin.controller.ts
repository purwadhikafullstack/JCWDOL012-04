import AdminProductService from '@/services/product.admin.service';
import ProductService from '@/services/product.service';
import multer from 'multer';
import { Request, Response } from 'express';
import { productsTotalStock } from '@/lib/productsTotalStock';

const productService = new ProductService();
const adminProductService = new AdminProductService();

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  productsWarehouses: productsWarehouse[];
}

interface productsWarehouse {
  stock: number;
  warehouse: {
    id: number;
  };
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'public/images/products');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  },
});
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  if (
    allowedExtensions.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext),
    )
  ) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        'Invalid file extension. Only .jpg .jpeg .png and .gif are allowed.',
      ),
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024,
  },
}).array('productImages', 5);

export class AdminProductController {
  async createProduct(req: Request, res: Response) {
    try {
      upload(req, res, async (err: any) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(400).json({ error: err.message });
        }
        const {
          name,
          description,
          price: rawPrice,
          productCategoryId: rawProductCategoryId,
          productsWarehouses,
        } = req.body;
        const existedProduct = await adminProductService.findProductName(name);
        if (existedProduct)
          return res
            .status(400)
            .json({ error: 'Product with the same name already exists.' });
        const price = parseFloat(rawPrice);
        const productCategoryId = parseFloat(rawProductCategoryId);
        const productImages = Array.isArray(req.files)
          ? req.files.map((file: Express.Multer.File) => ({
              path: `public/images/products/${file.filename}`,
            }))
          : [];
        const createdProduct = await AdminProductService.createProduct({
          name,
          description,
          price,
          productCategoryId,
          productImages,
          productsWarehouses,
        });
        res.status(201).json(createdProduct);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsAdmin(req: Request, res: Response) {
    try {
      const { page, pageSize, search, category, sort } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const products = (await adminProductService.getAllAdminProducts(
        parsedPageSize,
        skip,
        search as string,
        category as string,
        sort as string,
      )) as Product[];
      const totalProducts = await productService.getTotalProduct(
        search as string,
        category as string,
      );
      const productsWithTotalStock = productsTotalStock(products);
      const response = {
        products: productsWithTotalStock,
        totalProducts: totalProducts,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { productId: rawProductId } = req.params;
      const productId = parseInt(rawProductId);
      const {
        name,
        description,
        price: rawPrice,
        productCategoryId: rawProductCategoryId,
        productsWarehouses,
      } = req.body;

      const duplicateProduct = await adminProductService.findProductName(name);
      if (duplicateProduct) {
        return res
          .status(400)
          .json({ error: 'Product with the same name already exists.' });
      }

      const updatedProductImages = Array.isArray(req.files)
        ? req.files.map((file: Express.Multer.File) => ({
            path: `public/images/products/${file.filename}`,
          }))
        : [];

      const updatedProduct = await adminProductService.updateProduct(
        productId,
        {
          name,
          description,
          price: parseFloat(rawPrice),
          productCategoryId: parseFloat(rawProductCategoryId),
          productsWarehouses,
          productImages: updatedProductImages,
        },
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id: rawId } = req.params;
      const id = parseInt(rawId);
      const deletedProduct = await adminProductService.deleteProduct(id);
      return res.status(200).json(deletedProduct);
    } catch (error) {
      console.log(error);
    }
  }

  async createProductCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const existedProductCategory =
        await adminProductService.findProductCategoryName(name);
      if (existedProductCategory)
        return res
          .status(400)
          .json({ error: 'Product Category name already exist!' });
      const productCategory = await adminProductService.createProductCategory(
        name,
        description,
      );
      res.status(201).json(productCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductCategories(req: Request, res: Response) {
    try {
      const productCategories = await adminProductService.getProductCategory();
      return res.status(200).json(productCategories);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductCategory(req: Request, res: Response) {
    try {
      const { id: rawId } = req.params;
      const { name, description } = req.body;
      const id = parseInt(rawId);
      const existedProductCategory =
        await adminProductService.findProductCategoryName(name);
      if (existedProductCategory)
        return res
          .status(400)
          .json({ error: 'Product Category already exist' });
      const updatedProductCategory =
        await adminProductService.updateProductCategory(id, name, description);
      res.status(201).json(updatedProductCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductCategory(req: Request, res: Response) {
    try {
      const { id: rawId } = req.params;
      const id = parseInt(rawId);
      const deletedProductCategory =
        await adminProductService.deleteProductCategory(id);
      return res.status(200).json(deletedProductCategory);
    } catch (error) {
      console.log(error);
    }
  }
}
