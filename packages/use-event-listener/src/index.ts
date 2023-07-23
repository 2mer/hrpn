// 🔌 Import necessary hooks from React.
import { useEffect, useRef } from 'react';

// 👇 Define types for the event callback and different function signatures.
type EventCallback<T extends Event> = (event: T) => void;

type Sig1<T extends Event> = [event?: string, callback?: EventCallback<T>];
type Sig2<T extends Event> = [target?: HTMLElement | Document | Window, event?: string, callback?: EventCallback<T>]

type UseEventListenerParams<T extends Event> =
	| Sig1<T>
	| Sig2<T>

// 🔄 Helper function to parse arguments and return standardized options.
function parseArgs<T extends Event>(...args: UseEventListenerParams<T>) {
	if (typeof args[0] === 'string') {
		const [event, callback] = args as Sig1<T>

		return { target: document, event, callback };
	}

	const [target, event, callback] = args as Sig2<T>;

	return { target, event, callback };
}

// 🎉 Custom hook to attach an event listener to the given target element.
function useEventListener<T extends Event = Event>(
	...args: UseEventListenerParams<T>
): void {
	const optionsRef = useRef(parseArgs(...args));

	useEffect(() => {
		const { target, callback, event } = optionsRef.current;

		// ❌ If either target or callback is missing, return early.
		if (!target || !callback || !event) return;

		// 👂 Define the event listener function.
		const eventListener = (event: T) => {
			if (optionsRef.current.callback) {
				optionsRef.current.callback(event);
			}
		};

		// 📌 Add the event listener to the target element.
		target.addEventListener(event, eventListener as EventListener);

		// 🚀 Clean up the event listener when the component unmounts.
		return () => {
			target.removeEventListener(event, eventListener as EventListener);
		};
	}, [
		Boolean(optionsRef.current.target),
		Boolean(optionsRef.current.callback),
		Boolean(optionsRef.current.event),
	]);
}

// 📦 Export the custom hook for use in other components.
export { useEventListener };
