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

  const handlePrev = () => {
    setStartIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? todoLists.length - 1 : prevIndex - 1;
        return newIndex;
    });
    setCurrentListName(todoLists[(startIndex + 1) % todoLists.length].name);
};

const handleNext = () => {
    setStartIndex((prevIndex) => {
        const newIndex = prevIndex === todoLists.length - 1 ? 0 : prevIndex + 1;
        return newIndex;
    });
    setCurrentListName(todoLists[(startIndex + 1) % todoLists.length].name);
};

  const visibleLists = todoLists.slice(startIndex, startIndex + 3).concat(
    todoLists.slice(0, Math.max(0, startIndex + 3 - todoLists.length))
  );

  const handleDrag = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center mb-2">
      {todoLists.length === 0 ? (
        <div>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded-md"
            onClick={addTodoList}
          >
            Create a todo list
          </button>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <button className="bg-gray-700 text-white py-2 px-4 rounded-l-md" onClick={handlePrev}>
            &lt;
          </button>
          <div
            ref={containerRef}
            className="flex-grow overflow-hidden relative flex items-center"
            onMouseDown={(e) => e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION' && containerRef.current.addEventListener('mousemove', handleDrag)}
            onMouseUp={() => containerRef.current.removeEventListener('mousemove', handleDrag)}
            onMouseLeave={() => containerRef.current.removeEventListener('mousemove', handleDrag)}
          >
            <div className="flex space-x-4 w-full justify-center">
              {visibleLists.map((list, index) => (
                <div
                  key={list.name}
                  className={`cursor-pointer py-2 px-4 rounded-md ${list.name === currentListName ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
                  onClick={() => setCurrentListName(list.name)}
                >
                  {list.name}
                </div>
              ))}
            </div>
          </div>
          <button className="bg-gray-700 text-white py-2 px-4 rounded-r-md" onClick={handleNext}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default TopMenu;
