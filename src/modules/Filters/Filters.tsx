import { useGlobalControls } from "../../store/globalControls"
import { useFilters } from "../../store/filters"

const Filters = () => {
	const currentFilter = useFilters(state => state.currentFilter)
	const modelSize = useGlobalControls(state => state.modelSize)
	if (!currentFilter) return null
	return (
		<mesh rotation={[Math.PI / 2, 0, 0]}>
			<cylinderGeometry args={[modelSize / 3, modelSize / 3, 1, 64, 64]} />
			<meshPhysicalMaterial roughness={0} metalness={0} transmission={0.5} />
		</mesh>
	)
}
export default Filters
