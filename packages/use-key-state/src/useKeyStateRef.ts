import { useRef } from 'react';
import { useKeyStateEvent } from './useKeyStateEvent';
import { Key, EventTarget } from './core';

type Sig1 = [key?: Key];
type Sig2 = [target?: EventTarget, key?: Key];

export type UseKeyStateRefOptions =
	| Sig1
	| Sig2

// 🔄 Helper function to parse arguments and return standardized options.
function parseArgs(...args: UseKeyStateRefOptions) {
	if (typeof args[0] === 'string') {
		const [key] = args as Sig1

		return { target: document, key };
	}

	const [target, key] = args as Sig2;

	return { target, key };
}

export function useKeyStateRef(...args: UseKeyStateRefOptions) {
	const { key, target } = parseArgs(...args);

	const downRef = useRef(false);

	useKeyStateEvent(target, key, (isDown) => {
		downRef.current = isDown
	})

	return downRef;
};
