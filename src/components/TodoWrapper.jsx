import React, { useState, useEffect } from "react";
import { Todo } from "./other/Todo";
import { TodoForm } from "./other/TodoForm";
import { EditTodoForm } from './other/EditTodoForm';
import { v4 as uuidv4 } from "uuid";
import TopMenu from "./other/TopMenu";
import TodoListAddButton from "./other/TodoListAddButton";

// Helper function to get data from local storage
// Helper function to get data from local storage
const getTodosFromLocalStorage = () => {
	const storedTodos = localStorage.getItem("todos");
	if (!storedTodos) return [];
	const todosObject = JSON.parse(storedTodos);
	return Object.keys(todosObject).map(key => ({
		name: key,
		todos: todosObject[key].map(todo => ({
			...todo,
			isEditing: false
		})),
		sortBy: "name, ascending",
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
		if (!currentListName && todoLists.length > 1) {
			setCurrentListName(todoLists[1].name);
		}
		else if (!currentListName && todoLists.length > 0) {
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

		// Default sorting order
    const defaultSortBy = "name, ascending"; 

    setTodoLists([...todoLists, { name: listName, todos: [], sortBy: defaultSortBy, isEditing: false }]);
    setCurrentListName(listName);
};


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

	// cancels the editing of list name if 15 seconds idle
	useEffect(() => {
		const timer = setTimeout(() => {
			cancelEditListName();
		}, 15000); // 15 seconds

		return () => clearTimeout(timer);
	}, [newListName]);

	return (
		<div className="relative z-10 mt-10 flex flex-col justify-center items-center bg-[#ffe4f9] px-2 sm:px-4 font-Roboto">

			{/* Add a new todo list button */}
			<TodoListAddButton addTodoList={addTodoList} />

			{/* Top menu - List of all todo names */}
			<div className="w-full sm:w-[650px] my-4 ">
				<TopMenu
					addTodoList={addTodoList}
					todoLists={todoLists}
					currentListName={currentListName}
					setCurrentListName={setCurrentListName}
				/>
			</div>

			{/* Display the selected todo list */}
			{currentListName && (
				<div className="flex flex-col items-center bg-[#230e28] text-[#ffe4f9] p-4 rounded-xl shadow-md w-full sm:w-[650px]">

					{/* Todo list name */}
					<div className="w-full">
						<div className="">
							{editingListName === currentListName ? (
								<div className="flex space-x-2 w-full">
									{/* Rename input field */}
									<input
										className="bg-[#3d2243] text-[#ffe4f9] px-2 rounded-xl text-2xl font-bold w-full"
										value={newListName}
										maxLength={28}
										onChange={(e) => setNewListName(e.target.value)}
									/>

									{/* Confirm button */}
									<button
										className="text-green-500 bg-[#110713] hover:bg-[#3d2243] rounded-full p-2 w-fit animate-[pulse_.8s_4s_ease-in-out_infinite]"
										onClick={() => confirmEditListName(currentListName, newListName)}
									>
										<svg className="w-4 h-4 xsm:w-8 xsm:h-8" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 335.765 335.765" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="311.757,41.803 107.573,245.96 23.986,162.364 0,186.393 107.573,293.962 335.765,65.795 "></polygon> </g> </g> </g></svg>
									</button>

									{/* Cancel button */}
									<button
										className="text-red-500 bg-[#110713] hover:bg-[#3d2243] rounded-full p-2 animate-[pulse_.8s_4.4s_ease-in-out_infinite]"
										onClick={cancelEditListName}
									>
										<svg className="w-4 h-4 xsm:w-8 xsm:h-8" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"></path> </g></svg>
									</button>
								</div>
							) : (
								<div className="flex space-x-2 w-full items-center">
									{/* todo list heading */}
									<p className="text-lg sm:text-2xl font-bold w-full p-2 underline underline-offset-4 break-all whitespace-pre-wrap">{currentListName}</p>

									{/* Edit button */}
									<button
										className="bg-[#230e28] hover:bg-[#ffe4f9] text-[#ffe4f9] hover:text-[#230e28] p-2 rounded-full ml-auto w-fit h-fit"
										onClick={() => {
											setEditingListName(currentListName);
											setNewListName(currentListName);
										}}
									>
										<svg
											className="w-8 h-8"
											viewBox="0 0 24 24"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
											<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
											<g id="SVGRepo_iconCarrier">
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"
													fill="currentColor"
												></path>
											</g>
										</svg>
									</button>

									{/* Delete Button */}
									<button
										className="bg-[#230e28] hover:bg-[#ffe4f9] text-[#ffe4f9] hover:text-[#230e28] p-2 rounded-full ml-auto w-fit h-fit"
										onClick={() => deleteTodoList(currentListName)}
									>
										<svg
											className="w-8 h-8"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
											<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
											<g id="SVGRepo_iconCarrier">
												<path
													d="M10 12V17"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
												<path
													d="M14 12V17"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
												<path
													d="M4 7H20"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
												<path
													d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
												<path
													d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</g>
										</svg>
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Sorting functionality */}
					<div className="flex items-center text-center justify-between gap-4 my-4">
						<p>Sort by:</p>
						<select
							className="form-select bg-[#ffe4f9] text-[#230e28] py-1 px-2 rounded-xl"
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
					<div className="bg-[#ffe4f9] rounded-xl p-2 flex flex-col gap-2 w-full mt-4">
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
				</div>
			)}

			{/* bottom text */}
			<div className="flex gap-1 mt-4 mb-32 text-base sm:text-lg">
				<p className="font-bold">Note:</p>
				<p>Click a task to mark as complete</p>
			</div>
		</div>
	);
};
