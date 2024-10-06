'use client';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import { Input, message } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      message.success('Đăng nhập thành công');
      router.push('/dashboard'); // Redirect to dashboard or home page after login
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };
  return (
    <>
      <div className="mt-14 w-1/3  bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
        <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
          Đăng Nhập
        </div>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col w-full gap-3">
            <Input
              placeholder="Email/Số điện thoại/Tên đăng nhập"
              className="h-[40px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full mt-3">
            <Input.Password
              placeholder="Mật khẩu"
              className="h-[40px]"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full mt-3">
            <button
              type="submit"
              className="w-full h-[40px] uppercase text-white bg-beamin rounded-lg"
              disabled={login.isPending}
            >
              {login.isPending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
            <div className="flex flex-row justify-between items-center w-full text-sm text-beamin">
              <span className="cursor-pointer">Quên mật khẩu</span>
              <span className="cursor-pointer">Đăng nhập bằng SMS</span>
            </div>
          </div>
        </form>
        {/* Rest of your component remains the same */}
        <div className="flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-600">HOẶC</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex flex-row items-center justify-center gap-5 h-[40px] ">
          <button className="flex items-center justify-center gap-3 border w-full h-full p-1 text-beamin text-base">
            <FacebookOutlined />
            <span>Facebook</span>
          </button>
          <button className="flex items-center justify-center gap-3 border w-full h-full p-1 text-beamin text-base">
            <GoogleOutlined />
            <span>Google</span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600">Bạn mới biết đến Baemin?</span>
          <Link className="text-beamin cursor-pointer" href={'/register'}>
            {' '}
            Đăng kí
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
