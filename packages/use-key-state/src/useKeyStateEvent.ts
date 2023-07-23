import { useEventListener } from '@hrpn/use-event-listener';
import { useTrackingRef } from '@hrpn/use-tracking-ref';
import { EventTarget, Key, checkKey } from './core';

type KeyStateHandler = (isKeyDown: boolean) => void;

type Sig1 = [key?: Key, callback?: KeyStateHandler];
type Sig2 = [target?: EventTarget, key?: Key, callback?: KeyStateHandler];

export type UseKeyStateEventOptions =
	| Sig1
	| Sig2

// 🔄 Helper function to parse arguments and return standardized options.
function parseArgs(...args: UseKeyStateEventOptions) {
	if (typeof args[0] === 'string') {
		const [key, callback] = args as Sig1

		return { target: document, key, callback };
	}

	const [target, key, callback] = args as Sig2;

	return { target, key, callback };
}

export function useKeyStateEvent(...args: UseKeyStateEventOptions) {
	const optionsRef = useTrackingRef(parseArgs(...args))

	const enabled = Boolean(optionsRef.current.key && optionsRef.current.callback && optionsRef.current.target);

	const ifEnabled = <T,>(value: T) => enabled ? value : undefined

	useEventListener<KeyboardEvent>(optionsRef.current.target, 'keydown', ifEnabled((e) => {
		const { callback, key } = optionsRef.current;
		if (callback && checkKey(key, e.key)) {
			callback(true);
		}
	}));

	useEventListener<KeyboardEvent>(optionsRef.current.target, 'keyup', ifEnabled((e) => {
		const { callback, key } = optionsRef.current;
		if (callback && checkKey(key, e.key)) {
			callback(false);
		}
	}));
}
