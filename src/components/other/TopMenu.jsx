import React, { useState, useRef, useEffect } from 'react';

const TopMenu = ({ addTodoList, currentListName, setCurrentListName, todoLists }) => {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (startIndex >= todoLists.length) {
      setStartIndex(0);
    } else if (startIndex < 0) {
      setStartIndex(todoLists.length - 1);
    }
  }, [startIndex, todoLists.length]);

  useEffect(() => {
    if (todoLists.length >= 3) {
      setCurrentListName(todoLists[(startIndex + 1) % todoLists.length].name);
    }
  }, [startIndex, todoLists, setCurrentListName]);

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex === 0 ? todoLists.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex === todoLists.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDrag = (e) => {
    e.preventDefault();
  };

  const renderTodoLists = () => {
    if (todoLists.length < 3) {
      return (
        <div className='flex gap-2 text-center items-center mx-auto'>
          {todoLists.map((list) => (
            <div
              key={list.name}
              className={`cursor-pointer py-2 px-4 rounded-xl transition-all duration-300 ${list.name === currentListName ? 'bg-[#230e28] text-[#ffe4f9] text-center font-bold text-lg xsm:text-xl sm:text-2xl' : 'bg-[#230e28]/70 text-[#ffe4f9]'}`}
              onClick={() => setCurrentListName(list.name)}
            >
              {list.name}
            </div>
          ))}
        </div>
      )
    }

    const visibleLists = todoLists.slice(startIndex, startIndex + 3).concat(
      todoLists.slice(0, Math.max(0, startIndex + 3 - todoLists.length))
    );

    return (
      <div className="flex items-center w-full ">
        <div
          ref={containerRef}
          className="flex-grow overflow-hidden relative flex items-center"
          onMouseDown={(e) => e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION' && containerRef.current.addEventListener('mousemove', handleDrag)}
          onMouseUp={() => containerRef.current.removeEventListener('mousemove', handleDrag)}
          onMouseLeave={() => containerRef.current.removeEventListener('mousemove', handleDrag)}
        >
          <div className="grid grid-cols-4 justify-center w-full overflow-hidden">
            <>
              <button className="absolute left-0 w-1/4 h-full group/movleft bg-gradient-to-r from-[#230e28] to-transparent text-[#ffe4f9] py-2 px-4 rounded-l-xl" onClick={handlePrev}>
                <svg className='w-8 h-8 group-hover/movleft:w-10 group-hover/movleft:h-10 group-hover/movleft:-translate-x-2 transition-all duration-500' fill="currentColor" viewBox="-32 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"></path></g></svg>
              </button>
              {visibleLists.map((list, index) => (
                <div
                  key={list.name}
                  className={`cursor-pointer rounded-xl items-center justify-center flex text-center h-14 overflow-hidden
                    ${list.name === currentListName ? 'bg-[#230e28] text-[#ffe4f9] col-span-2 text-center font-bold text-lg xsm:text-xl sm:text-2xl mx-1 py-2 px-4 transition-all duration-300' :
                      'bg-[#230e2884] text-[#ffe4f9] col-span-1 text-clip text-[12px] xsm:text-base sm:text-lg py-1 px-2'}`}
                  onClick={() => setCurrentListName(list.name)}
                >
                  {list.name}
                </div>
              ))}
              <button className="absolute right-0 w-1/4 h-full group/movright bg-gradient-to-l from-[#230e28] to-transparent text-[#ffe4f9] py-2 px-4 rounded-r-xl" onClick={handleNext}>
                <svg className='w-8 h-8 ml-auto group-hover/movright:w-10 group-hover/movright:h-10 group-hover/movright:translate-x-2 transition-all duration-500' fill="currentColor" viewBox="-32 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></g></svg>
              </button>
            </>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center text-center">
      {todoLists.length === 0 ? (
        <div>
          <button
            className="bg-[#230e28] text-[#ffe4f9] text-center font-bold text-lg xsm:text-xl sm:text-2xl py-2 px-4 rounded-xl h-14"
            onClick={addTodoList}
          >
            Create a todo list
          </button>
        </div>
      ) : (
        renderTodoLists()
      )}
    </div>
  );
};

export default TopMenu;
