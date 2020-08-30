import React, { useRef, useState } from "react";

type ModalAccessor = {
  open: (children: any) => void;
  close: () => void;
};

const ModalContext = React.createContext<undefined | ModalAccessor>(undefined);

function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal() must be used within a ModalProvider");
  }

  return context;
}

function ModalProvider(props: { children: any }) {
  const [state, setState] = useState({
    open: false,
    children: null,
  });

  const accessor = useRef<ModalAccessor>({
    open: (children: any) => setState({ open: true, children }),
    close: () => setState({ open: false, children: null }),
  });

  return (
    <>
      <ModalContext.Provider value={accessor.current}>{props.children}</ModalContext.Provider>
      <div hidden={!state.open} className="fixed z-10 inset-0">
        <div className="relative w-full h-full grid justify-center content-center">
          <div onClick={close} className="absolute w-full h-full z-0 bg-gray-500 opacity-75" />
          <div className="z-10 w-auto h-auto shadow-xl max-w-md bg-white rounded px-6 py-6">{state.children}</div>
        </div>
      </div>
    </>
  );
}

export { ModalProvider, useModal };
