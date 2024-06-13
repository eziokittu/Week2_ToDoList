import React from 'react'

const TodoListAddButton = ({addTodoList}) => {
  return (
    <div
      onClick={addTodoList}
      className="fixed flex flex-col z-20 justify-center items-center right-0 bottom-16 cursor-pointer sm:bottom-14 bg-[#ffe4f9]/50 hover:bg-[#ffe4f9] rounded-tl-xl border-t-2 border-l-2 border-[#230e28] group"
    >
      <svg className='w-20 h-20 group-hover:animate-none text-[#230e28]/90 hover:text-[#230e28] animate-[pulse_.8s_2s_ease-in-out_infinite]' viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44771 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8Z" fill="currentColor"></path> <path fillRule="evenodd" clipRule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="currentColor"></path> </g></svg>
      <p className='text-sm bg-[#ffe4f9] rounded-xl px-2 py-1'>Add Todo</p>
    </div>
  )
}

export default TodoListAddButton