'use client';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Status from './status';
import DetailsCheckout from '../../checkout/detailsCheckout';
import { useParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';

const Page: React.FC = () => {
  const params = useParams();
  const orderId =
    typeof params.id === 'string' ? parseInt(params.id, 10) : null;
  const { orderDetails, updateOrderStatus } = useOrder(orderId || 0);

  const [status, setStatus] = useState([
    {
      id: '1',
      number: 1,
      name: 'Nhà hàng nhận đơn',
      value: 'PENDING',
      st: false,
    },
    {
      id: '2',
      number: 2,
      name: 'Nhà hàng xác nhận',
      value: 'CONFIRMED',
      st: false,
    },
    {
      id: '3',
      number: 3,
      name: 'Đang chuẩn bị',
      value: 'PREPARING',
      st: false,
    },
    {
      id: '4',
      number: 4,
      name: 'Đang giao hàng',
      value: 'OUT_FOR_DELIVERY',
      st: false,
    },
    { id: '5', number: 5, name: 'Đã giao hàng', value: 'DELIVERED', st: false },
  ]);

  useEffect(() => {
    if (orderDetails.data) {
      const currentStatus = orderDetails.data.status;
      const updatedStatus = status.map((item) => ({
        ...item,
        st: item.value === currentStatus,
      }));
      setStatus(updatedStatus);
    }
  }, [orderDetails.data]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (orderId) {
      try {
        await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }
  };

  const handleOrderDelivered = async () => {
    await handleStatusUpdate('DELIVERED');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const calculateEstimatedDeliveryTime = (dateString: string): string => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + 20);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (orderDetails.isLoading) {
    return <div>Loading...</div>;
  }

  if (orderDetails.isError) {
    return <div>Error loading order details</div>;
  }

  const order = orderDetails.data;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row w-full h-20 bg-white">
        <div className="w-full h-full flex flex-row items-center gap-3">
          <div className="ml-10 text-4xl text-beamin font-bold">
            <ShoppingCartOutlined />
          </div>
          <div className="text-2xl text-beamin">|</div>
          <div className="text-3xl text-beamin font-bold">
            Trình trạng đơn hàng
          </div>
        </div>
      </div>
      <div className="flex-grow grid grid-cols-12 gap-4 p-4">
        <div className="col-span-3">
          <div className="bg-white rounded-md p-4 flex flex-col">
            <div className="font-semibold mb-4"> Trình Trạng </div>
            <Status items={status} onStatusChange={handleStatusUpdate} />
            <div className="mt-6">
              <button
                onClick={handleOrderDelivered}
                className="w-full bg-beamin text-white font-bold py-3 px-4 rounded-md hover:bg-beamin-dark transition duration-300"
                disabled={order?.status === 'DELIVERED'}
              >
                Đã nhận món thành công
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-9 flex flex-col gap-4">
          <div className="w-full h-[400px] rounded-md overflow-hidden">
            <div className="w-full h-full relative">
              <Image
                layout="fill"
                objectFit="cover"
                src={'/images/baemin-1.jpg'}
                alt=""
              ></Image>
            </div>
          </div>
          <div className="bg-white rounded-md p-4 flex flex-col">
            <div className="w-full flex flex-row">
              <div className="w-1/3 flex flex-col gap-2">
                <div className="font-semibold">{order?.restaurantName}</div>
                <div className="text-gray-600 text-sm">
                  {order?.totalAmount}đ - {order?.items.length} món -{' '}
                  {order?.paymentMethod}
                </div>
                <div className="text-gray-600 text-sm">
                  {order?.customerName} - {order?.customerPhone}
                </div>
              </div>
              <div className="w-1/3 flex flex-col gap-2">
                <div className="font-semibold">Giao hàng đến</div>
                <div className="text-gray-600 text-sm">
                  {order?.deliveryAddress}
                </div>
                <div className="text-gray-600 text-sm">
                  Thời gian đặt hàng:{' '}
                  {order?.createdAt ? formatDate(order.createdAt) : 'N/A'}
                </div>
                <div className="text-gray-600 text-sm">
                  Thời gian giao hàng dự kiến:{' '}
                  {order?.createdAt
                    ? calculateEstimatedDeliveryTime(order.createdAt)
                    : 'N/A'}
                </div>
              </div>
              <div className="w-1/3 flex flex-col  gap-2 pl-5">
                <div className="font-medium flex flex-row justify-between ">
                  <span> Tổng tiền:</span>
                  <span className="text-beamin">{order?.totalAmount}d</span>
                </div>
                <div className="text-sm flex flex-row justify-between border-t">
                  <span> phí giao hàng (3 km):</span>
                  <span className="text-beamin">38.000d</span>
                </div>
                {/* <div className="text-sm flex flex-row justify-between ">
                  <span> phí dịch vụ:</span>
                  <span className="text-beamin">16.000d</span>
                </div>
                <div className="text-sm flex flex-row justify-between ">
                  <span> Giảm giá:</span>
                  <span className="text-beamin">16.000d</span>
                </div> */}
                <div className="text-beamin w-full flex flex-row items-end justify-end text-xl font-medium pr-3 pt-3">
                  <span>{order?.totalAmount}d</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-4 pt-4 border-t">
              <DetailsCheckout items={order?.items || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
