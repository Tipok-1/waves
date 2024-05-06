import { useRef } from "react"
import { folder, useControls } from "leva"
import { useDebounce } from "../hooks/useDebounce"
import { useGlobalControls } from "../store/globalControls"
import { useEffect } from "react"

export interface IWaveSettings {
	amplitude: number
	period: number
	speed: number
	initialPhaseX: number
	initialPhaseY: number
	colorE: string
	colorH: string
}
interface IWaveControls {
	waveName: string
}
enum EFieldType {
	ELECTRIC = "ELECTRIC",
	MAGNETIC = "MAGNETIC"
}
type TSimpleSettings = "amplitude" | "speed" | "period"
const dictionary = {
	phaseDifference: "Разность фаз (°)",
	initialPhaseX: "Начальная фаза X",
	initialPhaseY: "Начальная фаза Y",
	E: "Цвет вектора E",
	H: "Цвет вектора H",
	amplitude: "Амплитуда волны",
	speed: "Скорость волны",
	period: "Период волны"
}
export function useWaveControls(props: IWaveControls) {
	const modelSize = useGlobalControls(state => state.modelSize)
	const defaultSettings = useRef<IWaveSettings>({
		colorE: "yellow",
		colorH: "blue",
		period: modelSize / 2,
		speed: 1,
		amplitude: modelSize / 4,
		initialPhaseX: 0,
		initialPhaseY: 0
	})

	const debounceChangeColor = useDebounce((color: string, type: EFieldType) => {
		if (type === EFieldType.ELECTRIC) {
			defaultSettings.current.colorE = color
		} else {
			defaultSettings.current.colorH = color
		}
	}, 500)
	const debounceChangePhase = useDebounce(
		(value: number, phaseType: "X" | "Y") => {
			if (phaseType === "X") {
				defaultSettings.current.initialPhaseX = (value * Math.PI) / 180
			} else {
				defaultSettings.current.initialPhaseY = (value * Math.PI) / 180
			}
		},
		500
	)
	const debounceChangeSimpleValues = useDebounce(
		(value: number, type: TSimpleSettings) => {
			if (type === "amplitude") defaultSettings.current.amplitude = value
			if (type === "period") defaultSettings.current.period = value
		},
		500
	)
	useControls(
		{
			[props.waveName]: folder({
				[dictionary.E]: {
					value: "yellow",
					onChange: color => debounceChangeColor(color, EFieldType.ELECTRIC)
				},
				[dictionary.H]: {
					value: "blue",
					onChange: color => debounceChangeColor(color, EFieldType.MAGNETIC)
				},
				[dictionary.phaseDifference]: folder({
					[dictionary.initialPhaseX]: {
						value: 0,
						min: -360,
						max: 360,
						step: 1,
						onChange: phase => debounceChangePhase(phase, "X")
					},
					[dictionary.initialPhaseY]: {
						value: 0,
						min: -360,
						max: 360,
						step: 1,
						onChange: phase => debounceChangePhase(phase, "Y")
					}
				}),
				[dictionary.amplitude]: {
					value: modelSize / 4,
					min: 1,
					max: modelSize / 4,
					step: 1,
					onChange: amplitude =>
						debounceChangeSimpleValues(amplitude, "amplitude")
				},
				[dictionary.period]: {
					value: modelSize / 2,
					min: 10,
					max: modelSize * 2,
					step: 1,
					onChange: period => debounceChangeSimpleValues(period, "period")
				}
			})
		},
		[modelSize]
	)

	useEffect(() => {
		if (defaultSettings.current.amplitude > modelSize / 4) {
			debounceChangeSimpleValues(modelSize / 4, "amplitude")
		}
	}, [modelSize, debounceChangeSimpleValues])
	return defaultSettings.current
}
