import {
  Controller,
  Post,
  Get,
  Param,
  Response,
  UploadedFile,
  UseInterceptors,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthorizeGuard } from 'src/common/guards/authorization.guard';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/common/multer.config';
import { join } from 'path';

const sharp = require('sharp');
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  // UPLOAD IMAGE
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
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

  // UPLOAD CATEGORY IMAGE
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Post('/upload-category')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadCategory(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('* Debe agregar un archivo');
      }

      const outputPath = join(
        process.cwd(),
        'public',
        `resized-${file.filename}`,
      );

      await sharp(file.path).resize(1066, 1600).toFile(outputPath);

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

  // DELETE IMAGE
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Delete('/delete/:fileName')
  async deleteFile(@Param('fileName') fileName: string, @Response() res: any) {
    const filePath = join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res
          .status(400)
          .send('image: Se produjo un error al borrar la imagen');
      }
      return res.send({ message: 'File deleted successfully' });
    });
  }
}
