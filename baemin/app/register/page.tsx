'use client';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignup } from '@/hooks/useAuth'; // Adjust the import path as needed

const Page: React.FC = () => {
  const router = useRouter();
  const signup = useSignup();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    const signupData = {
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number,
      address: formData.address,
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    try {
      await signup.mutateAsync(signupData);
      message.success('Signup successful!');
      router.push('/login');
    } catch (error) {
      message.error('Signup failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="mt-28 w-1/3 bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
        <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
          Đăng Kí
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row w-full gap-2">
            <Input
              placeholder="Họ"
              className="h-[40px]"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <Input
              placeholder="Tên"
              className="h-[40px]"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full gap-3 mt-3">
            <Input
              placeholder="Số điện thoại"
              className="h-[40px]"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full gap-3 mt-3">
            <Input
              placeholder="Email"
              className="h-[40px]"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full gap-3 mt-3">
            <Input
              placeholder="Địa chỉ"
              className="h-[40px]"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mt-3">
            <Input.Password
              placeholder="Mật khẩu"
              className="h-[40px]"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mt-3">
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              className="h-[40px]"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mt-3">
            <button
              type="submit"
              className="w-full h-[40px] uppercase text-white bg-beamin rounded-lg"
              disabled={signup.isLoading}
            >
              {signup.isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600">Bạn đã có tài khoản?</span>
          <Link className="text-beamin cursor-pointer" href={'/login'}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
