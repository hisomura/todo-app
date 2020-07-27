import React from 'react'

type Props = {
  open: boolean
  onClear: () => void
  onClose: () => void
}

export default function ClearAllModal(props: Props) {
  const onClearButtonClick = () => {
    props.onClear()
    props.onClose()
  }
  return (
    <>
      <div onClick={props.onClose} hidden={!props.open} className="absolute inset-0 bg-gray-500 opacity-75" />
      <div hidden={!props.open} className="transform shadow-xl max-w-md bg-white rounded px-6 py-6 mx-auto">
        <div className="mb-6">Are you sure you want to clear all closed tasks?</div>
        <div className="flex justify-center">
          <button onClick={onClearButtonClick} type="button" className="rounded border px-4 py-2 mx-2">
            Clear
          </button>
          <button onClick={props.onClose} type="button" className="rounded border px-4 py-2 mx-2">
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
