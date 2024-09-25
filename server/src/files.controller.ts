import {
  Controller,
  Post,
  Get,
  Param,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/common/multer.config';
import { join } from 'path';

// @ts-ignore
const sharp = require('sharp');
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  // UPLOAD IMAGE
  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('* Debe agregar un archivo');
      }

      const outputPath = join(
        process.cwd(),
        'public',
        `resized-${file.filename}`,
      );

      await sharp(file.path).resize(300, 300).toFile(outputPath);

      const fileUrl = `${process.env.API_URL}/files/resized-${file.filename}`;
      return { url: fileUrl };
    } catch (error: any) {
      console.log('s', error);
      return { error: error.message };
    }
  }

  // READ IMAGE
  @Get('/:fileName')
  getFile(@Param('fileName') fileName: string, @Response() res: any) {
    const filePath = join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    return res.sendFile(filePath);
  }
}
