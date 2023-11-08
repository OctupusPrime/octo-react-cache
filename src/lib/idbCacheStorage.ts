import { openDB, type IDBPDatabase } from "idb";

export type IDBInstance = IDBPDatabase;

export const initIdbStorage = async (): Promise<IDBInstance> => {
  const db = await openDB("cache", 2, {
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
