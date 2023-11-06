import type {
  DBSchema,
  StoreKeyNames,
  StoreKeyValue,
  StoreNames,
  StoreValue,
} from "../types";

interface CreateStorageMethods<DB> {
  get: (
    db: DB,
    storageName: string,
    keyName: string,
    keyValue: any
  ) => Promise<any>;

  add: (db: DB, storageName: string, value: any) => Promise<any>;

  update: (
    db: DB,
    storageName: string,
    keyName: string,
    keyValue: any,
    value: any
  ) => Promise<any>;

  delete: (
    db: DB,
    storageName: string,
    keyName: string,
    keyValue: any
  ) => Promise<void>;
}

class StoragePresister<DB, DBTypes extends DBSchema | unknown> {
  private db!: DB;

  get!: <
    Name extends StoreNames<DBTypes>,
    KeyName extends `${StoreKeyNames<DBTypes, Name>}`
  >(
    storageName: Name,
    keyName: KeyName,
    keyValue: StoreKeyValue<DBTypes, Name, KeyName>
  ) => Promise<StoreValue<DBTypes, Name> | undefined>;

  add!: <Name extends StoreNames<DBTypes>>(
    storageName: Name,
    value: StoreValue<DBTypes, Name>
  ) => Promise<StoreValue<DBTypes, Name>>;

  update!: <
    Name extends StoreNames<DBTypes>,
    KeyName extends `${StoreKeyNames<DBTypes, Name>}`
  >(
    storageName: Name,
    keyName: KeyName,
    keyValue: StoreKeyValue<DBTypes, Name, KeyName>,
    value: Partial<StoreValue<DBTypes, Name>>
  ) => Promise<StoreValue<DBTypes, Name>>;

  delete!: <
    Name extends StoreNames<DBTypes>,
    KeyName extends `${StoreKeyNames<DBTypes, Name>}`
  >(
    storageName: Name,
    keyName: KeyName,
    keyValue: StoreKeyValue<DBTypes, Name, KeyName>
  ) => Promise<void>;

  constructor(initDB: () => Promise<DB>, methods: CreateStorageMethods<DB>) {
    this.initialize(initDB, methods);
  }

  private async initialize(
    initDB: () => Promise<DB>,
    methods: CreateStorageMethods<DB>
  ) {
    const storage = await initDB();

    this.db = storage;

    this.get = async (storageName, keyName, keyValue) =>
      await methods.get(storage, storageName, keyName, keyValue);

    this.add = async (storageName, value) =>
      await methods.add(storage, storageName, value);

    this.update = async (storageName, keyName, keyValue, value) =>
      await methods.update(storage, storageName, keyName, keyValue, value);

    this.delete = async (storageName, keyName, keyValue) =>
      await methods.delete(storage, storageName, keyName, keyValue);
  }

  getDbInstance() {
    return this.db;
  }
}

const createCacheStoragePresistor = <
  DB extends unknown | unknown,
  DBTypes extends DBSchema | unknown
>(
  initDB: () => Promise<DB>,
  methods: CreateStorageMethods<DB>
): StoragePresister<DB, DBTypes> => {
  const presister = new StoragePresister<DB, DBTypes>(initDB, methods);

  return presister;
};

export { StoragePresister, createCacheStoragePresistor };
