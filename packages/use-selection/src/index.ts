import { useKeyStateRef } from '@hrpn/use-key-state';
import { useTrackingRefs } from '@hrpn/use-tracking-ref';
import { useState, useCallback } from 'react';

// Define TypeScript types for the states
type State = {
	selectedItems: number[];
	lastSelectedItemIndex: number | null;
};

// Define TypeScript type for the return value of the hook
type UseSelectionResult = {
	selectedItems: number[];
	selectItem: (index: number) => void;
};

const useSelection = (): UseSelectionResult => {
	const [state, setState] = useState<State>({
		selectedItems: [],
		lastSelectedItemIndex: null
	});

	const refs = useTrackingRefs({
		// Handle Ctrl (or Cmd) and Shift key press
		isModKeyPressed: useKeyStateRef(/Control|Meta/),
		isShiftKeyPressed: useKeyStateRef('Shift'),

		...state,
	});

	// Handle item selection based on modifiers (Ctrl, Shift) and previous selection
	const selectItem = useCallback((index: number) => {
		const { isModKeyPressed, isShiftKeyPressed, lastSelectedItemIndex, selectedItems } = refs.current;

		if (isModKeyPressed && isShiftKeyPressed && lastSelectedItemIndex !== null) {
			// If both Ctrl (or Cmd) and Shift keys are pressed, apply range selection and keep previous selections
			const minIndex = Math.min(index, lastSelectedItemIndex);
			const maxIndex = Math.max(index, lastSelectedItemIndex);
			const newSelection = Array.from({ length: maxIndex - minIndex + 1 }, (_, i) => minIndex + i);
			const updatedSelection = Array.from(new Set([...selectedItems, ...newSelection]));

			setState((prevState) => ({
				...prevState,
				selectedItems: updatedSelection,
			}));
		} else if (isModKeyPressed) {
			// If Ctrl (or Cmd) key is pressed, toggle selection of the item
			const selectedItemIndex = selectedItems.indexOf(index);
			if (selectedItemIndex !== -1) {
				setState((prevState) => ({
					...prevState,
					selectedItems: prevState.selectedItems.filter((_, i) => i !== selectedItemIndex),
				}));
			} else {
				setState((prevState) => ({
					...prevState,
					selectedItems: [...prevState.selectedItems, index],
				}));
			}
			setState((prevState) => ({ ...prevState, lastSelectedItemIndex: index }));
		} else if (isShiftKeyPressed && lastSelectedItemIndex !== null) {
			// If Shift key is pressed, select items between the last selected item and the current item
			const minIndex = Math.min(index, lastSelectedItemIndex);
			const maxIndex = Math.max(index, lastSelectedItemIndex);

			setState((prevState) => ({
				...prevState,
				selectedItems: Array.from({ length: maxIndex - minIndex + 1 }, (_, i) => minIndex + i),
			}));
		} else {
			// Select only the current item if no modifier keys are pressed
			setState((prevState) => ({
				...prevState,
				selectedItems: [index],
				lastSelectedItemIndex: index,
			}));
		}
	}, []);

	// Extract selectedItems and selectItem from the state and return them as the result
	const { selectedItems } = state;
	return { selectedItems, selectItem };
};

export default useSelection;
