import type {
  CreateTableStorageMethods,
  TableStorageSchema,
  TableStoreKeyNames,
  TableStoreKeyValue,
  TableStoreNames,
  TableStoreValue,
} from "./types";

class TableBasedStorage<
  Storage,
  StorageTypes extends TableStorageSchema | unknown
> {
  private storage!: Storage;

  get!: <
    Name extends TableStoreNames<StorageTypes>,
    KeyName extends `${TableStoreKeyNames<StorageTypes, Name>}`
  >(
    storageName: Name,
    keyName: KeyName,
    keyValue: TableStoreKeyValue<StorageTypes, Name, KeyName>
  ) => Promise<TableStoreValue<StorageTypes, Name> | undefined>;

  add!: <Name extends TableStoreNames<StorageTypes>>(
    storageName: Name,
    value: TableStoreValue<StorageTypes, Name>
  ) => Promise<TableStoreValue<StorageTypes, Name>>;

  update!: <
    Name extends TableStoreNames<StorageTypes>,
    KeyName extends `${TableStoreKeyNames<StorageTypes, Name>}`
  >(
    storageName: Name,
    keyName: KeyName,
    keyValue: TableStoreKeyValue<StorageTypes, Name, KeyName>,
    value: Partial<TableStoreValue<StorageTypes, Name>>
  ) => Promise<TableStoreValue<StorageTypes, Name>>;

  delete!: <
    Name extends TableStoreNames<StorageTypes>,
    KeyName extends `${TableStoreKeyNames<StorageTypes, Name>}`
  >(
    storageName: Name,
    keyName: KeyName,
    keyValue: TableStoreKeyValue<StorageTypes, Name, KeyName>
  ) => Promise<void>;

  constructor(
    initStorage: () => Promise<Storage>,
    methods: CreateTableStorageMethods<Storage>
  ) {
    this.initialize(initStorage, methods);
  }

  private async initialize(
    initStorage: () => Promise<Storage>,
    methods: CreateTableStorageMethods<Storage>
  ) {
    const storage = await initStorage();

    this.storage = storage;

    this.get = async (storageName, keyName, keyValue) =>
      await methods.get(storage, storageName, keyName, keyValue);

    this.add = async (storageName, value) =>
      await methods.add(storage, storageName, value);

    this.update = async (storageName, keyName, keyValue, value) =>
      await methods.update(storage, storageName, keyName, keyValue, value);

    this.delete = async (storageName, keyName, keyValue) =>
      await methods.delete(storage, storageName, keyName, keyValue);
  }

  getStorageInstance() {
    return this.storage;
  }
}

const createTableBasedStorage = <
  Storage extends unknown | unknown,
  StorageTypes extends TableStorageSchema | unknown
>(
  initStorage: () => Promise<Storage>,
  methods: CreateTableStorageMethods<Storage>
) => {
  const storage = new TableBasedStorage<Storage, StorageTypes>(
    initStorage,
    methods
  );

  return storage;
};

export { TableBasedStorage, createTableBasedStorage };
