export const getStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    console.error("Error parsing localStorage item", key, e);
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error setting localStorage item", key, e);
  }
};