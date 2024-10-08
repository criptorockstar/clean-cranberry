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
import { UserEntity } from '../users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // SET ORDER
  @UseGuards(AuthenticationGuard)
  @Post()
  async setOrder(@CurrentUser() currentUser: UserEntity) {
    return this.ordersService.setOrder(currentUser.id);
  }

  // GET ORDER
  @UseGuards(AuthenticationGuard)
  @Get()
  async getOrder(@CurrentUser() currentUser: UserEntity) {
    return this.ordersService.getOrder(currentUser.id);
  }

  // GET ORDER BY ORDER NUMBER
  @Get('/order/:order')
  async getOrderByNumber(@Param('order') orderNumber: string) {
    return this.ordersService.getOrderByNumber(orderNumber);
  }

  // UPDATE ORDER
  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  async updateOrder(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.ordersService.updateOrder(id, updateStatusDto.status);
  }

  // GET PAGINATED ORDERS WITH SEARCH
  @Get('/paginated')
  async getPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('order') orderNumber?: string,
  ) {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;
    return this.ordersService.getPaginated(page, limit, orderNumber);
  }
}
