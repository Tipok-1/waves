import TreeScene from "./modules/TreeScene"
import { Leva } from "leva"

function App() {
	return (
		<>
			<div
				style={{
					width: 380,
					backgroundColor: "inherit",
					position: "absolute",
					right: 0,
					top: 0,
					zIndex: 100
				}}
			>
				<Leva fill />
			</div>
			<TreeScene />
		</>
	)
}

export default App
