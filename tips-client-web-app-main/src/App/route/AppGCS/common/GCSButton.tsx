import React from 'react'

const typeColor: any = {
  primary: '#6359E9',
  secondary: 'bg-purple-600',
  danger: 'bg-red-600',
  light: 'bg-gray-200',
  dark: 'bg-gray-800',
  link: 'bg-transparent',
}

const typeColorHover: any = {
  primary: '#6359E9',
  secondary: 'bg-purple-600',
  danger: 'bg-red-600',
  light: 'bg-gray-200',
  dark: 'bg-gray-800',
  link: 'bg-transparent',
}

const textColor: any = {
  primary: 'text-white',
  light: 'text-gray-700',
  link: 'text-blue-600',
}

export const GCSButton = ({ htmlType, type, children, className, ...props }: any) => {
  return (
    <button
      type={htmlType}
      className={`inline-block px-6 py-2.5 ${typeColor[type] || typeColor.primary} ${
        textColor[type] || textColor.primary
      } font-medium text-xs leading-tight uppercase rounded ${type !== 'link' ? 'shadow-md' : ''} ${
        'hover:' + (typeColorHover[type] || typeColorHover.primary)
      } ${type !== 'link' ? 'hover:shadow-lg' : ''} ${'focus:' + (typeColorHover[type] || typeColorHover.primary)} ${
        type !== 'link' ? 'focus:shadow-lg' : ''
      } focus:outline-none focus:ring-0 active:bg-[#4B4B99] ${
        type !== 'link' ? 'active:shadow-lg' : ''
      } transition duration-150 ease-in-out ${className || ''}`}
      {...props}>
      {children}
    </button>
  )
}
