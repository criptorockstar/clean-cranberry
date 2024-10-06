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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET COLORS
  @Get('/colors')
  async getColors() {
    return this.productsService.getColors();
  }

  // GET SIZES
  @Get('/sizes')
  async getSizes() {
    return this.productsService.getSizes();
  }

  // GET PRODUCT BY SLUG
  @Get('/slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productsService.getBySlug(slug);
  }

  // GET PAGINATED PRODUCTS WITH SEARCH
  @Get('/paginated')
  async getPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
  ) {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;
    return this.productsService.getPaginated(page, limit, name);
  }

  // GET MAX PRICE
  @Get('/max-price')
  async getMaxPrice() {
    return this.productsService.getMaxPrice();
  }

  // GET RELATED PRODUCTS
  @Get('/related')
  async getRelated(@Query('categories') categories?: string) {
    return this.productsService.getRelated(categories);
  }

  // GET FEATURED PRODUCTS
  @Get('/featured')
  async getFeatured() {
    return this.productsService.getFeatured();
  }

  // GET PAGINATED PRODUCTS WITH FILTERS
  @Get('/filtered')
  async getFiltered(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sizes') sizes?: string,
    @Query('colors') colors?: string,
    @Query('categories') categories?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;

    return this.productsService.getFiltered(
      page,
      limit,
      sizes,
      colors,
      categories,
      minPrice,
      maxPrice,
    );
  }

  // UPDATE PRODUCT BY ID
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Put('/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  // CREATE PRODUCT
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  // DELETE PRODUCT BY ID
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Delete('/:id')
  async deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
