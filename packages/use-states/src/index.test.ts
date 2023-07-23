import { renderHook, act } from '@testing-library/react-hooks';
import useStates from '.';

describe('useStates hook', () => {
	test('should initialize states correctly', () => {
		const initialState = {
			count: 0,
			name: 'John',
		};

		const { result } = renderHook(() => useStates(initialState));

		expect(result.current.count).toBe(0);
		expect(result.current.name).toBe('John');
	});

	test('should update states correctly', () => {
		const initialState = {
			count: 0,
			name: 'John',
		};

		const { result } = renderHook(() => useStates(initialState));

		act(() => {
			result.current.setCount(42);
			result.current.setName('Jane');
		});

		expect(result.current.count).toBe(42);
		expect(result.current.name).toBe('Jane');
	});

	test('should update states using a callback function', () => {
		const initialState = {
			count: 0,
		};

		const { result } = renderHook(() => useStates(initialState));

		act(() => {
			result.current.setCount((prevCount: number) => prevCount + 5);
		});

		expect(result.current.count).toBe(5);
	});
});
