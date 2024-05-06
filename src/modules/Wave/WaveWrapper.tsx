import { FC } from "react"
import Wave from "./Wave"
import { useWaveControls } from "../../hooks/useWaveControls"

interface IWaveName {
	waveName?: string
}
const WaveWrapper: FC<IWaveName> = ({ waveName }) => {
	const settings = useWaveControls({
		waveName: waveName || "Волна"
	})
	return <Wave settings={settings} />
}

export default WaveWrapper
