import { useState, FC, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import WavesModel from "./WavesModel/WavesModel"
import { useControls } from "leva"
import { useGlobalControls } from "../store/globalControls"
import { useDebounce } from "../hooks/useDebounce"
import { button, buttonGroup } from "leva"
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"

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
	const setModelSize = useGlobalControls(state => state.setModelSize)
	const setStepBetweenVectors = useGlobalControls(
		state => state.setStepBetweenVectors
	)
	const setAnimationDuration = useGlobalControls(
		state => state.setAnimationDuration
	)
	const debounceChangeModelSize = useDebounce(
		(size: number) => setModelSize(size),
		500
	)
	const debounceChangeStepBetweenLines = useDebounce(
		(step: number) => setStepBetweenVectors(step),
		500
	)
	const debounceChangeAnimationDuration = useDebounce(
		(duration: number) => setAnimationDuration(duration),
		500
	)
	const controls = {
		modelSize: {
			title: "World",
			value: 100,
			min: 50,
			max: 500,
			step: 1,
			onChange: (modelSize: number) => debounceChangeModelSize(modelSize),
			label: "Размер модели"
		},
		stepBetweenLines: {
			value: 0.7,
			min: 0.1,
			max: 10,
			step: 0.1,
			onChange: (steps: number) => debounceChangeStepBetweenLines(steps),
			label: "Расстоянние между векторами"
		},
		animationDuration: {
			value: 15,
			min: 5,
			max: 50,
			step: 1,
			onChange: (duration: number) => debounceChangeAnimationDuration(duration),
			label: "Продолжительность анимации"
		}
	}
	useControls(controls)

	return (
		<Canvas
			camera={{
				position: [modelSize + 30, 0, 0],
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
