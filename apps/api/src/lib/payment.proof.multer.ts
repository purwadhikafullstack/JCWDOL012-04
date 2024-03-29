import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "public/images/payment-proofs");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  if (
    allowedExtensions.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext)
    )
  ) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        "Invalid file extension. Only .jpg .jpeg .png and .gif are allowed."
      )
    );
  }
};

export const uploadPaymentProof = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024,
  },
}).single("file");

