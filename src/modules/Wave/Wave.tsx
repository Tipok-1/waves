import { FC, useState, useRef } from "react"
import { MODEL_SIZE, STEP_BETWEEN_VECTORS } from "../../utils/consts"
import { useSpring } from "@react-spring/web"
import { Line } from "@react-three/drei"

enum EPolarizationType {
	CIRCULAR = "circular",
	ELLIPTICAL = "elliptical",
	LINEAR = "linear"
}
interface IWave {
	polarizationType?: EPolarizationType
}
enum EFieldType {
	ELECTRIC = "ELECTRIC",
	MAGNETIC = "MAGNETIC"
}
interface IVectorProps {
	time: number
	Z: number
	X0?: number
	Y0?: number
	field?: EFieldType
}

interface IWaveSettings {
	amplitude: number
	period: number
	speed: number
	initialPhaseX: number
	initialPhaseY: number
}
const waveSettings: Record<EFieldType, IWaveSettings> = {
	MAGNETIC: {
		period: MODEL_SIZE / 2,
		speed: 1,
		amplitude: MODEL_SIZE / 4,
		initialPhaseX: Math.PI / 2,
		initialPhaseY: Math.PI
	},
	ELECTRIC: {
		period: MODEL_SIZE / 2,
		speed: 1,
		amplitude: MODEL_SIZE / 4,
		initialPhaseX: 1.5 * Math.PI,
		initialPhaseY: 2 * Math.PI
	}
}

const ANIMATION_SPEED = 10

interface IVector {
	startPoint: [number, number, number]
	endPoint: [number, number, number]
}
type renderVectorFn = (props: IVectorProps) => IVector

const renderVector: renderVectorFn = ({
	field = EFieldType.ELECTRIC,
	time,
	Z
}) => {
	let tensionX = null
	let tensionY = null
	const amplitude = waveSettings[field].amplitude //Амплитуда волны
	const initialPhaseX = waveSettings[field].initialPhaseX //Начальная фаза x
	const initialPhaseY = waveSettings[field].initialPhaseY //Начальная фаза y
	const speed = waveSettings[field].speed // Скорость распространения волны
	const period = waveSettings[field].period // Период волны

	const wavelength = speed * period //Длина волны
	const w = (2 * Math.PI) / period //Круговая частота
	const k = (2 * Math.PI) / wavelength //Волновое число

	const cosineArgument_X = w * time - k * Z + initialPhaseX
	tensionX = amplitude * Math.cos(cosineArgument_X) //Напряжённость по оси X

	const cosineArgument_Y = w * time - k * Z + initialPhaseY
	tensionY = amplitude * Math.cos(cosineArgument_Y) //Напряжённость по оси Y

	let θ_Y = Math.atan(tensionX / tensionY) // Угол наклона от оси Y

	const endX = tensionX //* Math.cos(θ_X) //Конечная координата X вектора напряжённости
	const endY = tensionY * Math.cos(θ_Y) //Конечная координата Y вектора напряжённости
	if (endY === 0) console.log(endY)
	return {
		startPoint: [0, 0, Z],
		endPoint: [endX, endY, Z]
	}
}

const animate = (time: number) => {
	const allVectorsE: IVector[] = []
	const allVectorsH: IVector[] = []
	for (let Z = -MODEL_SIZE; Z < MODEL_SIZE; Z += STEP_BETWEEN_VECTORS) {
		const obj = { time: +time.toFixed(3), Z, field: EFieldType.ELECTRIC }
		const coords = renderVector(obj)
		allVectorsE.push(coords)
		const coords2 = renderVector({
			time: +time.toFixed(3),
			Z,
			field: EFieldType.MAGNETIC
		})
		allVectorsH.push(coords2)
	}
	console.log(allVectorsH)

	return { allVectorsE, allVectorsH }
}

export interface IVectors {
	allVectorsE: IVector[]
	allVectorsH: IVector[]
}
const Wave: FC<IWave> = () => {
	const lastTime = useRef<number | null>(null)
	const [allVectors, setAllVectors] = useState<IVectors>({
		allVectorsE: [],
		allVectorsH: []
	})
	useSpring({
		time: 100,
		from: { time: 0 },
		config: { duration: ANIMATION_SPEED * 1000 },
		loop: true,
		onChange: ({ value: { time } }) => {
			if (lastTime.current === null || Math.trunc(time) !== lastTime.current) {
				const vectors = animate(time)
				console.log(time)
				setAllVectors(vectors)
				lastTime.current = Math.trunc(time)
			}
		}
	})
	if (!allVectors.allVectorsE.length && !allVectors.allVectorsH.length)
		return null
	return (
		<group>
			<Line
				points={allVectors.allVectorsE.flatMap(vector => Object.values(vector))}
				color={"yellow"}
				lineWidth={2}
				segments
			/>
			<Line
				points={allVectors.allVectorsH.flatMap(vector => Object.values(vector))}
				color={"blue"}
				lineWidth={2}
				segments
			/>
		</group>
	)
}

export default Wave
