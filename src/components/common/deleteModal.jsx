import { Modal } from "antd";
import { Flex } from "antd";
import ButtonEDU from "../common/ButtonEDU";

function DeleteModal({ name, onCancel, onConfirm, visible }) {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      closeIcon={null}
      maskClosable={false}
      width={400}
    >
      <Flex
        vertical
        justify="space-between"
        className="w-full h-full mb-3 mt-3"
        gap={20}
      >
        <Flex align="center" justify="center">
          Are you sure you want to delete{" "}
          <span className="font-bold ml-1">{name}</span>?
        </Flex>
        <div className="flex items-center justify-center gap-4">
          <ButtonEDU actionType="cancel" onClick={onCancel}>
            Cancel{" "}
          </ButtonEDU>
          <ButtonEDU actionType="delete" onClick={onConfirm}>
            Delete
          </ButtonEDU>
        </div>
      </Flex>
    </Modal>
  );
}

export default DeleteModal;
