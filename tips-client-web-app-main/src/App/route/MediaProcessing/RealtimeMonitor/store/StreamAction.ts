import { StreamState } from './StreamState'
import { IStreamInfo } from '../index'

export type StreamAction = {
  setStreamUrl: (streamUrl: StreamState['streamUrl']) => void
  setListStream: (listStream: StreamState['listStream']) => void
  setSelectedName: (selectedName: StreamState['selectedName']) => void
  setSelectedUrl: (selectedUrl: StreamState['selectedUrl']) => void
  setIsMask: (isMask: StreamState['isMask']) => void

  onSelectByButton: (isMask: string) => void
  onLoadStreamList: () => void
  onSelectStream: (stream: IStreamInfo) => void
}
