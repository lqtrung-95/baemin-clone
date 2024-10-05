import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  item_id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDecimal()
  price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsDecimal()
  subtotal: number;

  @ApiProperty()
  @IsString()
  image_url: string;
}

export class OrderSummaryDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty()
  @IsDecimal()
  subtotal: number;

  @ApiProperty()
  @IsDecimal()
  delivery_fee: number;

  @ApiProperty()
  @IsDecimal()
  voucher_discount: number;

  @ApiProperty()
  @IsDecimal()
  total_amount: number;
}

export class DeliveryAddressDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  delivery_instructions?: string;
}

export class VoucherDto {
  @ApiProperty()
  @IsString()
  code: string;
}

export class DeliveryOptionDto {
  @ApiProperty()
  @IsString()
  option_id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class PaymentMethodDto {
  @ApiProperty()
  @IsNumber()
  payment_method_id: number;

  @ApiProperty()
  @IsString()
  name: string;
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsNumber()
  payment_method_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  delivery_instructions?: string;
}

export class OrderConfirmationDto {
  @ApiProperty()
  @IsNumber()
  order_id: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsDecimal()
  total_amount: number;

  @ApiProperty()
  @IsString()
  created_at: string;
}

export class DeliveryOptionsDto {
  @ApiProperty({ type: [DeliveryOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryOptionDto)
  options: DeliveryOptionDto[];
}

export class PaymentMethodsDto {
  @ApiProperty({ type: [PaymentMethodDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  methods: PaymentMethodDto[];
}
