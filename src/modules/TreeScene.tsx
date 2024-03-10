import { Canvas } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import WavesModel from "./WavesModel/WavesModel"
import { MODEL_SIZE } from "../utils/consts"

const TreeScene = () => {
	return (
		<Canvas
			camera={{
				position: [MODEL_SIZE, MODEL_SIZE - 20, MODEL_SIZE + 30],
				far: 2000
			}}
		>
			<ambientLight />
			<CameraControls />
			<WavesModel />
		</Canvas>
	)
}

export default TreeScene
