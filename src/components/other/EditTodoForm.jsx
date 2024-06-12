import React, { useState } from 'react';

export const EditTodoForm = ({ editTodo, task, cancelEditTask }) => {
  const [value, setValue] = useState(task.task);

  return (
    <div className="w-full relative flex gap-2 items-center justify-center bg-[#230e28] rounded-xl h-fit">
      <textarea
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-[#3d2243] text-[#ffe4f9] px-2 rounded-xl w-full m-2 mr-auto break-all whitespace-pre-wrap p-2 h-auto resize-none max-h-40"
        placeholder="Update task"
      ></textarea>

      {/* Confirm button */}
      <button
        className="text-green-500 bg-[#110713] hover:bg-[#3d2243] rounded-full p-2 w-fit animate-[pulse_.8s_4s_ease-in-out_infinite]"
        onClick={(e) => (editTodo(value, task.id))}
      >
        <svg className="w-4 h-4 xsm:w-8 xsm:h-8" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 335.765 335.765" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="311.757,41.803 107.573,245.96 23.986,162.364 0,186.393 107.573,293.962 335.765,65.795 "></polygon> </g> </g> </g></svg>
      </button>

      {/* Cancel button */}
      <button
        className="text-red-500 bg-[#110713] hover:bg-[#3d2243] rounded-full p-2 animate-[pulse_.8s_4s_ease-in-out_infinite]"
        onClick={(e) => (cancelEditTask(value, task.id))}
      >
        <svg className="w-4 h-4 xsm:w-8 xsm:h-8" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"></path> </g></svg>
      </button>
    </div>
  )
}