import type { IDBPDatabase } from "idb";
import type {
  CreateKeyStorageMethods,
  CreateTableStorageMethods,
} from "../storage/types";

export const createTableBasedStorageMethods = (): CreateTableStorageMethods<
  IDBPDatabase<any>
> => ({
  get: (db, storageName, _keyName, keyValue) => {
    return db.get(storageName as any, keyValue);
  },
  add: async (db, storageName, item) => {
    return await db.add(storageName as any, item);
  },
  update: async (db, storageName, _keyName, keyValue, value) => {
    const item = await db.get(storageName as any, keyValue);

    if (!item) throw new Error("item to update dont exist");

    const updatedItem = {
      ...item,
      ...value,
    };

    await db.put(storageName as any, updatedItem);

    return updatedItem;
  },
  delete: async (db, storageName, _keyName, keyValue) => {
    await db.delete(storageName as any, keyValue);
    return;
  },
});

//TODO test
export const createKeyBasedStorageMethods = (
  storeName: string
): CreateKeyStorageMethods<IDBPDatabase, any> => ({
  get: async (storage) => {
    return await storage.get(storeName, 1);
  },
  update: async (storage, value) => {
    await storage.put(storeName, value, 1);

    return value;
  },
  clear: async (storage) => {
    storage.clear(storeName);
  },
});
