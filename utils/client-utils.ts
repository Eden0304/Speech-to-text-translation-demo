export const getLocalStorageItem = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    return item !== null ? item : defaultValue
  } catch (error) {
    console.error(`Error getting item from localStorage for key "${key}":`, error)
    return defaultValue
  }
}

export const setLocalStorageItem = (key: string, value: any) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Error setting item in localStorage for key "${key}":`, error)
  }
}
