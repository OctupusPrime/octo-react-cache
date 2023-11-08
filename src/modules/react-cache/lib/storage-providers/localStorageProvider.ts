import type {
  CreateKeyStorageMethods,
  CreateTableStorageMethods,
} from "../storage/types";

const getAllStoreValue = (storage: Storage, name: string) => {
  const values = storage.getItem(name);
  return values ? JSON.parse(values) : undefined;
};

const getValueByStorageName = (
  storage: Storage,
  storageName: string,
  name: string
) => {
  const values = getAllStoreValue(storage, name);

  if (!values) return undefined;

  return values[storageName];
};

const setValueByStorageName = (
  storage: Storage,
  storageName: string,
  items: any,
  name: string
) => {
  const values = getAllStoreValue(storage, name) ?? {};

  values[storageName] = items;

  storage.setItem(name, JSON.stringify(values));
};

export const createTableBasedStorageMethods = (
  name: string = "cache-items"
): CreateTableStorageMethods<Storage> => ({
  get: (storage, storageName, keyName, keyValue) => {
    const items = getValueByStorageName(storage, storageName, name);

    return items.find((el: any) => el[keyName] === keyValue);
  },
  add: async (storage, storageName, item) => {
    const items = getValueByStorageName(storage, storageName, name) ?? [];

    setValueByStorageName(storage, storageName, [...items, item], name);

    return item;
  },
  update: async (storage, storageName, keyName, keyValue, value) => {
    const items = getValueByStorageName(storage, storageName, name) ?? [];

    const item = items.find((el: any) => el[keyName] === keyValue);

    if (!item) throw new Error("item to update dont exist");

    const updatedItem = {
      ...item,
      ...value,
    };

    const updatedItems = items.map((el: any) =>
      el[keyName] === keyValue ? updatedItem : el
    );

    setValueByStorageName(storage, storageName, updatedItems, name);

    return updatedItem;
  },
  delete: async (storage, storageName, keyName, keyValue) => {
    const items = getValueByStorageName(storage, storageName, name) ?? [];

    const updatedItems = items.filter((el: any) => el[keyName] !== keyValue);

    setValueByStorageName(storage, storageName, updatedItems, name);
  },
});

export const createKeyBasedStorageMethods = (
  name: string
): CreateKeyStorageMethods<Storage, any> => ({
  get: (storage) => {
    return getAllStoreValue(storage, name);
  },
  update: async (storage, value) => {
    storage.setItem(name, JSON.stringify(value));

    return value;
  },
  clear: async (storage) => {
    storage.setItem(name, "");
  },
});
