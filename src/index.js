/**
 * Tic Tac Toe game in functional programming style using React.
 * @author <nmarye76@gmail.com> Nathan Marye
 */
import ReactDOM from "react-dom/client"
import React, { useEffect, useState } from "react"
import "./cascade.css"

const PLAYING = 0
const X_WON = 1
const O_WON = 2
const EQUALITY = 3

const _debugBoard = (tictactoe) => {
    let str = ""
    for (let i in tictactoe) {
        for (let j in tictactoe[i]) {
            if (tictactoe[i][j] !== null) {
                str += tictactoe[i][j]
            }
            else {
                str += "."
            }
        }
        str += "\n"
    }
    return str
}

const Square = ({...props}) => {
    return (
        <button className="square"
                onClick={props.onClick}>
            {props.value}
        </button>
    )
}

const Historic = ({...props}) => {
    const handleClickHisto = (idx) => {
        console.log(_debugBoard(props.histo[idx].board))
        props.setHisto(props.histo.slice(0, idx+1))
        for (let i of props.histo) {
            console.log(_debugBoard(i.board))
        }
        props.setBoard(props.histo[idx].board)
        props.setXTurn(props.histo[idx].xTurn)
        if (idx !== props.histo.length) {
            props.setGameStatus(PLAYING)
        }
    }
    return (
        <ul>
            {props.histo.map((x, idx, histo) => {
                if (idx+1 !== histo.length) {
                    return (
                        <li className="historic-row">
                            <input type="button"
                                onClick={() => (handleClickHisto(idx))}
                                value={idx === 0 ? "Opening" : `Move #${idx}`}/>
                        </li>
                    )
                }
            })}
        </ul>
    )
}

const Board = () => {
    const [xTurn, setXTurn] = useState(Math.random() < 0.5)
    const [board, setBoard] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ])
    const [gameStatus, setGameStatus] = useState(PLAYING)
    const [gameMessage, setGameMessage] = useState( (!xTurn ? "❌" : "⭕") + " turn." )
    const [histo, setHisto] = useState([{
        board: board,
        xTurn: xTurn
    }])

    const handleClick = (l, c) => {
        if (gameStatus === PLAYING) {
            const _board = structuredClone(board)
            if (_board[l][c] !== null) {
                return
            }
            _board[l][c] = (xTurn ? "❌" : "⭕")
            setBoard(_board)

            setHisto((prev) => ([
                ...prev, 
                {
                    board: _board,
                    xTurn: xTurn
                }
            ]))

            if (checkWinner(_board) !== null) {
                if (xTurn) {
                    setGameStatus(X_WON)
                }
                else {
                    setGameStatus(O_WON)
                }
            }
            else {
                let allFilled = true
                for (let r=0; r<3; ++r) {
                    for (let c=0; c<3; ++c) {
                        if (_board[r][c] === null) {
                            allFilled = false
                        }
                    }
                }
                if (allFilled) {
                    setGameStatus(EQUALITY)
                }
            }
        }
    }

    useEffect(() => {
        if (gameStatus === PLAYING) {
            setXTurn(!xTurn)
        }
    }, [board])

    useEffect(() => {
        if (gameStatus === PLAYING) {
            setGameMessage((`${(xTurn ? "❌" : "⭕")} turn.`))
        }
    }, [xTurn])

    const renderBoard = () => {
        if (gameStatus === PLAYING) {
            return (
                <div>
                    <h1>Tic-Tac-Toe</h1>
                    <p>{gameMessage}</p>
                    <table>
                        <tbody>
                            <tr>
                                <td><Square value={board[0][0]} onClick={() => handleClick(0, 0)}/></td>
                                <td><Square value={board[0][1]} onClick={() => handleClick(0, 1)}/></td>
                                <td><Square value={board[0][2]} onClick={() => handleClick(0, 2)}/></td>
                            </tr>
                            <tr>
                                <td><Square value={board[1][0]} onClick={() => handleClick(1, 0)}/></td>
                                <td><Square value={board[1][1]} onClick={() => handleClick(1, 1)}/></td>
                                <td><Square value={board[1][2]} onClick={() => handleClick(1, 2)}/></td>
                            </tr>
                            <tr>
                                <td><Square value={board[2][0]} onClick={() => handleClick(2, 0)}/></td>
                                <td><Square value={board[2][1]} onClick={() => handleClick(2, 1)}/></td>
                                <td><Square value={board[2][2]} onClick={() => handleClick(2, 2)}/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
        if (gameStatus === EQUALITY) {
            return (
                <div>
                    <p>Equality !</p>
                </div>
            )
        }
        if (gameStatus !== PLAYING && gameStatus !== EQUALITY) {
            return (
                <div>
                    <p>{(gameStatus === X_WON) ? "❌ won." : "⭕ won."}</p>
                </div>
            )   
        }
    }

    return (
        <div>
            {renderBoard()}
            <Historic histo={histo} setHisto={setHisto} board={board} setBoard={setBoard} xTurn={xTurn} setXTurn={setXTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}/>
        </div>
    )
}

const checkWinner = (board) => {
    if (board[0][0] !== null && board[0][0] === board[0][1] && board[0][0] === board[0][2]) {
        return board[0][0]
    }
    if (board[1][0] !== null && board[1][0] === board[1][1] && board[1][0] === board[1][2]) {
        return board[1][0]
    }
    if (board[2][0] !== null && board[2][0] === board[2][1] && board[2][0] === board[2][2]) {
        return board[2][0]
    }
    if (board[0][0] !== null && board[0][0] === board[1][0] && board[0][0] === board[2][0]) {
        return board[0][0]
    }
    if (board[0][1] !== null && board[0][1] === board[1][1] && board[0][1] === board[2][1]) {
        return board[0][1]
    }
    if (board[0][2] !== null && board[0][2] === board[1][2] && board[0][2] === board[2][2]) {
        return board[0][2]
    }
    if (board[0][0] !== null && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[0][0]
    }
    if (board[0][2] !== null && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[0][2]
    }
    return null
}

const Game = () => {
    return <Board/>
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
