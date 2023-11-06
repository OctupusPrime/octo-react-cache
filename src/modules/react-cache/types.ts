type KeyToKeyNoIndex<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
};

type ValuesOf<T> = T extends {
  [K in keyof T]: infer U;
}
  ? U
  : never;

export interface DBSchema {
  [s: string]: any;
}

export type StoreNames<DBTypes extends DBSchema | unknown> =
  DBTypes extends DBSchema ? KnownKeys<DBTypes> : string;

export type KnownKeys<T> = ValuesOf<KeyToKeyNoIndex<T>>;

export type StoreKeyNames<
  DBTypes extends DBSchema | unknown,
  StoreName extends StoreNames<DBTypes>
> = DBTypes extends DBSchema ? KnownKeys<DBTypes[StoreName]> : string;

export type StoreKeyValue<
  DBTypes extends DBSchema | unknown,
  StoreName extends StoreNames<DBTypes>,
  StoreKey extends string
> = DBTypes extends DBSchema ? DBTypes[StoreName][StoreKey] : any;

export type StoreValue<
  DBTypes extends DBSchema | unknown,
  StoreName extends StoreNames<DBTypes>
> = DBTypes extends DBSchema ? DBTypes[StoreName] : any;
