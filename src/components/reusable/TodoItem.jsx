import React, { useState, useEffect } from 'react';

const TodoItem = ({ item, deleteItem, updateItem }) => {
  const [text, setText] = useState(item.text);
  const [completed, setCompleted] = useState(item.completed);

  useEffect(() => {
    setText(item.text);
    setCompleted(item.completed);
  }, [item]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    updateItem({ ...item, text: newText });
  };

  const handleCompletedChange = (e) => {
    const newCompleted = e.target.checked;
    setCompleted(newCompleted);
    updateItem({ ...item, completed: newCompleted });
  };

  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={handleCompletedChange}
        className="mr-2"
      />
      <input
        className="border p-2 flex-1"
        value={text}
        onChange={handleTextChange}
      />
      <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white px-2 py-1 rounded-xl ml-2">Delete</button>
    </div>
  );
};

export default TodoItem;
