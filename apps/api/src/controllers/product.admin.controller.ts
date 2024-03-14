import AdminProductService from '@/services/product.admin.service';
import ProductService from '@/services/product.service';
import multer from 'multer';
import { Request, Response } from 'express';
import { productsTotalStock } from '@/lib/productsTotalStock';
import { ProductsWarehouses } from '@prisma/client';

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
}).array('productImages', 4);

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
        } = req.body;
        const productsWarehouses = req.body.productsWarehouses
          ? JSON.parse(req.body.productsWarehouses)
          : [];
        const existedProduct = await adminProductService.findProductName(name);
        if (existedProduct) {
          return res
            .status(400)
            .json({ error: 'Product with the same name already exists.' });
        }

        const productImages = Array.isArray(req.files)
          ? req.files.map((file: Express.Multer.File) => ({
              path: `http://localhost:8000/public/images/products/${file.filename}`,
            }))
          : [];

        const createdProduct = await AdminProductService.createProduct({
          name,
          description,
          price: parseFloat(rawPrice),
          productCategoryId: parseFloat(rawProductCategoryId),
          productImages,
          productsWarehouses,
        });
        res.status(201).json(createdProduct);
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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

  async getAdminProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await adminProductService.getAdminProduct(id);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      upload(req, res, async (err: any) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(400).json({ error: err.message });
        }

        const id = parseInt(req.params.id);
        const {
          name,
          description,
          price: rawPrice,
          productCategoryId: rawProductCategoryId,
        } = req.body;

        console.log('req.body ->', req.body);
        const currentProduct = await adminProductService.getAdminProduct(id);
        console.log('curr product name =>', currentProduct?.name);
        console.log('product name =>', name);
        if (name !== currentProduct?.name) {
          const duplicateProduct =
            await adminProductService.findProductName(name);
          if (duplicateProduct) {
            return res
              .status(400)
              .json({ error: 'Product with the same name already exists.' });
          }
        }

        const updatedProductImages = Array.isArray(req.files)
          ? req.files.map((file: Express.Multer.File) => ({
              path: `http://localhost:8000/public/images/products/${file.filename}`,
            }))
          : [];

        const updatedProduct = await adminProductService.updateProduct({
          id,
          name,
          description,
          price: parseFloat(rawPrice),
          productCategoryId: parseFloat(rawProductCategoryId),
          productImages: updatedProductImages,
        });

        res.status(200).json(updatedProduct);
      });
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
      const productCategories =
        await adminProductService.getProductCategories();
      return res.status(200).json(productCategories);
    } catch (error) {
      console.log(error);
    }
  }

  async getFullProductCategories(req: Request, res: Response) {
    try {
      const { page, pageSize, sort } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const productCategories =
        await adminProductService.getFullProductCategories(
          parsedPageSize,
          skip,
          sort as string,
        );
      const totalProductCategories =
        await adminProductService.getTotalProductCategories();
      const response = {
        productCategories,
        totalProductCategories,
      };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductCategory(req: Request, res: Response) {
    try {
      const proCatId = parseInt(req.params.id);
      const productCategory =
        await adminProductService.getProductCategory(proCatId);
      res.status(200).json(productCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, description } = req.body;
      const currentProductCategory =
        await adminProductService.getProductCategory(id);
      if (name !== currentProductCategory?.name) {
        const duplicateProduct =
          await adminProductService.findProductCategoryName(name);
        if (duplicateProduct) {
          return res
            .status(400)
            .json({ error: 'Product with the same name already exists.' });
        }
      }
      const updatedProductCategory =
        await adminProductService.updateProductCategory(id, name, description);
      res.status(201).json(updatedProductCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deletedProductCategory =
        await adminProductService.deleteProductCategory(id);
      return res.status(200).json(deletedProductCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductWarehouse(req: Request, res: Response) {
    try {
      const productWarehouses = await adminProductService.getProductWarehouse();
      return res.status(200).json(productWarehouses);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductImage(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deletedProductImage =
        await adminProductService.deleteProductImages(id);
      return res.status(200).json(deletedProductImage);
    } catch (error) {
      console.log(error);
    }
  }
}
