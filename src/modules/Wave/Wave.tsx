import { FC, useState, useRef, useEffect } from "react"
import { useSpring } from "@react-spring/web"
import { Line } from "@react-three/drei"
import { useGlobalControls } from "../../store/globalControls"
import type { IWaveSettings } from "../../hooks/useWaveControls"
import WaveProjection from "./WaveProjection"

enum EPolarizationType {
	CIRCULAR = "circular",
	ELLIPTICAL = "elliptical",
	LINEAR = "linear"
}
interface IWave {
	polarizationType?: EPolarizationType
	settings: IWaveSettings
}
export enum EFieldType {
	ELECTRIC = "ELECTRIC",
	MAGNETIC = "MAGNETIC"
}
interface IVectorProps {
	time: number
	Z: number
	X0?: number
	Y0?: number
	field?: EFieldType
	settings: IWaveSettings
}

export type TDots = [number, number, number]
interface IVector {
	startPoint: TDots
	endPoint: TDots
}
type renderVectorFn = (props: IVectorProps) => IVector

const renderVector: renderVectorFn = ({
	field = EFieldType.ELECTRIC,
	settings,
	time,
	Z
}) => {
	let tensionX = null
	let tensionY = null
	const amplitude = settings.amplitude //Амплитуда волны
	const initialPhaseX = settings.initialPhaseX //Начальная фаза x
	const initialPhaseY = settings.initialPhaseY * 0.5 //Начальная фаза y
	const speed = settings.speed // Скорость распространения волны
	const period = settings.period // Период волны

	const wavelength = speed * period //Длина волны
	const w = (2 * Math.PI) / period //Круговая частота
	const k = (2 * Math.PI) / wavelength //Волновое число

	const cosineArgument_X = w * time - k * Z + initialPhaseX
	tensionX = amplitude * Math.cos(cosineArgument_X) //Напряжённость по оси X

	const cosineArgument_Y = w * time - k * Z + initialPhaseY
	tensionY = amplitude * Math.cos(cosineArgument_Y) //Напряжённость по оси Y

	let endX = tensionX //Конечная координата X вектора напряжённости
	let endY = tensionY //Конечная координата Y вектора напряжённости

	if (field === EFieldType.MAGNETIC) {
		//Поворачиваем вектор H
		const angle = (90 * Math.PI) / 180
		const x = endX,
			y = endY
		endX = x * Math.cos(angle) - y * Math.sin(angle)
		endY = x * Math.sin(angle) + y * Math.cos(angle)
	}
	return {
		startPoint: [0, 0, Z],
		endPoint: [endX, endY, Z]
	}
}

const animate = (
	time: number,
	stepBetweenVectors: number,
	settings: IWaveSettings
) => {
	const modelSize = useGlobalControls.getState().modelSize
	const allVectorsE: IVector[] = []
	const allVectorsH: IVector[] = []
	for (let Z = -modelSize; Z < modelSize; Z += stepBetweenVectors) {
		const obj = { time: +time.toFixed(3), Z, settings: settings }
		const coords = renderVector(obj)

		allVectorsE.push(coords)

		const coords2 = renderVector({
			time: +time.toFixed(3),
			Z,
			settings: settings,
			field: EFieldType.MAGNETIC
		})
		allVectorsH.push(coords2)
	}
	return { allVectorsE, allVectorsH }
}

export interface IVectors {
	allVectorsE: IVector[]
	allVectorsH: IVector[]
}
const Wave: FC<IWave> = ({ settings }) => {
	const stepBetweenVectors = useGlobalControls(
		state => state.stepBetweenVectors
	)
	const animationDuration = useGlobalControls(state => state.animationDuration)
	const animationStarted = useGlobalControls(state => state.animationStarted)
	const modelSize = useGlobalControls(state => state.modelSize)
	const lastTime = useRef<number | null>(null)
	const [allVectors, setAllVectors] = useState<IVectors>({
		allVectorsE: [],
		allVectorsH: []
	})
	const [, api] = useSpring(
		() => ({
			time: 500,
			from: { time: 0 },
			config: { duration: animationDuration * 1000 },
			loop: true,
			reset: true,
			onChange: ({ value: { time } }) => {
				if (
					lastTime.current === null ||
					Math.trunc(time) !== lastTime.current
				) {
					const vectors = animate(time, stepBetweenVectors, settings)
					setAllVectors(vectors)
					lastTime.current = Math.trunc(time)
				}
			}
		}),
		[stepBetweenVectors, animationDuration, settings]
	)

	useEffect(() => {
		if (!animationStarted) api.pause()
		else api.resume()
	}, [animationStarted, api])

	const [wavePath, setWavePath] = useState<{
		pathEStart: TDots[]
		pathEEnd: TDots[]
		pathHStart: TDots[]
		pathHEnd: TDots[]
	} | null>(null)

	useEffect(() => {
		const vectors = animate(0, stepBetweenVectors, settings)
		const pathE = vectors.allVectorsE.slice(0, settings.period * 1.5)
		const pathH = vectors.allVectorsH.slice(0, settings.period * 1.5)
		const pathes = {
			pathEStart: pathE.map(
				el => [el.endPoint[0], el.endPoint[1], modelSize] as TDots
			),
			pathEEnd: pathE.map(
				el => [el.endPoint[0], el.endPoint[1], -modelSize] as TDots
			),
			pathHStart: pathH.map(
				el => [el.endPoint[0], el.endPoint[1], modelSize] as TDots
			),
			pathHEnd: pathH.map(
				el => [el.endPoint[0], el.endPoint[1], -modelSize] as TDots
			)
		}
		setWavePath(pathes)
	}, [
		modelSize,
		settings,
		settings.initialPhaseX,
		settings.initialPhaseY,
		settings.amplitude,
		settings.period,
		stepBetweenVectors
	])
	if (!allVectors.allVectorsE.length && !allVectors.allVectorsH.length)
		return null
	return (
		<group>
			<WaveProjection pathE={wavePath?.pathEEnd} pathH={wavePath?.pathHEnd} />
			<Line
				points={allVectors.allVectorsE.flatMap(vector => Object.values(vector))}
				color={settings.colorE}
				lineWidth={2}
				segments
			/>
			<Line
				points={allVectors.allVectorsH.flatMap(vector => Object.values(vector))}
				color={settings.colorH}
				lineWidth={2}
				segments
			/>
			<WaveProjection
				pathE={wavePath?.pathEStart}
				pathH={wavePath?.pathHStart}
			/>
		</group>
	)
}

export default Wave
