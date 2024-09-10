import { toast } from 'react-toastify'


export const buildError = (error: any) => {
  toast(error.message, { type: 'error' })
  // switch (error?.response?.status) {
  //     case 401:
  //       toast('Please reconnect!', { type: 'warning' })
  //       break
  //     case 500:
  //       toast('Internal Server Error', { type: 'error' })
  //       break
  //     default:
  //       toast('Error!', { type: 'error' })
  // }
}
