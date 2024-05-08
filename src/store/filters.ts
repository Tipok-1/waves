import { create } from "zustand"
import { devtools } from "zustand/middleware"

type TFilterVariant = "linear" | "circular" //| "elliptical"
interface IFilters {
	currentFilter: TFilterVariant | null
	setCurrentFilter: (filter: TFilterVariant | null) => void
}

export const useFilters = create<IFilters>()(
	devtools(
		set => ({
			currentFilter: null,
			setCurrentFilter: currentFilter => set({ currentFilter })
		}),
		{ name: "filters" }
	)
)
