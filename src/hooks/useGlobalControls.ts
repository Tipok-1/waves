import { useGlobalControls } from "../store/globalControls"
import { useDebounce } from "./useDebounce"
import { folder, useControls, buttonGroup } from "leva"
import { useFilters } from "../store/filters"
import {
	MODEL_SIZE_MIN,
	MODEL_SIZE_MAX,
	MODEL_SIZE_DEFAULT,
	STEP_BETWEEN_VECTORS_DEFAULT,
	STEP_BETWEEN_VECTORS_MAX,
	STEP_BETWEEN_VECTORS_MIN,
	ANIMATION_DURATION_DEFAULT,
	ANIMATION_DURATION_MAX,
	ANIMATION_DURATION_MIN,
	NON_POLARIZED_DEFAULT,
	PROJECTION_COLOR_DEFAULT,
	PROJECTION_VISIBLE_DEFAULT,
	PROJECTION_LINE_DEFAULT,
	PROJECTION_LINE_MAX,
	PROJECTION_LINE_MIN
} from "../utils/consts"

const dictionary = {
	circular: "Круговой",
	linear: "Линейный",
	remove: "X",
	projection: "Проекция волны на плоскость XY"
}

export function useGlobalControlsHook() {
	const setModelSize = useGlobalControls(state => state.setModelSize)
	const setStepBetweenVectors = useGlobalControls(
		state => state.setStepBetweenVectors
	)
	const setAnimationDuration = useGlobalControls(
		state => state.setAnimationDuration
	)
	const setProjectionLineWidth = useGlobalControls(
		state => state.setProjectionLineWidth
	)
	const setProjectionColor = useGlobalControls(
		state => state.setProjectionColor
	)
	const setProjectionVisible = useGlobalControls(
		state => state.setProjectionVisible
	)
	const setNonPolarized = useGlobalControls(state => state.setNonPolarized)

	const debounceChangeModelSize = useDebounce(
		(size: number) => setModelSize(size),
		300
	)
	const debounceChangeStepBetweenLines = useDebounce(
		(step: number) => setStepBetweenVectors(step),
		300
	)
	const debounceChangeAnimationDuration = useDebounce(
		(duration: number) => setAnimationDuration(duration),
		300
	)
	const debounceChangeProjectionLineWidth = useDebounce(
		(lineWidth: number) => setProjectionLineWidth(lineWidth),
		300
	)
	const debounceChangeProjectionColor = useDebounce(
		(color: string) => setProjectionColor(color),
		300
	)

	const debounceChangeProjectionVisible = useDebounce(
		(visible: boolean) => setProjectionVisible(visible),
		100
	)
	const debounceNonPolarized = useDebounce(
		(visible: boolean) => setNonPolarized(visible),
		100
	)

	const setCurrentFilter = useFilters(state => state.setCurrentFilter)
	const controls = {
		modelSize: {
			title: "World",
			value: MODEL_SIZE_DEFAULT,
			min: MODEL_SIZE_MIN,
			max: MODEL_SIZE_MAX,
			step: 1,
			onChange: (modelSize: number) => debounceChangeModelSize(modelSize),
			label: "Размер модели"
		},
		stepBetweenLines: {
			value: STEP_BETWEEN_VECTORS_DEFAULT,
			min: STEP_BETWEEN_VECTORS_MIN,
			max: STEP_BETWEEN_VECTORS_MAX,
			step: 0.01,
			onChange: (steps: number) => debounceChangeStepBetweenLines(steps),
			label: "Расстоянние между векторами"
		},
		animationDuration: {
			value: ANIMATION_DURATION_DEFAULT,
			min: ANIMATION_DURATION_MIN,
			max: ANIMATION_DURATION_MAX,
			step: 1,
			onChange: (duration: number) => debounceChangeAnimationDuration(duration),
			label: "Продолжительность анимации"
		},
		filters: buttonGroup({
			label: "Фильтры",
			opts: {
				[dictionary.circular]: () => setCurrentFilter("circular"),
				[dictionary.linear]: () => setCurrentFilter("linear"),
				[dictionary.remove]: () => setCurrentFilter(null)
			}
		}),
		nonPolarized: {
			label: "Неполяризованнная волна",
			value: NON_POLARIZED_DEFAULT,
			onChange: (nonPolarized: boolean) => debounceNonPolarized(nonPolarized)
		},
		[dictionary.projection]: folder({
			color: {
				value: PROJECTION_COLOR_DEFAULT,
				label: "Цвет",
				onChange: color => debounceChangeProjectionColor(color)
			},
			visible: {
				value: PROJECTION_VISIBLE_DEFAULT,
				label: "Отображать",
				onChange: visible => debounceChangeProjectionVisible(visible)
			},
			lineWidth: {
				value: PROJECTION_LINE_DEFAULT,
				min: PROJECTION_LINE_MIN,
				max: PROJECTION_LINE_MAX,
				step: 1,
				label: "Ширина линии",
				onChange: (lineWidth: number) =>
					debounceChangeProjectionLineWidth(lineWidth)
			}
		})
	}
	useControls(controls)
}
