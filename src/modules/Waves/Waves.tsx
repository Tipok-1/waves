import { useEffect, useState } from "react"
import { useFilters } from "../../store/filters"
import Wave from "../Wave/Wave"
import { useWaveControls } from "../../hooks/useWaveControls"
import type { IWaveSettings } from "../../hooks/useWaveControls"

const getRotationDirection = (xPhase: number, yPhase: number) =>
	xPhase > yPhase ? true : false
const Waves = () => {
	const currentFilter = useFilters(state => state.currentFilter)
	const settings = useWaveControls({
		waveName: "Волна"
	})
	const [fixedPhase, setFixedPhase] = useState<IWaveSettings>(settings)
	useEffect(() => {
		switch (currentFilter) {
			case "circular":
				setFixedPhase({
					...settings,
					initialPhaseX: getRotationDirection(
						settings.initialPhaseX,
						settings.initialPhaseY
					)
						? Math.PI / 2
						: 0,
					initialPhaseY: getRotationDirection(
						settings.initialPhaseX,
						settings.initialPhaseY
					)
						? 0
						: Math.PI / 2
				})
				break

			case "linear":
				setFixedPhase({
					...settings,
					initialPhaseX: 0,
					initialPhaseY: 0
				})
				break
		}
	}, [settings, currentFilter])
	const renderWaveWithFilter = () => {
		console.log(fixedPhase)
		if (currentFilter === "circular") {
			return (
				<>
					<Wave settings={settings} side="left" />
					<Wave settings={fixedPhase} side="right" />
				</>
			)
		} else if (currentFilter === "linear") {
			return (
				<>
					<Wave settings={settings} side="left" />
					<Wave settings={fixedPhase} side="right" />
				</>
			)
		}

		return <Wave settings={settings} />
	}
	return (
		<>
			{!currentFilter && <Wave settings={settings} />}
			{currentFilter && renderWaveWithFilter()}
		</>
	)
}

export default Waves
