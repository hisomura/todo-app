import cn from 'classnames'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { MouseEventHandler } from 'react'

type Props = {
  expanded: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}

export default function ToggleExpandIcon(props: Props) {
  return (
    <div onClick={props.onClick}>
      <MdExpandLess className={cn({ hidden: props.expanded })} />
      <MdExpandMore className={cn({ hidden: !props.expanded })} />
    </div>
  )
}
