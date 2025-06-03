import { Storage } from "@/storage";

export default function useMMKV<T>(key: string) {
  const mmkv = new Storage<[], Record<string, T>>({ id: key });

  const get = (key: string): T | undefined => {
    return mmkv.get([key]);
  };

  const set = (key: string, value: T): void => {
    mmkv.set([key], value);
  };

  const remove = (key: string): void => {
    mmkv.remove([key]);
  };

  return { get, set, remove };
}
