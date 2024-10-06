import React from 'react';
import { Modal, List, Button } from 'antd';

interface Voucher {
  code: string;
  description: string;
  discount: number;
}

interface VoucherModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (voucherCode: string) => void;
  vouchers: Voucher[];
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  visible,
  onClose,
  onConfirm,
  vouchers,
}) => {
  const [selectedVoucher, setSelectedVoucher] = React.useState<string | null>(
    null,
  );

  const handleConfirm = () => {
    if (selectedVoucher) {
      onConfirm(selectedVoucher);
      onClose();
    }
  };

  return (
    <Modal
      title="Chọn Voucher"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleConfirm}
          disabled={!selectedVoucher}
        >
          Áp dụng
        </Button>,
      ]}
    >
      <List
        itemLayout="horizontal"
        dataSource={vouchers}
        renderItem={(voucher) => (
          <List.Item
            onClick={() => setSelectedVoucher(voucher.code)}
            className={`cursor-pointer ${
              selectedVoucher === voucher.code ? 'bg-blue-100' : ''
            }`}
          >
            <List.Item.Meta
              title={voucher.code}
              description={voucher.description}
            />
            <div>-₫{voucher.discount.toLocaleString()}</div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export { VoucherModal };
