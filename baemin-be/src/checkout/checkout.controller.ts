import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from '../users/decorators/user.decorator';
import { CheckoutService } from './checkout.service';
import {
  DeliveryAddressDto,
  DeliveryOptionDto,
  DeliveryOptionsDto,
  OrderConfirmationDto,
  OrderSummaryDto,
  PaymentMethodsDto,
  PlaceOrderDto,
  VoucherDto,
} from './dto/checkout.dto';

@ApiTags('checkout')
@Controller('checkout')
@Auth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('order-summary')
  @ApiOperation({ summary: 'Get order summary' })
  @ApiResponse({
    status: 200,
    description: 'Order summary retrieved successfully',
    type: OrderSummaryDto,
  })
  async getOrderSummary(@User() userId: number): Promise<OrderSummaryDto> {
    return this.checkoutService.getOrderSummary(userId);
  }

  @Post('delivery-address')
  @ApiOperation({ summary: 'Set or update delivery address' })
  @ApiResponse({
    status: 200,
    description: 'Delivery address updated successfully',
  })
  async setDeliveryAddress(
    @User() userId: number,
    @Body() addressDto: DeliveryAddressDto,
  ): Promise<void> {
    return this.checkoutService.setDeliveryAddress(userId, addressDto);
  }

  @Post('apply-voucher')
  @ApiOperation({ summary: 'Apply voucher to order' })
  @ApiResponse({
    status: 200,
    description: 'Voucher applied successfully',
    type: OrderSummaryDto,
  })
  async applyVoucher(
    @User() userId: number,
    @Body() voucherDto: VoucherDto,
  ): Promise<OrderSummaryDto> {
    return this.checkoutService.applyVoucher(userId, voucherDto.code);
  }

  @Post('remove-voucher')
  @ApiOperation({ summary: 'Remove applied voucher from order' })
  @ApiResponse({
    status: 200,
    description: 'Voucher removed successfully',
    type: OrderSummaryDto,
  })
  async removeVoucher(@User() userId: number): Promise<OrderSummaryDto> {
    return this.checkoutService.removeVoucher(userId);
  }

  @Get('delivery-options')
  @ApiOperation({ summary: 'Get available delivery options' })
  @ApiResponse({
    status: 200,
    description: 'Delivery options retrieved successfully',
    type: DeliveryOptionsDto,
  })
  async getDeliveryOptions(
    @User() userId: number,
  ): Promise<DeliveryOptionsDto> {
    return this.checkoutService.getDeliveryOptions(userId);
  }

  @Post('set-delivery-option')
  @ApiOperation({ summary: 'Set delivery option for order' })
  @ApiResponse({
    status: 200,
    description: 'Delivery option set successfully',
    type: OrderSummaryDto,
  })
  async setDeliveryOption(
    @User() userId: number,
    @Body() optionDto: DeliveryOptionDto,
  ): Promise<OrderSummaryDto> {
    return this.checkoutService.setDeliveryOption(userId, optionDto.option_id);
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
    type: PaymentMethodsDto,
  })
  async getPaymentMethods(): Promise<PaymentMethodsDto> {
    return this.checkoutService.getPaymentMethods();
  }

  @Post('place-order')
  @ApiOperation({ summary: 'Place the order' })
  @ApiResponse({
    status: 201,
    description: 'Order placed successfully',
    type: OrderConfirmationDto,
  })
  async placeOrder(
    @User() userId: number,
    @Body() orderDto: PlaceOrderDto,
  ): Promise<OrderConfirmationDto> {
    return this.checkoutService.placeOrder(userId, orderDto);
  }
}
