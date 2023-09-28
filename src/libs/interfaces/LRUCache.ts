
class LRUCache {
    private size: number;
    private cache: Map<number, number>;

    constructor(size: number) {
        this.size = size || 3;
        this.cache = new Map();
    }

    put(key: number, val: number) {
        const hasKey = this.cache.has(key);
        if (hasKey) {
            this.cache.delete(key);
        }
        this.cache.set(key, val);

        // Remove the least used items;
        if (this.cache.size > this.size) {
            // [1, 2, 3] next() 1, next() 2, next() 3
            this.cache.delete(this.cache.keys().next().value);
        }
        return true;
    }

    get(key: number) {
        const hasKey = this.cache.has(key);
        if (hasKey) {
            const val = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, val);
            return val;
        }

        return -1;
    }

    items() {
        return this.cache.entries();
    }
}

// const cache = new LRUCache(3);
// cache.put(1, 1);
// cache.put(2, 2);
// cache.put(3, 3);
// cache.items();

// cache.get(1);
// cache.items();

// cache.get(3);
// cache.items();

// cache.put(4, 4);
// cache.items();
