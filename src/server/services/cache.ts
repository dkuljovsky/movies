const MS_TTL = 30 * 60 * 1000; // 30 minutes

class Cache {
  private cache: Map<string, { value: any; createdAt: number }> = new Map();

  store(key: string, value: any) {
    const now = new Date().getTime();

    this.cache.set(key, { value, createdAt: now });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    return item.value;
  }

  clearExpired() {
    const now = new Date().getTime();
    for (const [key, item] of this.cache.entries()) {
      // check if item is 30 minutes old or less
      const isExpired = item.createdAt + MS_TTL < now;

      if (isExpired) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new Cache();

export default cache;
