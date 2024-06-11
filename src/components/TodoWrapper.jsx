import React, { useState, useEffect } from "react";
import { Todo } from "./other/Todo";
import { TodoForm } from "./other/TodoForm";
import { EditTodoForm } from './other/EditTodoForm';
import { v4 as uuidv4 } from "uuid";

// Helper function to get data from local storage
const getTodosFromLocalStorage = () => {
	const storedTodos = localStorage.getItem("todos");
	if (!storedTodos) return [];
	const todosObject = JSON.parse(storedTodos);
	return Object.keys(todosObject).map(key => ({
		name: key,
		todos: todosObject[key],
		sortBy: "name, ascending",
		editMode: false
	}));
};

// Helper function to save data to local storage
const saveTodosToLocalStorage = (todos) => {
	const todosObject = todos.reduce((obj, list) => {
		obj[list.name] = list.todos;
		return obj;
	}, {});
	localStorage.setItem("todos", JSON.stringify(todosObject));
};

export const TodoWrapper = () => {
	const [todoLists, setTodoLists] = useState(getTodosFromLocalStorage);
	const [currentListName, setCurrentListName] = useState("");
	const [editingListName, setEditingListName] = useState("");
	const [newListName, setNewListName] = useState("");

	useEffect(() => {
		saveTodosToLocalStorage(todoLists);
	}, [todoLists]);

	// Use useEffect to set the first list as default if currentListName is empty
	useEffect(() => {
		if (!currentListName && todoLists.length > 0) {
			setCurrentListName(todoLists[0].name);
		}
	}, [todoLists, currentListName]);

	// Helper function to sort todos
// Helper function to sort todos
const sortTodos = (todos, sortBy) => {
	if (!todos) return []; // Return an empty array if todos is undefined or null

	if (!sortBy) return todos; // If sortBy is undefined, return todos as is

	const [key, order] = sortBy.split(', ');
	const sortedTodos = [...todos];
	if (key === 'name') {
			sortedTodos.sort((a, b) => {
					if (order === 'ascending') {
							return a.task.localeCompare(b.task);
					} else {
							return b.task.localeCompare(a.task);
					}
			});
	} else if (key === 'custom') {
			sortedTodos.sort((a, b) => {
					if (order === 'ascending') {
							return new Date(a.dateTime) - new Date(b.dateTime);
					} else {
							return new Date(b.dateTime) - new Date(a.dateTime);
					}
			});
	}
	return sortedTodos;
};



	// add new list
	const addTodoList = () => {
		if (todoLists.length >= 10) {
			alert("Cannot create more than 10 lists");
			return;
		}

		let baseName = "new list #";
		let counter = 1;
		let listName = `${baseName}${counter}`;
		while (todoLists.some(list => list.name === listName)) {
			counter++;
			listName = `${baseName}${counter}`;
		}

		const defaultSortBy = "name, ascending"; // Default sorting order

		setTodoLists([...todoLists, { name: listName, todos: [], sortBy: defaultSortBy, editMode: false }]);
		setCurrentListName(listName);
	}

	// delete a list
	const deleteTodoList = (listName) => {
		const updatedLists = todoLists.filter((list) => list.name !== listName);
		setTodoLists(updatedLists);

		// Update currentListName to the first list if there are any lists left, else set to an empty string
		setCurrentListName(updatedLists.length > 0 ? updatedLists[0].name : '');
		saveTodosToLocalStorage(updatedLists);
	};

	// update the name of a todo list
const confirmEditListName = (oldName, newName) => {
	if (oldName === newName || !todoLists.some(list => list.name === newName)) {
			const index = todoLists.findIndex(list => list.name === oldName);
			const newTodoLists = [...todoLists];
			newTodoLists[index] = { ...newTodoLists[index], name: newName };
			setTodoLists(newTodoLists);
			setEditingListName("");
			setCurrentListName(newName); // Update currentListName with the new name
	} else {
			alert("List name already exists. Please choose a different name.");
	}
}


	const cancelEditListName = () => {
		setEditingListName("");
		setNewListName("");
	}

	// add a new todo item to a particular list
	const addTodo = (listName, todo) => {
		const newTodos = [
			...todoLists.find(list => list.name === listName).todos,
			{ id: uuidv4(), task: todo, completed: false, isEditing: false, dateTime: new Date() },
		];
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, todos: newTodos } : list
		);
		setTodoLists(newTodoLists);
	}

	const deleteTodo = (listName, id) => {
		const newTodos = todoLists.find(list => list.name === listName).todos.filter((todo) => todo.id !== id);
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, todos: newTodos } : list
		);
		setTodoLists(newTodoLists);
	}

	const toggleComplete = (listName, id) => {
		const newTodos = todoLists.find(list => list.name === listName).todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		);
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, todos: newTodos } : list
		);
		setTodoLists(newTodoLists);
	}

	const editTodo = (listName, id) => {
		const newTodos = todoLists.find(list => list.name === listName).todos.map((todo) =>
			todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
		);
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, todos: newTodos } : list
		);
		setTodoLists(newTodoLists);
	}

	const editTask = (listName, task, id) => {
		const newTodos = todoLists.find(list => list.name === listName).todos.map((todo) =>
			todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
		);
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, todos: newTodos } : list
		);
		setTodoLists(newTodoLists);
	};

	const cancelEditTask = (listName, id) => {
		const newTodos = todoLists.find(list => list.name === listName).todos.map((todo) =>
			todo.id === id ? { ...todo, isEditing: false } : todo
		);
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, todos: newTodos } : list
		);
		setTodoLists(newTodoLists);
	};

	const changeSortOrder = (listName, sortBy) => {
		const newTodoLists = todoLists.map(list =>
			list.name === listName ? { ...list, sortBy } : list
		);
		setTodoLists(newTodoLists);
	};

	return (
		<div className="relative z-10 mt-10 flex flex-col justify-center items-center bg-red-500">

			{/* Add a new todo list button */}
			<div
				onClick={addTodoList}
				className="fixed right-0 bottom-16 sm:bottom-14"
			>
				<svg className="w-24 h-24 fill-green-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63424 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63424 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63424 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM5.66377 2.4424C7.03349 2.26733 8.70864 2.25 11.75 2.25H12.25C15.2914 2.25 16.9665 2.26733 18.3362 2.4424C19.4889 2.59079 20.207 2.85037 20.7368 3.38014C21.2666 3.90993 21.5262 4.62803 21.6746 5.78074C21.8497 7.15046 21.867 8.8256 21.867 11.8669V12.1331C21.867 15.1744 21.8497 16.8495 21.6746 18.2193C21.5262 19.372 21.2666 20.0901 20.7368 20.6199C20.207 21.1496 19.4889 21.4092 18.3362 21.5576C16.9665 21.7327 15.2914 21.75 12.25 21.75H11.75C8.70864 21.75 7.03349 21.7327 5.66377 21.5576C4.51106 21.4092 3.79296 21.1496 3.26317 20.6199C2.7334 20.0901 2.47382 19.372 2.32543 18.2193C2.15036 16.8495 2.13303 15.1744 2.13303 12.1331V11.8669C2.13303 8.8256 2.15036 7.15046 2.32543 5.78074C2.47382 4.62803 2.7334 3.90993 3.26317 3.38014C3.79296 2.85037 4.51106 2.59079 5.66377 2.4424Z" fill="#000000"></path> </g></svg>
			</div>

			{/* List of all todo names */}
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

			{/* Display the selected todo list */}
			{currentListName && (
				<div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-1/2 max-w-lg">

					{/* Todo list name */}
					<div className="flex items-center justify-between w-full">
						<h2 className="text-2xl font-bold mb-2">{currentListName}</h2>
						<div className="flex space-x-2">
							{editingListName === currentListName ? (
								<>
									<input
										className="bg-gray-700 text-white px-2 rounded"
										value={newListName}
										onChange={(e) => setNewListName(e.target.value)}
									/>
									<button
										className="bg-green-500 text-white px-2 rounded"
										onClick={() => confirmEditListName(currentListName, newListName)}
									>
										Confirm
									</button>
									<button
										className="bg-red-500 text-white px-2 rounded"
										onClick={cancelEditListName}
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										className="bg-yellow-500 text-white px-2 rounded"
										onClick={() => {
											setEditingListName(currentListName);
											setNewListName(currentListName);
										}}
									>
										Edit
									</button>
									<button
										className="bg-red-500 text-white px-2 rounded"
										onClick={() => deleteTodoList(currentListName)}
									>
										Delete
									</button>
								</>
							)}
						</div>
					</div>

					{/* Sorting functionality */}
					<div className="flex items-center justify-between w-full mt-2">
						<select
							className="form-select bg-gray-700 text-white py-2 px-4 rounded-md"
							value={todoLists.find(list => list.name === currentListName)?.sortBy}
							onChange={(e) => changeSortOrder(currentListName, e.target.value)}
						>
							<option value="name, ascending">Name, ascending</option>
							<option value="name, descending">Name, descending</option>
							<option value="custom, ascending">Custom, ascending</option>
							<option value="custom, descending">Custom, descending</option>
						</select>
					</div>

					{/* add todo item form */}
					<TodoForm addTodo={(todo) => addTodo(currentListName, todo)} />

					{/* Displaying all sorted todo items */}
					{sortTodos(todoLists.find(list => list.name === currentListName)?.todos, todoLists.find(list => list.name === currentListName)?.sortBy).map((todo) =>
						todo.isEditing ? (
							<EditTodoForm
								editTodo={(task) => editTask(currentListName, task, todo.id)}
								task={todo}
								key={todo.id}
								cancelEditTask={() => cancelEditTask(currentListName, todo.id)}
							/>
						) : (
							<Todo
								task={todo}
								key={todo.id}
								toggleComplete={() => toggleComplete(currentListName, todo.id)}
								deleteTodo={() => deleteTodo(currentListName, todo.id)}
								editTodo={() => editTodo(currentListName, todo.id)}
							/>
						)
					)}
				</div>
			)}
		</div>
	);
};
