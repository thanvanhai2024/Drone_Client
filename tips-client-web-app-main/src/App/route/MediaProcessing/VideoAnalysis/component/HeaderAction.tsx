import * as React from 'react'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import ModelManager, { useVideoModelStore } from './ModelManager'
import { useVideoStore } from '../store/VideoStore'
import { Button } from '../../../../components/ui/button'
import LoadingMotion from '../../../common/LoadingMotion'
import { MdFeedback } from 'react-icons/md'

// add code
import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import useUserStore from '../../../../store'
import { FaCaretUp, FaLock, FaLockOpen, FaRobot } from 'react-icons/fa6'
import { FaCaretDown } from 'react-icons/fa6'

const dropdownVariants = {
  open: {
    opacity: 1,
    height: 'auto',
    weight: '100%',
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

const HeaderAction:React.FC<HeaderAction> = ({ buttonOpen,setButtonOpen }) => {
  const [
    currentWeightFullPath,
    weightList,

    onLoadWeightList,
    onSelectDefaultWeight,
  ] = useVideoModelStore((state) => [
    state.currentWeight,
    state.weightList,

    state.onLoadWeightList,
    state.onSelectDefaultWeight,
  ])

  const [
    selectedVideo,
    isMaskingVideo,
    isUnmaskingVideo,
    maskedVideo,
    isProcessingVideo,

    onProcessVideo,
    onMaskingVideo,
    onUnmaskingVideo
  ] = useVideoStore(
    (state) => [
      state.selectedVideo,
      state.isMaskingVideo,
      state.isUnmaskingVideo,
      state.maskedVideo,
      state.isProcessingVideo,

      state.onProcessVideo,
      state.onMaskingVideo,
      state.onUnmaskingVideo],
    shallow
  )


  useEffect(() => {
    onLoadWeightList()
  }, [onLoadWeightList])

  const { authUser } = useUserStore()

  return (
    <>
      <motion.div layout className='dropdownCotainer drop-down mb-2 white-background padding-10 w-full' data-open={buttonOpen}>
        <div className="flex">
          <div className="flex flex-row">
            {/*<div className="action-list">*/}
            <div className="d-inline ml-2">
              <Button className="action-button" variant='secondary' onClick={() => onProcessVideo(authUser!.username)}
                disabled={isProcessingVideo}>
                <div className="flex-center-space margin-auto ">
                  {
                    isProcessingVideo ?
                      <LoadingMotion/>
                      : <FaRobot />
                  }
                  <div>영상 분석</div>
                </div>
              </Button>
            </div>
            <div className="d-inline ml-2">
              <Button className="action-button" variant={'secondary'}
                onClick={() => onMaskingVideo(authUser!.username, selectedVideo)}>
                <div className="flex-center-space margin-auto ">
                  {isMaskingVideo ?
                    <LoadingMotion/>
                    : <FaLock />}
                  <div>마스킹 처리</div>
                </div>
              </Button>
            </div>

            <div className="d-inline ml-2">
              <Button className="action-button" variant={'secondary'}
                onClick={() => onUnmaskingVideo(authUser!.username, maskedVideo)}>
                <div className="flex-center-space margin-auto">
                  {
                    isUnmaskingVideo ?
                      <LoadingMotion/>
                      : <FaLockOpen />
                  }
                  <div>언마스킹 처리</div>
                </div>
              </Button>
            </div>
            {/*</div>*/}
            {/*  언마스킹 버튼 */}
          </div>

          <div className="ml-auto-i flex-center">

            {/* Select weight */}
            <div className="flex flex-row">
              <Select defaultValue={currentWeightFullPath}
                onValueChange={(event: any) => onSelectDefaultWeight(event)}
              >
                <SelectTrigger className='action-button'>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {
                    weightList.length > 0 && weightList.map((weight, index) => (
                      <SelectItem key={index} value={weight.fileName}>{weight.fileName}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            {/* end Select weight */}

            {/* origin code */}
            {/*<div className="ml-2">*/}
            {/*  <Button className="action-button" variant={'secondary'} aria-controls="example-collapse-text"*/}
            {/*    aria-expanded={open} onClick={() => setOpen(!open)}>*/}
            {/*    <div className="flex-center-space margin-auto ">*/}
            {/*      {*/}
            {/*        open ?*/}
            {/*          <>*/}
            {/*                Close*/}
            {/*          </> :*/}
            {/*          <>*/}
            {/*                Model Manage*/}
            {/*          </>*/}
            {/*      }*/}
            {/*    </div>*/}
            {/*  </Button>*/}
            {/*</div>*/}
            {/* end origin code */}

            <div className="ml-2">
              <Button className="action-button" variant={'secondary'} aria-controls="example-collapse-text"
                aria-expanded={buttonOpen} onClick={() => setButtonOpen(!buttonOpen)}>
                <div className="flex-center-space margin-auto ">
                  {
                    buttonOpen ?
                      <>
                        <FaCaretUp />
                          Close
                      </> :
                      <>
                        <FaCaretDown />
                          Open
                      </>
                  }
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* origin code */}
        {/*<div>*/}
        {/*  <div>*/}
        {/*    /!*<Collapse in={open}>*!/*/}
        {/*    <div id="example-collapse-text">*/}
        {/*      <ModelManager weightList={weightList} loadWeightList={onLoadWeightList}/>*/}
        {/*    </div>*/}
        {/*    /!*</Collapse>*!/*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*  end origin code*/}

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
