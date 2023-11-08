type KeyToKeyNoIndex<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
};

type ValuesOf<T> = T extends {
  [K in keyof T]: infer U;
}
  ? U
  : never;

export interface TableStorageSchema {
  [s: string]: any;
}

export type TableStoreNames<DBTypes extends TableStorageSchema | unknown> =
  DBTypes extends TableStorageSchema ? KnownKeys<DBTypes> : string;

export type KnownKeys<T> = ValuesOf<KeyToKeyNoIndex<T>>;

export type TableStoreKeyNames<
  DBTypes extends TableStorageSchema | unknown,
  StoreName extends TableStoreNames<DBTypes>
> = DBTypes extends TableStorageSchema ? KnownKeys<DBTypes[StoreName]> : string;

export type TableStoreKeyValue<
  DBTypes extends TableStorageSchema | unknown,
  StoreName extends TableStoreNames<DBTypes>,
  StoreKey extends string
> = DBTypes extends TableStorageSchema ? DBTypes[StoreName][StoreKey] : any;

export type TableStoreValue<
  DBTypes extends TableStorageSchema | unknown,
  StoreName extends TableStoreNames<DBTypes>
> = DBTypes extends TableStorageSchema ? DBTypes[StoreName] : any;

export interface CreateTableStorageMethods<Storage> {
  get: (
    storage: Storage,
    storageName: string,
    keyName: string,
    keyValue: any
  ) => Promise<any>;

  add: (storage: Storage, storageName: string, value: any) => Promise<any>;

  update: (
    storage: Storage,
    storageName: string,
    keyName: string,
    keyValue: any,
    value: any
  ) => Promise<any>;

  delete: (
    storage: Storage,
    storageName: string,
    keyName: string,
    keyValue: any
  ) => Promise<void>;
}

//------

export type KeyStorageSchema = any;

export interface CacheTimeStorageSchema extends KeyStorageSchema {
  [key: string]: number;
}

export interface CreateKeyStorageMethods<
  Storage,
  StorageTypes extends KeyStorageSchema | unknown
> {
  get: (storage: Storage) => Promise<StorageTypes | undefined>;

  update: (storage: Storage, value: StorageTypes) => Promise<StorageTypes>;

  clear: (storage: Storage) => Promise<void>;
}
