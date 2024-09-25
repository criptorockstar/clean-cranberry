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
  Headers,
} from '@nestjs/common';
import { AuthorizeGuard } from 'src/common/guards/authorization.guard';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET PAGINATED CATEGORIES
  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;
    return this.categoriesService.getAll(page, limit);
  }

  // SEARCH CATEGORY BY NAME
  @Get('/search')
  async searchCategory(@Query('name') name: string) {
    return this.categoriesService.searchCategory(name);
  }

  // CREATE CATEGORY
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
}
