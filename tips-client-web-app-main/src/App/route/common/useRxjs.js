import { useEffect, useState } from 'react'

export const useSubscribe = (observable, initValue) => {
  const [value, setValue] = useState(initValue)
  useEffect(() => {
    const subscription = observable.subscribe(v => setValue(v))
    return () => subscription.unsubscribe()
  }, [observable])

  return [value]
}
