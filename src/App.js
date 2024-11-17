import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/todos?limit=10")
      .then((response) => response.json())
      .then((result) => setData(result.todos))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = () => {
    const updatedData = data.filter((task) => !selectedItems.includes(task.id));
    setData(updatedData);
    setSelectedItems([]);
  };

  const handleEditClick = (id, currentText) => {
    setIsEditing(id);
    setEditText(currentText);
  };

  const handleUpdate = (id) => {
    const updatedData = data.map((task) => {
      if (task.id === id) {
        return { ...task, todo: editText };
      }
      return task;
    });
    setData(updatedData);
    setIsEditing(null);
    setEditText("");
  };
  const handleComplete = (id) => {
    const completedTask = data.find((task) => task.id === id);
    if (completedTask) {
      setCompletedItems([...completedItems, completedTask]);
      setData(data.filter((task) => task.id !== id)); 
    }
  };

  return (
    <div className="container">
      <div className="todo-column">
        <h2>To-Do</h2>
        <ul id="todo-list">
          {data.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={selectedItems.includes(task.id)}
                onChange={() => handleSelect(task.id)}
              />
              {isEditing === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(task.id)}>Save</button>
                </>
              ) : (
                <>
                  {task.todo}
                  <button
                    onClick={() => handleDelete()}
                    style={{ marginLeft: "4px" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(task.id, task.todo)}
                    style={{ marginLeft: "4px" }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleComplete(task.id)}
                    style={{ marginLeft: "4px" }}
                  >
                    Complete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="completed-column">
        <h2>Completed</h2>
        <ul id="completed-list">
          {completedItems.map((task) => (
            <li key={task.id}>
              <input type="checkbox" checked readOnly /> {task.todo}
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
