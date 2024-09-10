import React from 'react'
import { Popover as HeadlessPopover, Transition } from '@headlessui/react'

export const GCSPopover = ({ children, content, ...props }) => {
  return (
    <HeadlessPopover {...props}>
      <HeadlessPopover.Button>{children}</HeadlessPopover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0">
        <HeadlessPopover.Panel>{content}</HeadlessPopover.Panel>
      </Transition>
    </HeadlessPopover>
  )
}
