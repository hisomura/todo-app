import React from 'react';
import cn from 'classnames'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { MouseEventHandler } from 'react'

type Props = {
  folding: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}

export default function ToggleFoldingButton(props: Props) {
  return (
    <div onClick={props.onClick} data-testid='toggle-folding-closed-tasks-button'>
      <MdExpandLess className={cn({ hidden: props.folding })} />
      <MdExpandMore className={cn({ hidden: !props.folding })} />
    </div>
  )
}
