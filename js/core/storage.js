export const storage = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    load(key) {
        try { return JSON.parse(localStorage.getItem(key)); }
        catch { return null; }
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
