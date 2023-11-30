import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { extname } from 'path';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      cb(null, uniqueSuffix + fileExtension); // Save with random name and original extension
    },
  }),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

export function multerMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.single('file')(req, res, function (error: any) {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  });
}
