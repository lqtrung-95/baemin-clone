import React from 'react';
import { Modal, Input, Button } from 'antd';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: string) => void;
  currentAddress: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
  onConfirm,
  currentAddress,
}) => {
  const [newAddress, setNewAddress] = React.useState(currentAddress);

  const handleConfirm = () => {
    onConfirm(newAddress);
    onClose();
  };

  return (
    <Modal
      title="Cập nhật địa chỉ giao hàng"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleConfirm}>
          Xác nhận
        </Button>,
      ]}
    >
      <Input.TextArea
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
        placeholder="Nhập địa chỉ mới"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Modal>
  );
};

export { AddressModal };
