---
title: Game Development
image: /assets/img/placeholder.jpg
permalink: /hidden_projects/csci-8980/project-3/report-2
---

# Game Development

<iframe width="560" height="315" src="https://www.youtube.com/embed/CiJlOMVO5M8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> A video demonstrating the gameplay of our chess program.

## 1. Design Decisions

We chose chess since it is a game that many people are familiar with. We felt it the rules were complex enough to provide us with a good challenge.

We designed our version to be as faithful to a physical chess set as possible (both in experience and visual appearance). We implemented each piece type's unique moves, endgame conditions, a play clock for each opponent, and a few other obscure rules (e.g. the ability to "upgrade" a pawn which make it to the opposite side of the board).

We also wanted our version to look like a real chessboard, so we extended the GEFS engine to help support our goal. We modified the PBR shader to take both a normal map and metal/roughness maps into account when shading the surfaces in the game. This allowed us to get more realistic looking chess pieces.

Because we are working digitally, it allowed us to improve upon a physical chess set in a few key ways. Because the player cannot physically pick up the digital pieces, we introduced a cursor that they can use to make selections and move pieces. We also highlight playable pieces and open tiles. This helps guide newer players when deciding moves, and takes some of the burden of remembering the rules off of the players.

Our game continues until the endgame conditions are met, just like in a physical chess set. If you capture your opponents piece, or put their king in checkmate, then you win. If your play clock runs out, then you lose.

## 2. Technical Decisions


In this section we go in-depth in the process of programming the game logic.

### 2.1 Classes

Everything in Lua is represented as a table. There is no concept of classes. It would have been inefficient to implement unique tables for each piece, especially since certain pieces share identical attributes. Fortunately Lua provides a function which allowed us to create copies of existing tables. With this in mind, we created a "template table" within a module for each of our piece types, and made copies of it for all of the pieces of that type. The example pawn module is listed below.

```Lua
-- pawn.lua

local Pawn = {
	x = 0,
	y = 0,
	z = 0,
	team = "Light",
	visible = true,
	ID = 0,
	angle = 0,
	type = "Pawn"
}

function Pawn:new (o)
	o = o or {}
	setmetatable(o, self)
	self.__index = self
	return o
end

-- member functions here...

return Pawn
```

We could then instantiate pawn instances by calling the following methods.

```Lua
-- main.lua
Pawn = require "scenes/Chess/scripts/pieces/pawn"

-- Setting up an example pawn.
local pawn = Pawn:new()
pawn:addModel()
resetModelTransform(pawn.ID)
```

### 2.2 Game States

To keep track of the game-play logic we created a `gameState` variable, and by convention assigned special meaning to 12 different values:

- **-1:** Game over.
- **0:** Start turn.
- **1:** Create piece highlights. Show the player which of their pieces are playable.
- **2:** Pick the piece to play. Wait for the player to select a piece with the mouse.
- **3:** Destroy piece highlights.
- **4:** Create tile highlights. Show the player which of the tiles are open for their selected piece.
- **5:** Pick the tile to move the piece to. Wait for the player to select a tile with the mouse.
- **6:** Destroy tile highlights.
- **7:** Move the selected piece to the selected tile.
- **8:** Check for pawn evolution.
- **9:** Check for endgame.
- **10:** End turn.

Every frame we check the `gameState` variable and execute a different function depending on the current state. Within each function we update the appropriate part of the game, and move to the next state if applicable. For example, we do not move from `gameState=2` until the mouse is clicked on a playable piece.

### 2.3 Move Generation

Each piece module has two different methods implemented: (1) `getLegalMoves()` and (2) `getLegalMovesRaw()`.

`getLegalMoves()` returns all the moves available to that piece based on the current board configuration. These are unique to each piece type (for instance, rooks can move horizontally across the board until they hit another piece). `getLegalMovesRaw()` returns a subset of the moves available to that piece based on the current board configuration. It removes moves that would allow that piece's team's king to be put in check.

We also define a helper function `safeMove()` in the piece modules which checks if the team's king will still be safe after moving the piece to `(x, y)`. The `getLegalMovesRaw()` uses this function.

### 2.4 Move Simulation and Restoration

To check if a king is safe or in checkmate, it is insufficient to only check the king's surroundings. Instead we need to actually move the king and check the resulting game state to see if it is safe or not. We created two additional functions to help with this: (1) `simulate()` and (2) `restore()`. These functions update the piece's logical position on the board, but not the position of their attached models.

We maintain a lookup table of all the pieces indexed by a member variable from the board. We can get the piece on the board at `(x, z)` by the following code snippet:

```Lua
local index = board.chessboard[x][z].pieceIndex
local piece = pieces[index]
```

Where `board` is the current board game and `chessboard` is a 8-by-8 table that contains the indices of the pieces on every tile.

Using this lookup table, we can do simulation and restoration in an efficient way:

```Lua
-- Update the simulated piece's logical position.
piece.x = newX
piece.z = newZ

-- Update the indices of the board to point to the
-- simulated piece.
board.chessboard[newX][newZ].pieceIndex = piece.index
board.chessboard[oldX][oldZ].pieceIndex = -1
```

### 2.5 Check and Checkmate

After every move, we see if the king is in check. To help with this we made a helper function `isSafe(piece)` that checks the moves of all the pieces of the opposing team. If any move overlaps with the king's position, then the king is in check.

Checkmate is slightly more complicated. We use the previously mentioned `simulate()` and `restore()` methods to simulate moving each of the opposing team's pieces. After each simulation, we check if the king is still safe and then restore that piece. If the king is safe, then the king is not in checkmate. Alternatively, we could also have called `getLegalMoves()` on the king. If the length of the set of moves is 0 then the king is also in checkmate.

After each move we call `isSafe(king)` on the opposing team's king. If the king is not safe, we look further to see if the enemy king is in checkmate. If they are then the player has won the game and we move to the endgame state.

### 2.6 The Digital Clock

In our chess game, each player has a specific amount of time allotted to them. If a player's clock runs out then they have lost the game. We created two separate clocks for each player and maintain variables storing the amount of time left. Every frame, we subtract the time since the last frame (`dt`) to countdown the timer.

```Lua
local currentTimer = {
	min = 5,
	sec = 0,
	dt = 0
}
```

Each player has a total of 5 minutes to make all their moves.

### 2.7 Technical Difficulties

The biggest challenge we faced was debugging our Lua scripts. We often ran into the situation where we mistyped a variable. Rather than alerting us, Lua instead created a new global variable which led to numerous difficult-to-track-down bugs. The most challenging part of programming was implementing the check and checkmate logic.

### 2.8 Further Improvements

Given more time, we would have liked to implement an AI opponent. We would have used the minimax algorithm with alpha-beta pruning to find the optimal move, and then introduced a randomize factor to prevent the AI from being unbeatable. We would also have liked to improve the quality of the sound effects our game uses.
