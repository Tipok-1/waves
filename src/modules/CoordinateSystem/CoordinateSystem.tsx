import { useEffect, FC } from "react"
import { useThree } from "@react-three/fiber"
import { Text3D, Plane } from "@react-three/drei"
import * as THREE from "three"
import { MODEL_SIZE } from "../../utils/consts"

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
	const { scene } = useThree()
	useEffect(() => {
		const arrowPos = new THREE.Vector3(0, 0, 0)
		scene.add(
			new THREE.ArrowHelper(
				new THREE.Vector3(1, 0, 0),
				arrowPos,
				MODEL_SIZE / 4,
				"#E79FD2",
				1,
				1
			)
		)
		scene.add(
			new THREE.ArrowHelper(
				new THREE.Vector3(0, 1, 0),
				arrowPos,
				MODEL_SIZE / 4,
				"#80ffdb",
				1,
				1
			)
		)
		scene.add(
			new THREE.ArrowHelper(
				new THREE.Vector3(0, 0, 1),
				arrowPos,
				MODEL_SIZE,
				"#318CE7",
				1,
				1
			)
		)

		scene.add(
			new THREE.ArrowHelper(
				new THREE.Vector3(-1, 0, 0),
				arrowPos,
				MODEL_SIZE / 4,
				"#E79FD2",
				0,
				0
			)
		)
		scene.add(
			new THREE.ArrowHelper(
				new THREE.Vector3(0, -1, 0),
				arrowPos,
				MODEL_SIZE / 4,
				"#80ffdb",
				0,
				0
			)
		)
		scene.add(
			new THREE.ArrowHelper(
				new THREE.Vector3(0, 0, -1),
				arrowPos,
				MODEL_SIZE,
				"#318CE7",
				0,
				0
			)
		)
	}, [scene])
	return (
		<>
			<Text3D
				font="/fonts/font.json"
				position={[MODEL_SIZE / 4 + 2, 0, 0]}
				size={1}
			>
				X
				<meshMatcapMaterial color="#E79FD2" />
			</Text3D>
			<Text3D
				font="/fonts/font.json"
				position={[0, MODEL_SIZE / 4 + 2, 0]}
				size={1}
			>
				Y
				<meshMatcapMaterial color="#80ffdb" />
			</Text3D>
			<Text3D
				font="/fonts/font.json"
				position={[0, 0, MODEL_SIZE + 2]}
				size={1}
			>
				Z
				<meshMatcapMaterial color="#318CE7" />
			</Text3D>
			<AxesPlane
				direction={EAxesPlaneDirection.XY}
				size={MODEL_SIZE / 2}
				position={[0, 0, -MODEL_SIZE]}
				color="#6E7F80"
			/>
			<AxesPlane
				direction={EAxesPlaneDirection.XY}
				size={MODEL_SIZE / 2}
				position={[0, 0, MODEL_SIZE]}
				color="#6E7F80"
			/>
		</>
	)
}

export default CoordinateSystem
