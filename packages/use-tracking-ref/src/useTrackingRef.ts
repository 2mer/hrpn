import { useRef } from "react"

export function useTrackingRef<T = unknown>(value: T) {
	const ref = useRef(value);

	ref.current = value;

	return ref;
}