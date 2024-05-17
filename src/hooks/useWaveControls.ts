import { useState } from "react"
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
	const nonPolarized = useGlobalControls(state => state.nonPolarized)
	const [settings, setSettings] = useState({
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
			setSettings(state => ({ ...state, colorE: color }))
		} else {
			setSettings(state => ({ ...state, colorH: color }))
		}
	}, 500)
	const debounceChangePhase = useDebounce(
		(value: number, phaseType: "X" | "Y") => {
			if (phaseType === "X") {
				setSettings(state => ({
					...state,
					initialPhaseX: (value * Math.PI) / 180
				}))
			} else {
				setSettings(state => ({
					...state,
					initialPhaseY: (value * Math.PI) / 180
				}))
			}
		},
		500
	)
	const debounceChangeSimpleValues = useDebounce(
		(value: number, type: TSimpleSettings) => {
			if (type === "amplitude")
				setSettings(state => ({ ...state, amplitude: value }))
			if (type === "period") setSettings(state => ({ ...state, period: value }))
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
						onChange: phase => debounceChangePhase(phase, "X"),
						disabled: nonPolarized
					},
					[dictionary.initialPhaseY]: {
						value: 0,
						min: -360,
						max: 360,
						step: 1,
						onChange: phase => debounceChangePhase(phase, "Y"),
						disabled: nonPolarized
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
		[modelSize, nonPolarized]
	)

	useEffect(() => {
		if (settings.amplitude > modelSize / 4) {
			debounceChangeSimpleValues(modelSize / 4, "amplitude")
		}
	}, [modelSize, debounceChangeSimpleValues, settings.amplitude])
	return settings
}
