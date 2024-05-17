import { useGlobalControls } from "../store/globalControls"
import { useDebounce } from "./useDebounce"
import { folder, useControls, buttonGroup } from "leva"
import { useFilters } from "../store/filters"

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
	const debounceChangeProjectionLineWidth = useDebounce(
		(lineWidth: number) => setProjectionLineWidth(lineWidth),
		500
	)
	const debounceChangeProjectionColor = useDebounce(
		(color: string) => setProjectionColor(color),
		500
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
			value: 100,
			min: 50,
			max: 500,
			step: 1,
			onChange: (modelSize: number) => debounceChangeModelSize(modelSize),
			label: "Размер модели"
		},
		stepBetweenLines: {
			value: 1,
			min: 0.05,
			max: 5,
			step: 0.01,
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
			value: true,
			onChange: (nonPolarized: boolean) => debounceNonPolarized(nonPolarized)
		},
		[dictionary.projection]: folder({
			color: {
				value: "#ff004d",
				label: "Цвет",
				onChange: color => debounceChangeProjectionColor(color)
			},
			visible: {
				value: true,
				label: "Отображать",
				onChange: visible => debounceChangeProjectionVisible(visible)
			},
			lineWidth: {
				value: 4,
				min: 1,
				max: 10,
				step: 1,
				label: "Ширина линии",
				onChange: (lineWidth: number) =>
					debounceChangeProjectionLineWidth(lineWidth)
			}
		})
	}
	useControls(controls)
}
