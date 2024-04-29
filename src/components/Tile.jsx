import React, { memo } from 'react';

const Tile = memo(({ className, value, onClick, playerTurn }) => {
  console.log(`Rendering Tile - Value: ${value}, PlayerTurn: ${playerTurn}`);
  let hoverClass = value == null && playerTurn != null ? `${playerTurn.toLowerCase()}-hover` : '';
  return (
    <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
      {value || "-"}
    </div>
  );
}, (prevProps, nextProps) => {
  // This function returns true if props are equal, preventing re-render
  return prevProps.value === nextProps.value && prevProps.playerTurn === nextProps.playerTurn;
});

export default Tile;
