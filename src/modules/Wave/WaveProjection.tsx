import { FC, memo } from "react"
import type { TDots } from "./Wave"
import { Line } from "@react-three/drei"
import { useGlobalControls } from "../../store/globalControls"

interface IWaveProjection {
	pathE?: TDots[]
	pathH?: TDots[]
}
const WaveProjection: FC<IWaveProjection> = ({ pathE, pathH }) => {
	const projectionColor = useGlobalControls(state => state.projectionColor)
	const projectionLineWidth = useGlobalControls(
		state => state.projectionLineWidth
	)
	const projectionVisible = useGlobalControls(state => state.projectionVisible)
	console.log("render path")
	if (!projectionVisible) return null
	return (
		<>
			{pathE && (
				<Line
					points={pathE}
					color={projectionColor}
					lineWidth={projectionLineWidth}
				/>
			)}
			{pathH && (
				<Line
					points={pathH}
					color={projectionColor}
					lineWidth={projectionLineWidth}
				/>
			)}
		</>
	)
}

export default memo(WaveProjection)
