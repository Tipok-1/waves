import { FC } from "react"
import { Text3D, Plane } from "@react-three/drei"
import * as THREE from "three"
import { useGlobalControls } from "../../store/globalControls"
import Filters from "../Filters/Filters"
import font from "./font.json"

enum EAxesPlaneDirection {
	XY = "XY",
	XZ = "XZ",
	ZY = "ZY"
}
interface IAxesPlane {
	direction: EAxesPlaneDirection
	size: number
	color?: string
	position?: [number, number, number]
}
const rotation: Record<EAxesPlaneDirection, [number, number, number]> = {
	XY: [0, 0, 0],
	XZ: [1.5 * Math.PI, 0, 0],
	ZY: [0, Math.PI / 2, 0]
}
const AxesPlane: FC<IAxesPlane> = ({ direction, size, color, position }) => {
	return (
		<Plane
			args={[size, size, size, size]}
			rotation={rotation[direction]}
			position={position || [0, 0, 0]}
		>
			<meshBasicMaterial color={color || "pink"} wireframe />
		</Plane>
	)
}

const CoordinateSystem = () => {
	const modelSize = useGlobalControls(state => state.modelSize)
	return (
		<>
			<Text3D font={font as any} position={[modelSize / 4 + 2, 0, 0]} size={1}>
				X
				<meshMatcapMaterial color="#E79FD2" />
			</Text3D>
			<Text3D font={font as any} position={[0, modelSize / 4 + 2, 0]} size={1}>
				Y
				<meshMatcapMaterial color="#80ffdb" />
			</Text3D>
			<Text3D font={font as any} position={[0, 0, modelSize + 2]} size={1}>
				Z
				<meshMatcapMaterial color="#318CE7" />
			</Text3D>
			<AxesPlane
				direction={EAxesPlaneDirection.XY}
				size={modelSize / 2}
				position={[0, 0, -modelSize]}
				color="#6E7F80"
			/>
			<AxesPlane
				direction={EAxesPlaneDirection.XY}
				size={modelSize / 2}
				position={[0, 0, modelSize]}
				color="#6E7F80"
			/>
			<Filters />
			<arrowHelper
				args={[
					new THREE.Vector3(1, 0, 0),
					new THREE.Vector3(0, 0, 0),
					modelSize / 4,
					"#E79FD2",
					1,
					1
				]}
			/>
			<arrowHelper
				args={[
					new THREE.Vector3(0, 1, 0),
					new THREE.Vector3(0, 0, 0),
					modelSize / 4,
					"#80ffdb",
					1,
					1
				]}
			/>
			<arrowHelper
				args={[
					new THREE.Vector3(0, 0, 1),
					new THREE.Vector3(0, 0, 0),
					modelSize,
					"#318CE7",
					1,
					1
				]}
			/>
			<arrowHelper
				args={[
					new THREE.Vector3(-1, 0, 0),
					new THREE.Vector3(0, 0, 0),
					modelSize / 4,
					"#E79FD2",
					0,
					0
				]}
			/>
			<arrowHelper
				args={[
					new THREE.Vector3(0, -1, 0),
					new THREE.Vector3(0, 0, 0),
					modelSize / 4,
					"#80ffdb",
					0,
					0
				]}
			/>
			<arrowHelper
				args={[
					new THREE.Vector3(0, 0, -1),
					new THREE.Vector3(0, 0, 0),
					modelSize,
					"#318CE7",
					0,
					0
				]}
			/>
		</>
	)
}

export default CoordinateSystem
