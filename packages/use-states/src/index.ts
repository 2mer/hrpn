import React, { useState } from 'react';

// 🛠️ Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// 📦 Define types to represent the state object and its setter functions
type States<T> = {
	[K in keyof T]: T[K];
};

type StateSetters<T> = {
	[K in keyof T as `set${Capitalize<string & K>}`]: React.Dispatch<React.SetStateAction<T[K]>>;
};

// 🔗 Combine state object and setter functions types into a single type
type UseStates<T> = States<T> & StateSetters<T>;

// 🎣 Custom hook to handle multiple states and their setter functions
function useStates<T extends Record<string, any>>(
	initialStates: T,
	deps: any[] = []
): UseStates<T> {
	// 🎈 Create the state object and its setter function using useState
	const [states, setStates] = useState(initialStates);

	// 🚀 Create memoized state setter functions for each state property
	const stateSetters: StateSetters<T> = React.useMemo(() => {
		const setStateForKey = (key: keyof T) => (valueOrCallback: any) => {
			setStates((prevStates) => {
				// 🎯 Allow setting state based on the previous state using callback function
				const newState =
					typeof valueOrCallback === 'function'
						? valueOrCallback(prevStates[key])
						: valueOrCallback;
				return { ...prevStates, [key]: newState };
			});
		};

		return Object.keys(initialStates).reduce((acc, key) => {
			// 🌟 Capitalize the key for generating the setter function name
			const capitalizedKey = capitalizeFirstLetter(key);

			(acc as any)[`set${capitalizedKey}` as keyof StateSetters<T>] = setStateForKey(
				key as keyof T
			);

			return acc;
		}, {} as StateSetters<T>);
	}, deps);

	// 🔗 Combine the state object and its setter functions and return them as a single object
	return { ...states, ...stateSetters };
}

export default useStates;
