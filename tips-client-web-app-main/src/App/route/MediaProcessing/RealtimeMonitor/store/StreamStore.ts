import { create } from 'zustand'
import axios from 'axios'
import { STREAM_SERVICE_URL, STREAM_URL } from '../../../common/path'
import { buildError } from '../../../common/ErrorMessage'
import { StreamState } from './StreamState'
import { StreamAction } from './StreamAction'
import { useStreamWeightStore } from '../ModelManager/ModelManager'
import { IStreamInfo } from '../index'
import { toast } from 'react-toastify'


export const useStreamStore = create<StreamState & StreamAction>((set, get) => ({
  streamUrl: '',
  setStreamUrl: (streamUrl) => set(() => ({ streamUrl: streamUrl })),
  listStream: [],
  setListStream: (listStream) => set(() => ({ listStream: listStream })),
  selectedName: '',
  setSelectedName: (selectedName) => set(() => ({ selectedName: selectedName })),
  selectedUrl: '',
  setSelectedUrl: (selectedUrl) => set(() => ({ selectedUrl: selectedUrl })),
  isMask: 'True',
  setIsMask: (isMask) => set(() => ({ isMask: isMask })),

  onSelectStream: (stream: IStreamInfo) => {
    get().setSelectedName(stream.name)
    get().setStreamUrl(stream.streamOutput)

    let urlBuild = new URL(`${STREAM_URL}/stream`)
    urlBuild.searchParams.append('name', stream.name)
    urlBuild.searchParams.append('rtspInput', stream.rtspInput)
    urlBuild.searchParams.append('rtspOutput', stream.rtspOutput)

    axios.get(urlBuild.toString(), {
    }).then((response) => {
      let responseObj = response.data
      console.log(responseObj)
      // get().setListStream(responseObj)
    }).catch(error => {
      buildError(error.response.data)
    })
  },

  onSelectByButton: (isMask: string) => {
    get().setIsMask(isMask)
    let urlBuild = new URL(`${STREAM_URL}/stream-video/`)
    urlBuild.searchParams.set('url', get().selectedUrl)
    urlBuild.searchParams.set('mask', isMask)
    urlBuild.searchParams.set('weightName', useStreamWeightStore.getState().currentWeight)
    get().setStreamUrl(urlBuild.toString())
  },



  onLoadStreamList: async() => {
    // get().setListStream(responseObj.payload)
    // TODO: save list stream
    await axios.get(`${STREAM_URL}/list-stream`, {
    })
      .then((response) => {
        let responseObj = response.data
        console.log(responseObj)
        get().setListStream(responseObj)
      }).catch(error => {
        buildError(error)
      })
  }
}))
