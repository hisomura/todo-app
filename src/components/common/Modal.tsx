import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: any;
};

export default function Modal(props: Props) {
  return (
    <div hidden={!props.open} className="fixed z-10 inset-0">
      <div className="relative w-full h-full grid justify-center content-center">
        <div onClick={props.onClose} className="absolute w-full h-full z-0 bg-gray-500 opacity-75" />
        <div hidden={!props.open} className="z-10 w-auto h-auto shadow-xl max-w-md bg-white rounded px-6 py-6">
          {props.children}
        </div>
      </div>
    </div>
  );
}
