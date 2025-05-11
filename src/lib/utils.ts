export function debounce(func: () => void, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<typeof func>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
