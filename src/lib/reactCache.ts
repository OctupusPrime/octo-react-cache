import {
  type CacheTimeStorageSchema,
  type TableStorageSchema,
  createKeyBasedStorage,
  createTableBasedStorage,
  generateContextProvider,
  LocalStorageProvider,
  IndexDBStorageProvider,
} from "@/modules/react-cache";

import { type IDBInstance, initIdbStorage } from "./idbCacheStorage";

export interface CacheStorage extends TableStorageSchema {
  articles: {
    title: string;
    date: Date;
    body: string;
    id: number;
  };
  articles2: {
    title: number;
  };
}

const cacheStorage = createTableBasedStorage<IDBInstance, CacheStorage>(
  initIdbStorage,
  IndexDBStorageProvider.createTableBasedStorageMethods()
);

const cacheTimeStorage = createKeyBasedStorage<Storage, CacheTimeStorageSchema>(
  async () => localStorage,
  LocalStorageProvider.createKeyBasedStorageMethods("cache-items-time")
);

const { useCache, CacheProvider } = generateContextProvider({
  presistor: {
    storage: cacheStorage,
    cacheTimeStorage,
  },
});

export { useCache, CacheProvider };
