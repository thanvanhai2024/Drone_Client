import React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import '../Log/Log.scss'

export const CollapsibleComponentForPredict = ({ group, key, getCheckboxesForGroup, selectedCheckboxes, handleCheckboxChange, isCheckboxDisabled }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <Collapsible.Root className="w-full" open={open} onOpenChange={setOpen}>
      <div className={'flex flex-row items-center border-b border-r border-[#1F42A9] '}>
        <Collapsible.Trigger asChild>
          <button
            className="h-[25px] w-[25px] ml-3 items-center justify-center focus:shadow-[0_0_0_2px] focus:shadow-black">
            {open ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
            </svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
              </svg>
            }
          </button>
        </Collapsible.Trigger>

        <div className="my-[10px] p-[2px] text-sm">
          <span>{group}</span>
        </div>
      </div>

      <Collapsible.Content>
        <div className="py-3 pl-10 bg-[#1F42A9]">
          <span className="">
            {getCheckboxesForGroup(group).map((checkbox) => (
              <button
                key={checkbox}
                className={`log-chart-graph-option-check-space ${
                  selectedCheckboxes.includes(checkbox)
                    ? 'bg-selected-color text-white'
                    : 'bg-unselected-color text-black'
                }`}
                onClick={() => handleCheckboxChange(checkbox)}
                disabled={isCheckboxDisabled(checkbox)}
              >
                {checkbox}
              </button>
            ))}
          </span>
        </div>
        {/*<div className="py-3 pl-10 bg-[#1F42A9]">*/}
        {/*  <span className="">{*/}
        {/*    getCheckboxesForGroup(group).map((checkbox) => (*/}
        {/*      <div>*/}
        {/*        <label className='log-chart-graph-option-check-space' key={checkbox}>*/}
        {/*          <input*/}
        {/*            type='checkbox'*/}
        {/*            className='log-chart-graph-option-label-space '*/}
        {/*            checked={selectedCheckboxes.includes(checkbox)}*/}
        {/*            onChange={() => handleCheckboxChange(checkbox)}*/}
        {/*            disabled={isCheckboxDisabled(checkbox)}*/}
        {/*          />*/}
        {/*          {checkbox}*/}
        {/*        </label>*/}
        {/*      </div>*/}
        {/*    ))*/}
        {/*  }</span>*/}
        {/*</div>*/}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
