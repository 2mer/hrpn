import { MutableRefObject, useRef } from "react";

export type RefRecord = Record<string, MutableRefObject<any> | any>;
export type AggregateRefValue<T extends RefRecord> = { [key in keyof T]: T[key] extends MutableRefObject<any> ? T[key]['current'] : T[key] }

export function useTrackingRefs<T extends RefRecord>(refs: T) {

	const aggRef = useRef<AggregateRefValue<T>>({} as any);

	Object.entries(refs).forEach(([key, ref]) => {
		(aggRef.current as any)[key] = ('current' in ref && typeof ref === 'object') ? ref.current : ref;
	})

	return aggRef;
}