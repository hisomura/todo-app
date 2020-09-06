import React from "react";
import { AiFillGithub } from "react-icons/ai";

type Props = {
  onclick: () => void;
  message: string;
};

const LoginButton = React.memo((props: Props) => {
  return (
    <button onClick={props.onclick} className="hover:bg-gray-100 font-bold py-2 px-4 rounded inline-flex items-center">
      <AiFillGithub size={24} className="mr-2" />
      <span>{props.message}</span>
    </button>
  );
});

export default LoginButton;
