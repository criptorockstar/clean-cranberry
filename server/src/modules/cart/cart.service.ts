import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AddCartDto } from './dto/add-cart.dto';
import { Size } from '../products/entities/size.entity';
import { Color } from '../products/entities/color.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  // INCREASE ITEM QUANTITY
  async increaseItemQuantity(userId: number, itemId: number) {
    const cart = await this.findCartByUserId(userId);
    const item = cart.items.find((i) => i.id === Number(itemId));
    if (item) {
      item.quantity += 1;
      await this.cartRepository.save(cart);
      return item;
    }
    throw new NotFoundException('Item no encontrado en el carrito');
  }

  // DECRESE ITEM QUANTITY
  async decreaseItemQuantity(userId: number, itemId: number) {
    const cart = await this.findCartByUserId(userId);
    const item = cart.items.find((i) => i.id === Number(itemId));

    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        await this.cartRepository.save(cart);
        return item;
      } else {
        throw new BadRequestException('La cantidad no puede ser menor a 1');
      }
    }
    throw new NotFoundException('Item no encontrado en el carrito');
  }

  // UPDATE ITEM QUANTITY
  async updateItemQuantity(
    userId: number,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cart = await this.findCartByUserId(userId);
    const item = cart.items.find((i) => i.id === Number(itemId));

    if (item) {
      // Actualiza la cantidad
      item.quantity = updateCartItemDto.quantity;
      await this.cartRepository.save(cart);
      return item;
    }
    throw new NotFoundException('Item no encontrado en el carrito');
  }

  // FIND CART BY USER ID
  private async findCartByUserId(userId: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: Number(userId) } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }
    return cart;
  }

  // DELETE ITEM FROM CART
  async removeItemFromCart(userId: number, itemId: number): Promise<void> {
    const cart = await this.findCartByUserId(userId);
    const itemIndex = cart.items.findIndex((i) => i.id === Number(itemId));

    if (itemIndex === -1) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    // Remover el item del carrito
    const item = cart.items[itemIndex];
    await this.cartItemRepository.remove(item);

    // Actualizar el carrito
    cart.items.splice(itemIndex, 1);
    await this.cartRepository.save(cart);
  }

  // GET CART
  async getCart(
    userId: number,
  ): Promise<{ items: CartItemEntity[]; total: number }> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('El carrito está vacío');
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const shippingCost = 2500; // Costo de envío

    return {
      items: cart.items, // La estructura de `items` se mantiene
      total: total + shippingCost, // Sumar el costo de envío al total
    };
  }

  // GET ITEM COUNT
  async getCartItemCount(userId: number): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (!cart || cart.items.length === 0) {
      return 0;
    }

    const totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return totalQuantity;
  }

  // ADD CART ITEMS
  async addCartItems(
    userId: number,
    addCartDto: AddCartDto,
  ): Promise<CartEntity> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, items: [] });
      await this.cartRepository.save(cart);
    }

    // Buscar si el producto con las mismas características (id, color, size) ya está en el carrito
    const existingItem = cart.items.find(
      (item) =>
        item.product.id === addCartDto.product &&
        item.size === addCartDto.size &&
        item.color === addCartDto.color,
    );

    if (existingItem) {
      // Si ya existe, actualiza la cantidad
      existingItem.quantity += addCartDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Si no existe, crea un nuevo item
      const newItem = this.cartItemRepository.create({
        product: { id: addCartDto.product },
        quantity: addCartDto.quantity,
        size: addCartDto.size,
        color: addCartDto.color,
        cart,
      });
      await this.cartItemRepository.save(newItem);
      cart.items.push(newItem);
    }

    return this.cartRepository.save(cart);
  }
}
