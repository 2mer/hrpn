import { useState } from 'react';
import { useKeyStateEvent } from './useKeyStateEvent';
import { Key, EventTarget } from './core';

type Sig1 = [key?: Key];
type Sig2 = [target?: EventTarget, key?: Key];

export type UseKeyStateOptions =
	| Sig1
	| Sig2

// 🔄 Helper function to parse arguments and return standardized options.
function parseArgs(...args: UseKeyStateOptions) {
	if (typeof args[0] === 'string') {
		const [key] = args as Sig1

		return { target: document, key };
	}

	const [target, key] = args as Sig2;

	return { target, key };
}

export function useKeyState(...args: UseKeyStateOptions) {
	const { key, target } = parseArgs(...args);

	const [down, setDown] = useState(false);

	useKeyStateEvent(target, key, (isDown) => {
		setDown(isDown)
	})

	return down;
};
