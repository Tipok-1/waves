import { Canvas } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import WavesModel from "./WavesModel/WavesModel"
import { useControls, button } from "leva"
import { useGlobalControls } from "../store/globalControls"
import { useGlobalControlsHook } from "../hooks/useGlobalControls"

const PauseButton = () => {
	const setAnimationStarted = useGlobalControls(
		state => state.setAnimationStarted
	)
	const animationStarted = useGlobalControls(state => state.animationStarted)
	useControls(
		{
			[animationStarted ? "Приостановить анимацию" : "Запустить анимацию"]:
				button(() => setAnimationStarted(!animationStarted))
		},
		[animationStarted]
	)
	return <></>
}
const TreeScene = () => {
	const modelSize = useGlobalControls(state => state.modelSize)
	useGlobalControlsHook()

	return (
		<Canvas
			camera={{
				position: [-modelSize - 30, 0, 0],
				far: 2000
			}}
		>
			<ambientLight />
			<CameraControls />
			<WavesModel />
			<PauseButton />
		</Canvas>
	)
}

export default TreeScene
