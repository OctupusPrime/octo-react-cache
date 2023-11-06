import {
  createCacheStoragePresistor,
  ContextProvider,
} from "@/modules/react-cache";
import type { DBSchema } from "@/modules/react-cache/types";

import { IDBInstance, initStorage } from "./idbCacheStorage";

export interface MyDb extends DBSchema {
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

const presistor = createCacheStoragePresistor<IDBInstance, MyDb>(initStorage, {
  get: (db, storageName, keyName, keyValue) => {
    return db.get(storageName as any, keyValue);
  },
  add: async (db, storageName, item) => {
    return await db.add(storageName as any, item);
  },
  update: async (db, storageName, keyName, keyValue, value) => {
    const item = await db.get(storageName as any, keyValue);

    if (!item) throw new Error("item to update dont exist");

    const updatedItem = {
      ...item,
      ...value,
    };

    await db.put(storageName as any, updatedItem);

    return updatedItem;
  },
  delete: async (db, storageName, keyName, keyValue) => {
    await db.delete(storageName as any, keyValue);
    return;
  },
});

const { useCache, CacheProvider } = ContextProvider.generateCacheProvider({
  presistor,
});

export { useCache, CacheProvider };
