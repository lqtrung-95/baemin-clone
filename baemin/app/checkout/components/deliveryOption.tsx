import React from 'react';
import { Modal, Radio, Button } from 'antd';

interface DeliveryOption {
  option_id: string;
  name?: string;
}

interface DeliveryOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (optionId: string) => void;
  options: DeliveryOption[];
  currentOptionId: string;
}

const DeliveryOptionModal: React.FC<DeliveryOptionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  options,
  currentOptionId,
}) => {
  const [selectedOption, setSelectedOption] = React.useState(currentOptionId);

  const handleConfirm = () => {
    onConfirm(selectedOption);
    onClose();
  };

  return (
    <Modal
      title="Chọn phương thức vận chuyển"
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
      <Radio.Group
        onChange={(e) => setSelectedOption(e.target.value)}
        value={selectedOption}
      >
        {options.map((option) => (
          <Radio key={option.option_id} value={option.option_id}>
            {option.name}
          </Radio>
        ))}
      </Radio.Group>
    </Modal>
  );
};

export { DeliveryOptionModal };
