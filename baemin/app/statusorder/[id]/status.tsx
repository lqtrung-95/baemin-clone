import React, { useEffect, useState } from 'react';

interface StatusItem {
  id: string;
  number: number;
  name: string;
  value: string;
  st: boolean;
}

interface StatusProps {
  items: StatusItem[];
  onStatusChange: (status: string) => void;
}

export default function Status({ items, onStatusChange }: StatusProps) {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(items);

  useEffect(() => {
    setStatus(items);
    const currentStatusIndex = items.findIndex((item) => item.st);
    if (currentStatusIndex !== -1) {
      setCurrent(currentStatusIndex + 1);
    }
  }, [items]);

  const handleClick = (id: string) => {
    const clickedIndex = status.findIndex((item) => item.id === id);
    if (clickedIndex <= current) {
      const newStatus = status.map((item, index) => ({
        ...item,
        st: index <= clickedIndex,
      }));
      setStatus(newStatus);
      setCurrent(clickedIndex + 1);
      onStatusChange(status[clickedIndex].value);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-3 relative">
      {status.map((item, index) => (
        <React.Fragment key={item.id}>
          <div
            onClick={() => handleClick(item.id)}
            className="flex flex-row gap-3 items-center cursor-pointer"
          >
            <div
              className={`${
                index < current ? 'border-beamin' : ''
              } w-10 h-10 rounded-full border border-solid flex justify-center items-center`}
            >
              <span
                className={`${
                  index < current ? 'text-beamin' : 'text-gray-600'
                }`}
              >
                {item.number}
              </span>
            </div>
            <div
              className={`text-wrap text-[14px] ${
                index < current ? 'text-beamin' : 'text-gray-600'
              }`}
            >
              {item.name}
            </div>
          </div>
          {index < status.length - 1 && (
            <div className="relative flex flex-col left-4 bottom-5 text-xl font-bold gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`h-2 ${
                    index < current - 1 ? 'text-beamin' : 'text-gray-600'
                  }`}
                >
                  .
                </span>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
