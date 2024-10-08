import { In, Not } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/image.entity';
import { Size } from '../products/entities/size.entity';
import { Color } from '../products/entities/color.entity';
import { OrderEntity } from './entities/order.entity';
import { ShippingEntity } from '../users/entities/shipping.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartItemEntity } from '../cart/entities/cart-item.entity';
import { UserEntity } from '../users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Quantities } from 'src/common/enums';
import { OrderStatus } from 'src/common/enums';
import { OrderItemsEntity } from './entities/order-items.entity'; // Asegúrate de importar la entidad

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ShippingEntity)
    private readonly shippingRepository: Repository<ShippingEntity>,
    private readonly mailerService: MailerService,
  ) {}

  // GET ORDER BY ORDER NUMBER
  async getOrderByNumber(orderNumber: string): Promise<OrderEntity> {
    const shippingCost = 2500;

    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: [
        'items',
        'items.product',
        'items.product.images',
        'user',
        'shippingAddress',
      ],
    });

    if (!order) {
      throw new NotFoundException(
        `No se encontró una orden con el número: ${orderNumber}`,
      );
    }

    // Sumar el costo de envío al total de la orden
    order.total += shippingCost;

    return order;
  }

  async setOrder(userId: number): Promise<OrderEntity> {
    // Obtener el carrito del usuario
    const cart = await this.findCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('El carrito está vacío');
    }

    // Calcular el total de la orden
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Verificar si el usuario tiene una dirección de envío
    const shippingAddress = await this.shippingRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Dirección de envío no encontrada');
    }

    // Crear el número único de orden
    const orderNumber = `ORD-${Date.now()}-${userId}`;

    // Crear la nueva orden
    const order = this.orderRepository.create({
      orderNumber,
      total,
      user: { id: userId },
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    // Crear los ítems de la orden a partir de los ítems del carrito
    const orderItems = cart.items.map((cartItem) => {
      const orderItem = new OrderItemsEntity();
      orderItem.product = cartItem.product;
      orderItem.quantity = cartItem.quantity;
      orderItem.price = cartItem.product.price;
      return orderItem;
    });

    // Asignar los ítems a la orden
    order.items = orderItems;

    // Guardar la orden en la base de datos
    const savedOrder = await this.orderRepository.save(order);

    // Limpiar el carrito del usuario
    await this.cartRepository.remove(cart);

    // (Opcional) Enviar un correo de confirmación de la orden
    /*try {
    await this.mailerService.sendMail({
      to: cart.user.email,
      subject: `Confirmación de pedido #${savedOrder.orderNumber}`,
      template: './order-confirmation', // Suponiendo que tienes una plantilla
      context: {
        orderNumber: savedOrder.orderNumber,
        total: savedOrder.total,
        userName: cart.user.name,
      },
    });
  } catch (error) {
    console.error('Error al enviar el correo de confirmación', error);
  }*/

    return savedOrder;
  }

  // GET ORDER
  async getOrder(userId: number): Promise<OrderEntity> {
    // Buscar la última orden pendiente del usuario
    const order = await this.orderRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDING, // Solo órdenes con estatus pendiente
      },
      order: { createdAt: 'DESC' }, // Ordenar por fecha de creación descendente para obtener la más reciente
      relations: [
        'items',
        'items.product',
        'items.product.images',
        'shippingAddress',
      ], // Asegurarse de traer las relaciones necesarias
    });

    // Si no hay una orden pendiente, lanzar excepción
    if (!order) {
      throw new NotFoundException('No se encontró una orden pendiente');
    }

    return order;
  }

  // Método auxiliar para obtener el carrito por userId
  private async findCartByUserId(userId: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: Number(userId) } },
      relations: ['items', 'items.product', 'items.product.images'],
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }
    return cart;
  }

  // UPDATE ORDER
  async updateOrder(id: number, status: OrderStatus): Promise<OrderEntity> {
    // Buscar la orden por ID
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'shippingAddress'], // Relacionar entidades necesarias
    });

    // Si no se encuentra la orden, lanzar excepción
    if (!order) {
      throw new NotFoundException(`No se encontró la orden con ID: ${id}`);
    }

    // Actualizar el estado de la orden
    order.status = status;

    // Guardar los cambios en la base de datos
    const updatedOrder = await this.orderRepository.save(order);

    // (Opcional) Enviar notificación de actualización de estado
    /*try {
    await this.mailerService.sendMail({
      to: order.user.email,
      subject: `Actualización del estado de tu pedido #${order.orderNumber}`,
      template: './order-status-update',
      context: {
        orderNumber: order.orderNumber,
        newStatus: order.status,
        userName: order.user.name,
      },
    });
  } catch (error) {
    console.error('Error al enviar la notificación de actualización de estado', error);
  }*/

    return updatedOrder;
  }

  // GET PAGINATED ORDERS WITH SEARCH
  async getPaginated(page: number, limit: number, orderNumber?: string) {
    const shippingCost = 2500;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.shippingAddress', 'shippingAddress')
      .orderBy('order.createdAt', 'DESC') // Ordenar por fecha de creación descendente
      .skip((page - 1) * limit) // Saltar elementos para la paginación
      .take(limit); // Limitar la cantidad de elementos

    if (orderNumber) {
      query.andWhere('order.orderNumber = :orderNumber', { orderNumber });
    }

    const [orders, total] = await query.getManyAndCount();

    // Añadir el costo de envío al total de cada orden
    const updatedOrders = orders.map((order) => {
      return {
        ...order,
        total: order.total + shippingCost, // Sumar el costo de envío
      };
    });

    return {
      orders: updatedOrders,
      total,
      page,
      limit,
    };
  }
}
