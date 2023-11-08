import { type Context, createContext, useContext, type ReactNode } from "react";
import type {
  TableStorageSchema,
  TableBasedStorage,
  KeyBasedStorage,
  CacheTimeStorageSchema,
} from "./lib/storage";

interface CacheContextProps<
  TableStorage,
  TableStorageTypes extends TableStorageSchema | unknown,
  KeyStorage
> {
  presistor?: {
    storage: TableBasedStorage<TableStorage, TableStorageTypes>;
    cacheTimeStorage: KeyBasedStorage<KeyStorage, CacheTimeStorageSchema>;
  };
}

const createCacheContextInstance = <
  TableStorage,
  TableStorageTypes extends TableStorageSchema | unknown,
  KeyStorage
>() => {
  return createContext<CacheContextProps<
    TableStorage,
    TableStorageTypes,
    KeyStorage
  > | null>(null);
};

const createUseCacheContext = <T,>(Context: Context<T>) => {
  return () => {
    const ctx = useContext(Context);

    if (ctx === null) {
      throw new Error("Cache provider component was not found in the tree");
    }

    return ctx;
  };
};

const createCacheProvider = <T,>(Context: Context<T>, value: T) => {
  const CacheProvider = ({ children }: { children: ReactNode }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return CacheProvider;
};

export const generateContextProvider = <
  TableStorage,
  TableStorageTypes extends TableStorageSchema | unknown,
  KeyStorage
>(
  props: CacheContextProps<TableStorage, TableStorageTypes, KeyStorage>
) => {
  const CacheContext = createCacheContextInstance<
    TableStorage,
    TableStorageTypes,
    KeyStorage
  >();
  const useCache = createUseCacheContext(CacheContext);
  const CacheProvider = createCacheProvider(CacheContext, props);

  return {
    CacheContext,
    useCache,
    CacheProvider,
  };
};
