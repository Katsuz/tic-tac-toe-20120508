import { useState } from "react";

function Square({ value, onSquareClick, isHighlight }) {
  const className = isHighlight ? "square highlight" : "square";
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const resultLine = calculateWinner(squares);
  let status;
  if (resultLine) {
    status = "Winner: " + squares[resultLine[0]];
  } else if (currentMove === 9) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let board = [];
  const size = 3;
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const isHighlight = resultLine && resultLine.includes(index);
      row.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isHighlight={isHighlight}
        />
      );
    }
    board.push(
      <div className="board-row" key={i}>
        {row}
      </div>
    );
  }

  return (
    <>
      <div className="status" style={{ fontWeight: "bold" }}>
        {status}
      </div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const current = history[currentMove];
  const currentSquares = current.squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, lastMove: i },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let decription;
    if (move === currentMove) {
      decription = `You are at move #${move}`;
      return (
        <li key={move}>
          <strong>{decription}</strong>
        </li>
      );
    } else {
      const row = Math.floor(squares.lastMove / 3) + 1;
      const col = (squares.lastMove % 3) + 1;
      if (move > 0) {
        decription = `Go to move (${row}, ${col}) #${move}`;
      } else {
        decription = `Go to game start`;
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{decription}</button>
        </li>
      );
    }
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <div>
          <button onClick={() => setIsAscending(!isAscending)}>
            {isAscending ? "Ascending" : "Descending"}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
