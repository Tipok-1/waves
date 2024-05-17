import { useState } from "react"
import { folder, useControls } from "leva"
import { useDebounce } from "../hooks/useDebounce"
import { useGlobalControls } from "../store/globalControls"
import { useEffect } from "react"
import {
	COLOR_E_DEFAULT,
	COLOR_H_DEFAULT,
	SPEED_DEFAULT,
	PHASE_X_DEFAULT,
	PHASE_Y_DEFAULT,
	PHASE_MAX,
	PHASE_MIN,
	AMPLITUDE_MIN,
	PERIOD_MIN
} from "../utils/consts"

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
		colorE: COLOR_E_DEFAULT,
		colorH: COLOR_H_DEFAULT,
		period: modelSize / 2,
		speed: SPEED_DEFAULT,
		amplitude: modelSize / 4,
		initialPhaseX: PHASE_X_DEFAULT,
		initialPhaseY: PHASE_Y_DEFAULT
	})

	const debounceChangeColor = useDebounce((color: string, type: EFieldType) => {
		if (type === EFieldType.ELECTRIC) {
			setSettings(state => ({ ...state, colorE: color }))
		} else {
			setSettings(state => ({ ...state, colorH: color }))
		}
	}, 300)
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
		300
	)
	const debounceChangeSimpleValues = useDebounce(
		(value: number, type: TSimpleSettings) => {
			if (type === "amplitude")
				setSettings(state => ({ ...state, amplitude: value }))
			if (type === "period") setSettings(state => ({ ...state, period: value }))
		},
		300
	)
	useControls(
		{
			[props.waveName]: folder({
				[dictionary.E]: {
					value: COLOR_E_DEFAULT,
					onChange: color => debounceChangeColor(color, EFieldType.ELECTRIC)
				},
				[dictionary.H]: {
					value: COLOR_H_DEFAULT,
					onChange: color => debounceChangeColor(color, EFieldType.MAGNETIC)
				},
				[dictionary.phaseDifference]: folder({
					[dictionary.initialPhaseX]: {
						value: PHASE_X_DEFAULT,
						min: PHASE_MIN,
						max: PHASE_MAX,
						step: 1,
						onChange: phase => debounceChangePhase(phase, "X"),
						disabled: nonPolarized
					},
					[dictionary.initialPhaseY]: {
						value: PHASE_Y_DEFAULT,
						min: PHASE_MIN,
						max: PHASE_MAX,
						step: 1,
						onChange: phase => debounceChangePhase(phase, "Y"),
						disabled: nonPolarized
					}
				}),
				[dictionary.amplitude]: {
					value: modelSize / 4,
					min: AMPLITUDE_MIN,
					max: modelSize / 4,
					step: 1,
					onChange: amplitude =>
						debounceChangeSimpleValues(amplitude, "amplitude")
				},
				[dictionary.period]: {
					value: modelSize / 2,
					min: PERIOD_MIN,
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
