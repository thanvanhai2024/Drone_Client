import * as React from 'react'
import ModelManager, { useImageModelStore } from '../ModelManager/ModelManager'
import { shallow } from 'zustand/shallow'
import { useImageStore } from '../store/ImageStore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button } from '../../../../components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'

// add code
import { motion, AnimatePresence } from 'framer-motion'
import { FaCaretDown, FaCaretUp, FaLock, FaLockOpen, FaRobot } from 'react-icons/fa6'

const dropdownVariants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      opacity: { duration: 0.3 },
      height: { duration: 0.3 },
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      opacity: { duration: 0.3 },
      height: { duration: 0.3 },
    },
  },
}

type HeaderAction =
  {
    buttonOpen: boolean
    setButtonOpen: React.Dispatch<React.SetStateAction<boolean>>
  }

const HeaderAction: React.FC<HeaderAction> = ({ buttonOpen, setButtonOpen }) => {
  const [
    currentWeight,
    weightList,

    onLoadWeightList,
    onSelectDefaultWeight,
  ] = useImageModelStore((state) => [
    state.currentWeight,
    state.weightList,

    state.onLoadWeightList,
    state.onSelectDefaultWeight,
  ])

  const [
    isProcessingImage,
    selectedImage,
    isMaskingImage,
    isUnmaskingImage,
    maskingImage,
    maskImage,

    processImage,
    onMaskingImage,
    onUnmaskingImage

  ] = useImageStore(
    (state) => [
      state.isProcessingImage,
      state.selectedImage,
      state.isMaskingImage,
      state.isUnmaskingImage,
      state.maskingImage,
      state.maskImage,

      state.onProcessImage,
      state.onMaskingImage,
      state.onUnmaskingImage],
    shallow
  )

  useEffect(() => {
    onLoadWeightList()
  }, [onLoadWeightList])


  // open : Dropdown activate/deactivate statement
  const className = `dropdownCotainer drop-down padding-10 ${buttonOpen}`
  return (
    <>
      <motion.div layout className={className} data-open={buttonOpen}>
        <div className="flex">
          <div className="flex flex-row">
            <div className="">
              <Button className="action-button" variant='secondary' onClick={() => processImage()}
                disabled={isProcessingImage}>
                <div className="flex-center-space margin-auto ">
                  {isProcessingImage ?
                    <AiOutlineLoading className="animate-spin text-3xl"/>
                    : <FaRobot/>}
                  <div>이미지 분석</div>
                </div>
              </Button>
            </div>
            <div className="d-inline ml-2">
              <Button className="action-button" variant={'secondary'}
                onClick={() => onMaskingImage(selectedImage)}>
                <div className="flex-center-space margin-auto ">
                  {isMaskingImage ?
                    <AiOutlineLoading className="animate-spin text-3xl"/>
                    : <FaLock/>}
                  <div>마스킹 처리</div>
                </div>
              </Button>
            </div>
            <div className="d-inline ml-2">
              <Button className="action-button" variant={'secondary'}
                onClick={() => onUnmaskingImage(maskingImage)}>
                <div className="flex-center-space margin-auto">
                  {isUnmaskingImage ?
                    <AiOutlineLoading className="animate-spin text-3xl"/>
                    : <FaLockOpen/>}
                  <div>언마스킹 처리</div>
                </div>
              </Button>
            </div>
          </div>
          <div className="ml-auto-i flex-center">
            <div className="flex flex-row">
              <Select defaultValue={currentWeight}
                onValueChange={(event: any) => onSelectDefaultWeight(event)}
              >
                <SelectTrigger className='action-button'>
                  <SelectValue placeholder="Select model"/>
                </SelectTrigger>
                <SelectContent>
                  {weightList.length > 0 && weightList.map((weight, index) => (
                    <SelectItem key={index} value={weight.fileName}>{weight.fileName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-2">
              <Button className="action-button" variant={'secondary'} aria-controls="example-collapse-text"
                aria-expanded={buttonOpen} onClick={() => setButtonOpen(!buttonOpen)}>
                <div className="flex-center-space margin-auto ">
                  {
                    buttonOpen ?
                      <><FaCaretUp/> Close </> :
                      <><FaCaretDown/> Open </>
                  }
                </div>
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {buttonOpen && (
            <motion.div
              className=""
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ overflow: 'hidden' }}
            >
              <ModelManager/>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default HeaderAction
