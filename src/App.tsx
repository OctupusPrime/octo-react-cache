import { useCache } from "./lib/reactCache";

function App() {
  const { presistor } = useCache();

  const handleAddItem = () => {
    presistor.add("articles", {
      title: "Article 1",
      date: new Date("2019-01-01"),
      body: "…",
      id: 1,
    });
  };

  const getItem = async () => {
    const item = await presistor.get("articles", "id", 1);
    console.log(item);
  };

  const handleDeleteItem = async () => {
    await presistor.delete("articles", "id", 1);
    console.log("deleted");
  };

  const handleUpdateItem = async () => {
    const updatedItem = await presistor.update("articles", "id", 1, {
      title: "Article 1 updated",
    });
    console.log(updatedItem);
  };

  return (
    <>
      <button onClick={handleAddItem}>add item</button>
      <button onClick={getItem}>get item</button>
      <button onClick={handleUpdateItem}>updated item</button>
      <button onClick={handleDeleteItem}>delete item</button>
    </>
  );
}

export default App;
