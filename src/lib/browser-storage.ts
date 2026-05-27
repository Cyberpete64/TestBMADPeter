function getStorageValue(storage: Storage | undefined, key: string) {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function removeStorageValue(storage: Storage | undefined, key: string) {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Ignore browser storage restrictions and keep the app usable.
  }
}

export function readDurableClientItem(key: string) {
  return (
    getStorageValue(window.localStorage, key) ??
    getStorageValue(window.sessionStorage, key)
  );
}

export function writeDurableClientItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    removeStorageValue(window.sessionStorage, key);
  } catch {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Ignore browser storage restrictions and keep the in-memory UI usable.
    }
  }
}

export function removeDurableClientItem(key: string) {
  removeStorageValue(window.localStorage, key);
  removeStorageValue(window.sessionStorage, key);
}
