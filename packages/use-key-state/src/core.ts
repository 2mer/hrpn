export type EventTarget = HTMLElement | Document | Window;
export type Key = string | RegExp

export function checkKey(key: Key | undefined, value: string) {
	if (!key) return false;
	if (typeof key === 'string') return key === value;
	return key.test(value);
}