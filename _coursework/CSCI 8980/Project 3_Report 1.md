---
title: Use of Animation
image: /assets/img/placeholder.jpg
permalink: /coursework/csci-8980/project-3/report-1
---

<!-- [← Back to Project 3](/coursework/csci-8980/project-3) -->

# Use of Animation

Our goal was to have the animation appear as natural as possible, as if an invisible hand were picking up and moving each piece.

From a technical perspective, every animation occurs over a period of frames. Each frame, the animation has available a parameter `t` which acts as a timer for the animation. The `t` parameter is 0 on the first frame of the animation, and increases linearly until it reaches 1 on the last frame of the animation.

We also ported an [open source easing library](https://github.com/nicolausYes/easing-functions/blob/master/src/easing.cpp) to Lua for use in our project.

## The Cursor

The cursor follows the mouse around and acts as an indicator of which tile the player is currently selecting. It also shrinks slightly over highlighted pieces and tiles to indicate to the player that a move can be made at that location.

The cursor has two properties associated with it: (1) the current position and (2) the target position. The target position is updated when the mouse moves over any tile. The current position is updated each frame as a blend of the current position and the target position. The effect is that the cursor moves towards the target position, decelerating as it gets closer.

```lua
local blend = clamp(dt * cursorFollowSpeed, 0, 1)
cursorPos = (1-blend)*cursorPos + (blend)*targetCursorPos
```

Equivalent properties exist for the cursor scale. The target scale is set to 0.75 if the mouse is over a **highlighted** piece or tile, and 1.0 otherwise. The current scale is updated each frame as a blend of the current scale and the target scale.

```lua
local blend = clamp(dt * cursorScaleSpeed, 0, 1)
cursorScale = (1-blend)*cursorScale + (blend)*targetCursorScale
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/vAgsTDp-LSw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> Note how the cursor follows the mouse, and shrinks/expands over highlighted tiles.

## The Highlights

Each playable piece and tile has a small highlighted circle that appears under it. The highlights indicate to the player which piece can be played, and where. When the highlight is created, its scale is set to 0 initially and scaled up until it reaches 1. We used an exponential scale function over a linear one because it was more interesting visually.

```lua
-- easeOutExponential = 1 - 2^(-8*x)
highlightScale = easeOutExponential(t)
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/GiFm_zoxh0k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> Note how the highlights pop out as the player selects a piece, and pop in to show the open tiles that piece can move to.

## The Pieces

Our goal in animating the pieces was for them to appear as natural as possible. We spent a lot of time making sure the pieces looked realistic while static, and wanted to preserve that in motion as well.

When a piece moves, its position and rotation are animated. We also experimented with animating the scale for a squash-and-stretch effect, but decided against it. We felt it looked unnatural with the solid wooden pieces.

We update the piece X and Z (horizontal) positions separately from the Y (vertical) position. On the XZ plane, the piece position is just a linear interpolation between the start and goal positions. We then remap the `t` parameter into a [triangle wave](https://www.desmos.com/calculator/85wzbqowpx) (going from 0 → 1 → 0 over the original 0 → 1 range). The remapped `t` is then raised to a power to smooth it out, resulting in a parabolic arc-esque function.

```lua
-- Move the piece along the XZ plane.
piecePosXZ = (1-t)*startPiecePosXZ + (t)*goalPiecePosXZ

-- Move the piece vertically.
local triangleT = 1 - abs(2*t - 1)
piecePosY = triangleT^(1.5)
```

We also update the rotation as well. There are two components to the rotation. The first is a rocking motion perpendicular to the movement direction. This gives the effect that the piece is being picked up.

```lua
-- Calculate the exact angle of the rock based on t.
local pieceAngle = rockingAmplitude * sin(2*math.pi*t)

-- Rotate the piece perpendicular to the movement direction.
rotateModel(pieceID, pieceAngle, -dirZ, 0, -dirX)
```

The second component is a rotation towards the movement direction. This gives the effect that the piece is moving itself towards its goal.

```lua
-- Calculate the angle of the movement direction.
local targetAngle = math.atan2(-dirX, -dirZ)

-- Calculate the current rotation of the piece as a combination of the piece's current rotation and the target angle.
-- easeOutExpo = 1 - 2^(-8x)
local pieceAngle = lerpAngle(curPieceAngle, targetAngle, easeOutExpo(t))

-- Rotate the model by the angle, parallel to the movement direction.
rotateModel(pieceID, pieceAngle, dirX, 0, dirZ)
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/EMpxOsucmt4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> Note how the piece rocks back and forth slightly during its move, and how it rotates towards its goal.

<iframe width="560" height="315" src="https://www.youtube.com/embed/snsW9WrOyNs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> The canned squash-and-stretch effect. We decided against it as we felt it looked unnatural with the wooden pieces.

## The Camera

After each player's turn we animate the camera switching to the other side of the board. This indicates that the turn has changed, and is also less jarring than a cut-and-switch transition.

Unlike the pieces integrated into the model system of the engine, the camera is represented by nine vectors (`position.xyz`, `direction.xyz`, and `up.xyz`). Since we didn't have the `translateModel()` and `rotateModel()` functions available to us, the math was a bit more complicated.

We reset the camera transform, and center it over the board. We then move the camera back in the Z direction, and essentially "swing it in a circle" around the board until it's at the correct position. Finally, we rotate the camera as well so it's always facing the center of the board.

<iframe width="560" height="315" src="https://www.youtube.com/embed/sqBlhMu_UQQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> Note how the camera moves in a circle around the center of the board, and always faces inwards.
