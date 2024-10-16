
type Fn = (...args: any[]) => any;

const memoize = (fn: Fn) => {
    const cache = new Map<string, any>();

    return (...args: any[]) => {

        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);

        cache.set(key, result);
        
        return result;
    };
};


class twHelper {
    /* 
     * Tailwind Helper
     */
    static Before = memoize((cn: string): string => {
        return cn.split(' ').map(className => `before:${className}`).join(' ');
    })
    static After = memoize((cn: string): string => {
        return cn.split(' ').map(className => `after:${className}`).join(' ');
    })
    static Hover = memoize((cn: string): string => {
        return cn.split(' ').map(className => `hover:${className}`).join(' ');
    })
    static Screen = memoize((breakPoint: string, cn: string): string => {
        return cn.split(' ').map(className => `${breakPoint}:${className}`).join(' ');
    })
}