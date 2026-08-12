import AsyncStorage from '@react-native-async-storage/async-storage';

async function get<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function set<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

async function clearKeys(keys: string[]): Promise<void> {
  try {
    await Promise.all(keys.map(k => AsyncStorage.removeItem(k)));
  } catch {}
}

const storage = {get, set, remove, clearKeys};
export default storage;
