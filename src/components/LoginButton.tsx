import React from "react";
import { AiFillGithub } from "react-icons/ai";

type Props = {
  onclick: () => void;
  message: string;
};

export default function LoginButton(props: Props) {
  return (
    <button onClick={props.onclick} className="hover:bg-gray-100 font-bold py-2 px-4 rounded inline-flex items-center">
      <AiFillGithub size={24} className="mr-2" />
      <span>{props.message}</span>
    </button>
  );
}
