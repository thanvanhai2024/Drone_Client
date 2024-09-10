import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaLanguage } from 'react-icons/fa6'
import { motion, useAnimation } from 'framer-motion'

interface TranslationToggleProps {
  isMenuExpanded: boolean;
}

function TranslationToggle({ isMenuExpanded }: TranslationToggleProps) {
  const { i18n } = useTranslation()
  const controlTitleText = useAnimation()
  const controlText = useAnimation()

  const getCurrentLanguage = () => i18n.language

  const toggleLanguage = () => {
    const currentLanguage = getCurrentLanguage()
    const newLanguage = currentLanguage === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(newLanguage)
  }

  return (
    // <button onClick={toggleLanguage}>
    //   {getCurrentLanguage() === 'en' ? 'English' : '한국어'}
    // </button>
    <div className='mb-3 mx-3 mt- rounded'>
      <div className="flex px-1 py-1 items-center h-[40px] rounded-md bg-[#333353] hover:bg-[#6359E9] text-btn background-btn-app-menu">
        <button onClick={toggleLanguage}
          className="flex items-center h-full bg-transparent border-none cursor-pointer w-full">
          {isMenuExpanded ? ( 
            <>
              <FaLanguage className='text-lg m-1'/>
              <motion.p animate={controlText} className='ml-4 pt-0.5 text-sm cursor-pointer'>
                {getCurrentLanguage() === 'en' ? 'English' : '한국어'}
              </motion.p>
            </>
          ) : (
            <FaLanguage className='text-lg m-1'/>
          )}
        </button>
      </div>
    </div>
  )
}

export default TranslationToggle