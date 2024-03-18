import { Request } from 'express';
import multer from 'multer';

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

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024,
  },
}).array('productImages', 4);
