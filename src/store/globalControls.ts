import { create } from "zustand"
import { devtools } from "zustand/middleware"
import {
	MODEL_SIZE_DEFAULT,
	STEP_BETWEEN_VECTORS_DEFAULT,
	ANIMATION_DURATION_DEFAULT,
	NON_POLARIZED_DEFAULT,
	PROJECTION_COLOR_DEFAULT,
	PROJECTION_LINE_DEFAULT,
	PROJECTION_VISIBLE_DEFAULT,
	ANIMATION_STARTED_DEFAULT
} from "../utils/consts"

interface IGlobalControls {
	modelSize: number
	setModelSize: (size: number) => void
	stepBetweenVectors: number
	setStepBetweenVectors: (steps: number) => void
	animationDuration: number
	setAnimationDuration: (duration: number) => void
	animationStarted: boolean
	setAnimationStarted: (started: boolean) => void
	nonPolarized: boolean
	setNonPolarized: (nonPolarized: boolean) => void

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
			modelSize: MODEL_SIZE_DEFAULT,
			stepBetweenVectors: STEP_BETWEEN_VECTORS_DEFAULT,
			setModelSize: modelSize => set({ modelSize }),
			setStepBetweenVectors: stepBetweenVectors => set({ stepBetweenVectors }),
			animationDuration: ANIMATION_DURATION_DEFAULT,
			setAnimationDuration: animationDuration => set({ animationDuration }),
			animationStarted: ANIMATION_STARTED_DEFAULT,
			setAnimationStarted: animationStarted => set({ animationStarted }),
			nonPolarized: NON_POLARIZED_DEFAULT,
			setNonPolarized: nonPolarized => set({ nonPolarized }),

			//Projections
			projectionColor: PROJECTION_COLOR_DEFAULT,
			setProjectionColor: projectionColor => set({ projectionColor }),
			projectionVisible: PROJECTION_VISIBLE_DEFAULT,
			setProjectionVisible: projectionVisible => set({ projectionVisible }),
			projectionLineWidth: PROJECTION_LINE_DEFAULT,
			setProjectionLineWidth: projectionLineWidth =>
				set({ projectionLineWidth })
		}),
		{ name: "global controls" }
	)
)
