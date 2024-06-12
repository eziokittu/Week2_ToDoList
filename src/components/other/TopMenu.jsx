import React from 'react'

const TopMenu = ({addTodoList, currentListName, setCurrentListName, todoLists}) => {
  return (
    <div className="flex items-center mb-2">
      {todoLists.length === 0 ? (
        <div>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded-md"
            onClick={addTodoList}
          >Create a todo list</button>
        </div>
      ) : (
        <select
          className="form-select bg-gray-700 text-white py-2 px-4 rounded-md"
          value={currentListName}
          onChange={(e) => setCurrentListName(e.target.value)}
        >
          {todoLists.map((list) => (
            <option key={list.name} value={list.name}>
              {list.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default TopMenu