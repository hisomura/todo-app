import React, { MouseEventHandler } from "react";
import cn from "classnames";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

type Props = {
  folding: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

const ToggleFoldingButton = React.memo((props: Props) => {
  return (
    <div onClick={props.onClick} data-testid="toggle-folding-closed-todos-button">
      <MdExpandLess className={cn({ hidden: props.folding })} />
      <MdExpandMore className={cn({ hidden: !props.folding })} />
    </div>
  );
});

export default ToggleFoldingButton;
