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
		todos: todosObject[key]
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

		setTodoLists([...todoLists, { name: listName, todos: [] }]);
		setCurrentListName(listName);
	}

	// delete a list
	const deleteTodoList = (listName) => {
		const newTodoLists = todoLists.filter(list => list.name !== listName);
		setTodoLists(newTodoLists);
	}

	// update the name of a todo list
	const confirmEditListName = (oldName, newName) => {
		if (oldName === newName || !todoLists.some(list => list.name === newName)) {
			const index = todoLists.findIndex(list => list.name === oldName);
			const newTodoLists = [...todoLists];
			newTodoLists[index] = { ...newTodoLists[index], name: newName };
			setTodoLists(newTodoLists);
			setEditingListName("");
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
			{ id: uuidv4(), task: todo, completed: false, isEditing: false },
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

	return (
		<div className="relative z-10 mt-10 flex flex-col justify-center items-center bg-red-500">
			<h1>All your lists in one place</h1>

			{/* Add a new todo list button */}
			<div
				onClick={addTodoList}
				className="fixed right-0 bottom-16 sm:bottom-14"
			>
				<svg className="w-24 h-24 fill-green-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM11.9426 2.75C9.67997 2.75 7.95773 2.74999 6.59757 2.93188C5.28702 3.10695 4.43852 3.42653 3.8044 4.06066C3.17027 4.69479 2.8507 5.5433 2.67563 6.85384C2.49374 8.214 2.49373 9.93625 2.49373 12.1989V12.8011C2.49373 15.0637 2.49374 16.786 2.67563 18.1462C2.8507 19.4567 3.17027 20.3052 3.8044 20.9393C4.43852 21.5735 5.28702 21.893 6.59757 22.0681C7.95773 22.25 9.67998 22.25 11.9426 22.25H12.0574C14.32 22.25 16.0423 22.25 17.4024 22.0681C18.713 21.893 19.5615 21.5735 20.1956 20.9393C20.8297 20.3052 21.1493 19.4567 21.3244 18.1462C21.5063 16.786 21.5063 15.0637 21.5063 12.8011V12.1989C21.5063 9.93625 21.5063 8.214 21.3244 6.85384C21.1493 5.5433 20.8297 4.69479 20.1956 4.06066C19.5615 3.42653 18.713 3.10695 17.4024 2.93188C16.0423 2.74999 14.32 2.75 12.0574 2.75H11.9426Z" fill="#000000"></path> </g></svg>
			</div>

			{/* All todo lists */}
			{todoLists.map((list) => (
				<div key={list.name} className="border-2 border-black rounded-xl p-2 sm:p-4">
					{/* Todo list title */}
					{editingListName === list.name ? (
						<div className="flex flex-col">
							<input
								className="border-2 border-black px-4 py-1 mb-2"
								type="text"
								value={newListName}
								onChange={(e) => setNewListName(e.target.value)}
							/>
							<div className="flex justify-between">
								<button
									className="bg-blue-500 text-white px-4 py-1 rounded"
									onClick={() => confirmEditListName(list.name, newListName)}
								>
									Confirm
								</button>
								<button
									className="bg-gray-500 text-white px-4 py-1 rounded"
									onClick={cancelEditListName}
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-bold">{list.name}</h2>
							<div className="flex">
								<button
									className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
									onClick={() => {
										setEditingListName(list.name);
										setNewListName(list.name);
									}}
								>
									Edit
								</button>
								<button
									className="bg-red-500 text-white px-2 py-1 rounded"
									onClick={() => deleteTodoList(list.name)}
								>
									Delete
								</button>
							</div>
						</div>
					)}

					{/* Add a todo to the list */}
					<TodoForm addTodo={(todo) => addTodo(list.name, todo)} />

					{/* All the todos displayed here */}
					{list.todos.map((todo) =>
						todo.isEditing ? (
							<EditTodoForm
								key={todo.id}
								editTodo={(task) => editTask(list.name, task, todo.id)}
								task={todo}
							/>
						) : (
							<Todo
								key={todo.id}
								task={todo}
								deleteTodo={() => deleteTodo(list.name, todo.id)}
								editTodo={() => editTodo(list.name, todo.id)}
								toggleComplete={() => toggleComplete(list.name, todo.id)}
							/>
						)
					)}
				</div>
			))}
		</div>
	);
}