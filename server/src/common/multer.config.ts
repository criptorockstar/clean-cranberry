import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions = {
  storage: diskStorage({
    destination: (_, __, cb) => {
      const uploadDir = './public';

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
      const name = file.originalname
        .split('.')[0]
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'N')
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '');
      const extension = extname(file.originalname);
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${name}-${randomName}${extension}`);
    },
  }),
  fileFilter: (_: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      const error = new Error('image: * Formato no admitido') as any;
      error.status = 400;
      cb(error, false);
    }
  },
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2MB
  },
};

export default multerOptions;
