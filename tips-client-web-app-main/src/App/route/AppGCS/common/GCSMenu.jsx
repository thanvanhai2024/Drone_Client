import React from 'react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'


export const GCSMenu = ({ children, items, ...props }) => {
  return (
    <HeadlessMenu {...props} as="div">
      <div>
        <HeadlessMenu.Button>{children}</HeadlessMenu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <HeadlessMenu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            {items.map(({ label, ...props }, index) => (
              <HeadlessMenu.Item key={index} {...props}>
                {({ active }) => (
                  <span
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm text-black ${
                      active ? 'bg-sidebar-bg text-white' : 'text-gray-900'
                    }`}>
                    {label}
                  </span>
                )}
              </HeadlessMenu.Item>
            ))}
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  )
}
