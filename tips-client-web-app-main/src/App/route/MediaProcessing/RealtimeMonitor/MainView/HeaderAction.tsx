import * as React from 'react'
import ModelManager, { useStreamWeightStore } from '../ModelManager/ModelManager'
import { shallow } from 'zustand/shallow'
import { useStreamStore } from '../store/StreamStore'
import { useContext, useState } from 'react'
import { MeContext } from '../../../../Auth/MeContext'
import { Button } from '../../../../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'

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

const HeaderAction = () => {
  const [
    currentWeight,
    weightList,
    loadWeightList,
    onSelectDefaultWeight,
  ] = useStreamWeightStore( (state) => [
    state.currentWeight,
    state.weightList,
    state.onLoadWeightList,
    state.onSelectDefaultWeight,
  ])
  const { username, is_superuser } = useContext(MeContext)

  const [
    selectedName,
    isMask,
    onSelectByButton
  ] = useStreamStore(
    (state) => [
      state.selectedName,
      state.isMask,

      state.onSelectByButton
    ],
    shallow
  )

  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div layout className='dropdownCotainer drop-down mb-2 white-background padding-10 ' data-open={open}>
        <div className="flex">
          <div className="action-list">
            {
              selectedName !== '' &&
                <>
                  <div className="">
                    <Button className=" " onClick={() => onSelectByButton('True')}>
                            Mask
                    </Button>
                    <Button className="ml-2 " onClick={() => onSelectByButton('False')}>
                      Unmask
                    </Button>
                  </div>
                  {/*<div className="d-inline ml-2">*/}
                  {/*  {*/}

                  {/*  }*/}
                  {/*</div>*/}
                </>
            }
          </div>
          {/*<div className="ml-auto-i flex-center">*/}
          {/*  <div className="flex flex-row">*/}
          {/*    <div className="">Select weight</div>*/}
          {/*  </div>*/}
          {/*  <div className="ml-2">*/}
          {/*    <Button className="action-button" variant={'secondary'} aria-controls="example-collapse-text"*/}
          {/*      aria-expanded={open} onClick={() => setOpen(!open)}>*/}
          {/*      <div className="flex-center-space margin-auto ">*/}
          {/*        {*/}
          {/*          open ?*/}
          {/*            <>*/}
          {/*              <FaCaretUp/>*/}
          {/*              <span>Close</span>*/}
          {/*            </> :*/}
          {/*            <>*/}
          {/*              <FaCaretDown/>*/}
          {/*              <span>Open</span>*/}
          {/*            </>*/}
          {/*        }*/}
          {/*      </div>*/}
          {/*    </Button>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className=""
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ overflow: 'hidden' }}
            >
              <ModelManager weightList={weightList} loadWeightList={loadWeightList} />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </>
  )
}

export default HeaderAction
