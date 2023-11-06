import { openDB, type IDBPDatabase, DBSchema } from "idb";

export interface IDBTypes extends DBSchema {
  articles: {
    value: {
      title: string;
      date: Date;
      body: string;
    };
    key: number;
  };
  articles2: {
    value: {
      title: number;
    };
    key: number;
  };
}

export type IDBInstance = IDBPDatabase<IDBTypes>;

export const initStorage = async (): Promise<IDBInstance> => {
  const db = await openDB<IDBTypes>("cache", 2, {
    upgrade(db) {
      db.createObjectStore("articles", {
        keyPath: "id",
        autoIncrement: true,
      });

      db.createObjectStore("articles2", {
        keyPath: "title",
      });
    },
  });

  return db;
};
