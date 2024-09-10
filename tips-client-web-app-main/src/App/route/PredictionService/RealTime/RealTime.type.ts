export interface SensorData {
  [key: string]: number;
}

export interface DroneStatusProps {
  DroneTemperature: number
  DroneVoltage: number
}

export interface RealTimeProps {
  PredictData: SensorData;
  RangeMax: SensorData;
  RangeMin: SensorData;
  WarningData: SensorData;
}

export type RealTimePageType = {
  PredictData?: SensorData;
  SensorData?: SensorData;
  WarningData?: SensorData;
} & Record<string, any>;

export type RealTimeFormProps = {
  droneIds: string[];
  selectedValue?: string;
} & Record<string, any>;

interface GraphDataItem {
  m_dHeight: number;
  m_dLatitude: number;
  m_dLongitude: number;
}
export interface PredictionResultGraphProps {
  graphData: GraphDataItem[];
}

function transformValue(value: any): string | number {
  if (typeof value === 'number') {
    const decimalCount= value?.toString()?.split('.')[1]?.length
    return decimalCount>5 ? value.toFixed(3): value
  }
  return value
}

export function transformPropsObject(
  obj: SensorData
): Record<string, number> {
  const transformedObject: Record<string, number> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      transformedObject[key] = +transformValue(obj[key])
    }
  }

  return transformedObject
}


export interface FormDataProps {
  DroneId: string;
  FlightId: string;
  periodFrom: string;
  periodTo: string;
}

export interface ApiResponse {
  drones: string[];
  flights: string[];
  logPage?: { SensorData: string }[];
  'pred page'?: {
    DroneId: string;
    PredictTime: string;
    PredictData: string;
    SelectData: string;
    SensorData: string;
    WarningData: string;
  }[];
}

export function getDefaultFromDate() {
  const today = new Date()
  const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
  return formatDate(twoMonthsAgo)
}

export function getDefaultToDate() {
  return formatDate(new Date())
}

export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}