export default function Node(
  { row, col, isStart, isEnd, isWall, onMouseDown, onMouseEnter, onMouseUp }) {
  let className = 'w-6 h-6 border border-gray-300 cursor-pointer transition-all duration-200 hover:scale-110';
  
  if (isStart) className += ' bg-green-500 shadow-lg';
  else if (isEnd) className += ' bg-red-500 shadow-lg';
  else if (isWall) className += ' bg-gray-800';
  else className += ' bg-white hover:bg-gray-50';

  return (
    <div
      id={`node-${row}-${col}`}
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    />
  );
}