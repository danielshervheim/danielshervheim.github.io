---
title: CSCI 8980 Project 1
image: /assets/img/placeholder.jpg
permalink: /coursework/csci-8980/project-1
---

# Project 1
## Asteroid Run

<iframe width="560" height="315" src="https://www.youtube.com/embed/u62XxwUIDcw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

![screenshot](https://imgur.com/t9RPU0Z.png)

## About

**Asteroid Run** is an endless runner set in the far reaches of the cosmos. As the captain, your goal is to pilot your starship and explore the final frontier for as long as you can. The longer you survive, the more points you gain!

- Drag your mouse left and right to steer your ship around asteroids and collect fuel cells.
- Left click to ignite your boosters and launch yourself upwards. Be sure to watch your fuel gage!
- Right click to idle your engine, and regenerate fuel. But be careful not to fall out of view.
- Avoid asteroids, and don't let yourself fall below the screen. Otherwise it's game over!



## Planned Features

I had initially planned to add a blaster component which would allow you to break apart large asteroids into smaller, more manageable chunks.

In the future I would like to refine the gameplay by further tweaking the parameters (ship speed, asteroid speed, asteroid spawn rate, etc).

I would also like to improve the sound design of the game. Currently there are sound effects for the button presses, fuel cells, and asteroid collisions. I would like to add a sound effect to the ship, especially when it boosts or powers off.

Finally, I would like to add more visual effects such as a bloom around the ship's boosters, textures on the asteroids, and improved flame trails.

![concept art](https://imgur.com/XxCmDtH.png)
>Concept art, how I wanted the game to look ideally.



## Key Algorithms and Techniques

### Numerical Integration

Asteroids, stars, and fuel cells have a constant velocity and are updated by numerical integration each frame. The ship itself is updated by a numerical integration process each frame, but also experiences acceleration and deceleration based on whether the boosters are ignited and whether the engine is idling or not.

### Parallax Effect

The stars in the background experience a parallax effect to help give the user a sense of depth.

Each star has a unique "offset" (between 0.25 and 1.5) which is generated at the start of the game. Each star's radius is then multiplied by it's offset to give the appearance of depth. Each star's speed is also multiplied by it's offset so that "nearer" stars appear to move faster. Finally, each star's x position is multiplied by the inverse of the mouse's x position to complete the parallax effect.

### Procedural Asteroid Shapes

Each asteroid has a unique shape that is procedurally generated at spawn time. The algorithm first generates a circle of 9 vertices. Each vertex is then randomly offset by a tiny amount in the x and y directions. The result is an asteroid that is roughly circular, but also looks unique from any other.

### Screen Space Collision Detection

Because each asteroid has a different shape, collision detection is not a trivial problem.

I looked into ways to triangulate the asteroids, after which I could do a series of triangle-triangle collision checks with the ship. However, triangulation of a potentially non-convex shape ended up being a harder problem than I wanted to tackle in the limited amount of time, so I turned to another approach.

In the end, I went with a screen space approach. It went like this:

- Set the render target to an empty texture
- Clear the background to black (0, 0, 0, 1)
- Change the blending mode to ADD
- For each asteroid
  - Render the asteroid in green (0, 1, 0, 0)
- For each fuel cell
  - Render the fuel cell in blue (0, 0, 1, 0)
- Render the ship in red (1, 0, 0, 0)
- Reset the blending mode to DEFAULT
- For each pixel in a box around the ship
  - If the pixel is magenta (1, 0, 1, 1) then return FUEL CELL COLLISION
  - if the pixel is yellow (1, 1, 0, 1) then return ASTEROID COLLISION
- return NO COLLISION

The downside is that the scene must be rendered *almost* twice (in the collision texture, only the asteroids, fuel cells, and ship need to be rendered. No special effects are required).

![collision texture](https://imgur.com/f7OxvUc.png)
>Example of a collision texture.



## Bottlenecks and Limitations

Initially the screen space collision detection was a bottleneck. I was checking every pixel in the collision texture for magenta and yellow pixels. It ran, but very slowly and with much lag. It then occured to me that I only care about the ship itself, so rather than checking every pixel in the collision texture I just checked a small box of pixels centered around the ship.

I also had a bloom effect in the game initially. After the normal scene rendered, I duplicated it, blurred it, adjusted the contrast, then additively re-rendered the blurred image over the original image. The effect was nice, but the blur operations was too slow and the result was too laggy. Given more time I would like to implement my own gaussian blur filter as a series of 1D convolution kernels rather than a 2D convolution kernel. Doing so would speed up the blur operation. I would then only blur areas of the original image which I know contain color values > 1 (i.e. only areas where bloom would make a difference, visually).



## Processing as a Game Engine

The feature I found myself missing the most from a more full-featured game engine was a UI / layouting system. I had to create my own ```button()``` method to handle button clicks on the screen, and laying out my UI elements was a frustrating exercise in guessing the correct height and y position.

A dedicated scripting system would have made develpoment easier as well. I'm used to Unity's MonoBehaviour system, where each "object" in your game can have multiple components attached to it (all derived from MonoBehavior), and the components themselves just override certain methods (e.g. `Start()` and`Update()`). Given more time, I would have liked to implement something like this in Processing.

I also missed having more control over the rendering. Processing is good for simple geometric shapes, but any complex 3D models, materials, or shaders are more involved.



## Game Setup

My game has 3 states: MAINMENU, PLAY, GAMEOVER. I made an enum to keep track of these different states. Every frame, a different set of code runs depending on the current game state.

In each state, there are a series of checks to determine if the game state should change. For instance, in the MAINMENU state, we can only change to the PLAY state if the play button was pressed.

![state machine](https://imgur.com/zvNqF1C.png)
>Graph of the game state flow.



The game itself is fairly simple, consisting of only stars, asteroids, fuel cells, and a ship. Each of these is represented in their own class, and each has the following methods:

- `Update(float deltaTime)`
- `Draw()`

Objects which can collide with each other additionally have a `DrawCollider(PGraphic collisionTexture)` method to draw themselves into the collision texture.

Then, every frame the following algorithm updates the objects:

- For each star
  - Update, then draw
- For each asteroid
  - Update, then draw
- For each fuel cell
  - Update, then draw
- Update, then draw the ship

Each class is responsible for its own implementation of "Update" and "Draw". For example, we may update the ship by making it follow the mouse. But we may update the asteroid by destroying it and spawning a new one in if its below the window.



## Credits

**Asteroid Run** is a simple game written in [Processing](https://processing.org/). It uses the [processing-sound](https://processing.org/reference/libraries/sound/) library, free sound effects from [SoundBible](http://soundbible.com/), and free fonts from [Google Fonts](https://fonts.google.com/). The rest of the work is my own.



## Source Code

The source code is available to download [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q?usp=sharing).
