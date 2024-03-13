import { Users } from "@prisma/client";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { join } from "path";

interface DestinationCallback { (error: Error | null, destination: string): void }
interface FileNameCallback { (error: Error | null, filename: string): void }

export const uploader = (
    filePrefix: string,
    folderName?: string,
    type?: "profile-picture"
) => {
    const defaultDir = join(__dirname, "../../public")

    const storage = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: DestinationCallback
        ) => {
            const destination = folderName ? defaultDir + folderName : defaultDir
            cb(null, destination)
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) => {
            const user = req.user as Users
            const originalNameParts = file.originalname.split(".")
            const fileExtension = originalNameParts[originalNameParts.length - 1]
            const newFileName = type === "profile-picture"
                ? filePrefix + "-" + user.id + "-" + Date.now() + "." + fileExtension
                : filePrefix + Date.now() + "." + fileExtension
            cb(null, newFileName)
        }
    })

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (type === 'profile-picture') {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                cb(null, true)
            } else {
                cb(null, false)
            }
        }
    }

    return multer({ storage: storage, fileFilter: fileFilter })
}