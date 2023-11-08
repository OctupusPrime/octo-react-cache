import type { CreateKeyStorageMethods, KeyStorageSchema } from "./types";

class KeyBasedStorage<
  Storage,
  StorageTypes extends KeyStorageSchema | unknown
> {
  private storage!: Storage;

  get!: () => Promise<StorageTypes | undefined>;

  update!: (value: StorageTypes) => Promise<StorageTypes>;

  clear!: () => Promise<void>;

  constructor(
    initDB: () => Promise<Storage>,
    methods: CreateKeyStorageMethods<Storage, StorageTypes>
  ) {
    this.initialize(initDB, methods);
  }

  private async initialize(
    initStorage: () => Promise<Storage>,
    methods: CreateKeyStorageMethods<Storage, StorageTypes>
  ) {
    const storage = await initStorage();

    this.storage = storage;

    this.get = async () => await methods.get(storage);

    this.update = async (value) => await methods.update(storage, value);

    this.clear = async () => await methods.clear(storage);
  }

  getStorageInstance() {
    return this.storage;
  }
}

const createKeyBasedStorage = <
  Storage extends unknown | unknown,
  StorageTypes extends KeyStorageSchema | unknown
>(
  initStorage: () => Promise<Storage>,
  methods: CreateKeyStorageMethods<Storage, StorageTypes>
) => {
  const storage = new KeyBasedStorage<Storage, StorageTypes>(
    initStorage,
    methods
  );

  return storage;
};

export { KeyBasedStorage, createKeyBasedStorage };
