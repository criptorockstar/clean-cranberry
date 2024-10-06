import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthorizeGuard } from 'src/common/guards/authorization.guard';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET ALL
  @Get()
  async getALL() {
    return this.categoriesService.getAll();
  }

  // GET CATEGORY BY SLUG
  @Get('/slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getBySlug(slug);
  }

  // GET PAGINATED CATEGORIES WITH SEARCH AND SORTING
  @Get('/paginated')
  async getPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
  ) {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;
    return this.categoriesService.getPaginated(page, limit, name);
  }

  // CREATE CATEGORY
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // UPDATE CATEGORY BY ID
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Put('/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  // DELETE CATEGORY BY ID
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Delete('/:id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
