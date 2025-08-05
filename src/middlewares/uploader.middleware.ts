import multer from "multer";

export class UploaderMiddleware {
  upload = (fileSize: number = 5) => {
    const storage = multer.memoryStorage();

    const limits = { fileSize: fileSize * 1024 * 1024 }; // 5mb

    return multer({ storage, limits });
  };
}
