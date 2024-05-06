import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface IGlobalControls {
	modelSize: number
	setModelSize: (size: number) => void
	stepBetweenVectors: number
	setStepBetweenVectors: (steps: number) => void
	animationDuration: number
	setAnimationDuration: (duration: number) => void
	animationStarted: boolean
	setAnimationStarted: (started: boolean) => void
}
export const useGlobalControls = create<IGlobalControls>()(
	devtools(
		set => ({
			modelSize: 100,
			stepBetweenVectors: 0.7,
			setModelSize: modelSize => set({ modelSize }),
			setStepBetweenVectors: stepBetweenVectors => set({ stepBetweenVectors }),
			animationDuration: 10,
			setAnimationDuration: animationDuration => set({ animationDuration }),
			animationStarted: true,
			setAnimationStarted: animationStarted => set({ animationStarted })
		}),
		{ name: "global controls" }
	)
)
