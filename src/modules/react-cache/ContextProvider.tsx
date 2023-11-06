import { type Context, createContext, useContext, type ReactNode } from "react";
import { type StoragePresister } from "./lib/storage";
import type { DBSchema } from "./types";

interface CacheContextProps<DB, DBTypes extends DBSchema | unknown> {
  presistor: StoragePresister<DB, DBTypes>;
}

const createCacheContextInstance = <
  DB,
  DBTypes extends DBSchema | unknown
>() => {
  return createContext<CacheContextProps<DB, DBTypes> | null>(null);
};

const createUseCacheContext = <T,>(Context: Context<T>) => {
  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

export const generateCacheProvider = <DB, DBTypes extends DBSchema | unknown>(
  props: CacheContextProps<DB, DBTypes>
) => {
  const CacheContext = createCacheContextInstance<DB, DBTypes>();
  const useCache = createUseCacheContext(CacheContext);
  const CacheProvider = createCacheProvider(CacheContext, props);

  return {
    CacheContext,
    useCache,
    CacheProvider,
  };
};
