import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'

import translationKorean from './locale/ko/ko.json'
import translationEnglish from './locale/en/en.json'



const resources = {
  en: {
    translation:translationEnglish,
  },
  ko: {
    translation:translationKorean
  }
}

i18next
  .use(initReactI18next).init({
    resources,
    lng: 'ko', // 초기 설정 언어
    fallbackLng: 'en', // 한국어 불러오는 것이 실패했을 경우 영문을 써라 라는 말입니다.
    debug: true,
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18next


// i18n.use(initReactI18next)
//   .init({ resources, lng: 'ko', interpolation: { escapeValue: false } })
//   .then(() => console.info('Initialed i18n'))
