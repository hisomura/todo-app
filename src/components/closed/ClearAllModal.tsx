import React from "react";
import Modal from "../common/Modal";

type Props = {
  open: boolean;
  onClear: () => void;
  onClose: () => void;
};

export default function ClearAllModal(props: Props) {
  const onClearButtonClick = () => {
    props.onClear();
    props.onClose();
  };
  return (
    <Modal open={props.open} onClose={props.onClear}>
      <div className="mb-6">Are you sure you want to clear all closed todos?</div>
      <div className="flex justify-center">
        <button onClick={onClearButtonClick} type="button" className="rounded border px-4 py-2 mx-2">
          Clear
        </button>
        <button onClick={props.onClose} type="button" className="rounded border px-4 py-2 mx-2">
          Cancel
        </button>
      </div>
    </Modal>
  );
}
