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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { UserEntity } from '../users/entities/user.entity';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // INCREASE ITEM QUANTITY
  @UseGuards(AuthenticationGuard)
  @Put('/increase/:id')
  async increaseItemQuantity(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') id: number,
  ) {
    return this.cartService.increaseItemQuantity(currentUser.id, id);
  }

  // DECREASE ITEM QUANTITY
  @UseGuards(AuthenticationGuard)
  @Put('/decrease/:id')
  async decreaseItemQuantity(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.cartService.decreaseItemQuantity(currentUser.id, id);
  }

  // UPDATE QUANTITY
  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  async updateItemQuantity(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(
      currentUser.id,
      id,
      updateCartItemDto,
    );
  }

  // DELETE ITEM FROM CART
  @UseGuards(AuthenticationGuard)
  @Delete('/remove/:id')
  async removeItemFromCart(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity,
  ) {
    await this.cartService.removeItemFromCart(currentUser.id, id);
    return { message: 'Item eliminado del carrito' };
  }

  // GET CART
  @UseGuards(AuthenticationGuard)
  @Get()
  async getCart(@CurrentUser() currentUser: UserEntity) {
    return this.cartService.getCart(currentUser.id);
  }

  // GET CART ITEM COUNT
  @UseGuards(AuthenticationGuard)
  @Get('/count')
  async getCartItemCount(@CurrentUser() currentUser: UserEntity) {
    const itemCount = await this.cartService.getCartItemCount(currentUser.id);

    return itemCount;
  }

  // ADD CART ITEMS
  @UseGuards(AuthenticationGuard)
  @Post('/add')
  async addCartItems(
    @CurrentUser() currentUser: UserEntity,
    @Body() addCartDto: AddCartDto,
  ) {
    return this.cartService.addCartItems(currentUser.id, addCartDto);
  }
}
