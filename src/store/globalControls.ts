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

	//Projections
	projectionColor: string
	setProjectionColor: (color: string) => void
	projectionVisible: boolean
	setProjectionVisible: (visible: boolean) => void
	projectionLineWidth: number
	setProjectionLineWidth: (width: number) => void
}
export const useGlobalControls = create<IGlobalControls>()(
	devtools(
		set => ({
			modelSize: 100,
			stepBetweenVectors: 1,
			setModelSize: modelSize => set({ modelSize }),
			setStepBetweenVectors: stepBetweenVectors => set({ stepBetweenVectors }),
			animationDuration: 10,
			setAnimationDuration: animationDuration => set({ animationDuration }),
			animationStarted: true,
			setAnimationStarted: animationStarted => set({ animationStarted }),

			//Projections
			projectionColor: "#ff6000",
			setProjectionColor: projectionColor => set({ projectionColor }),
			projectionVisible: true,
			setProjectionVisible: projectionVisible => set({ projectionVisible }),
			projectionLineWidth: 6,
			setProjectionLineWidth: projectionLineWidth =>
				set({ projectionLineWidth })
		}),
		{ name: "global controls" }
	)
)
