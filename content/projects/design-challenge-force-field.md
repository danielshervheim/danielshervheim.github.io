---
title: Force Field Effect
permalink: /projects/design-challenge-force-field
hide: true
---

# Force Field Effect

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/dnoArskx_2Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

![ff1](/assets/img/design-challenge/ff1.png)

![ff2](/assets/img/design-challenge/ff2.png)

![ff3](/assets/img/design-challenge/ff3.png)

![ff4](/assets/img/design-challenge/ff4.png)

![ff5](/assets/img/design-challenge/ff5.png)


## About

The vertex shader uses a noise texture in combination with the uv coordinates to subtly push the vertices outwards, resulting in an undulating appearance.

The fragment shader uses the same noise texture to generate a distortion vector with which I sample the color and depth buffers. I then generate a few masks: one isolates the base of the force field, one isolates the edges of the force field, and one isolates the intersecting objects of the force field. I use these masks to apply a glowing effect.

I also wrote a script to turn on/off the force field as well. The script just passes in values from 0...1 and the shader offsets its height mask to give the appearance that it is shrinking or retracting.

Finally, I also keep track of the player position in relation to the boundary. If the player is within a certain distance, then I fade out the force field effect. This is to hide the jarring transition from back-face to front-face culling that occurs when the player enters and exits the force field.




## Credit

- Distortion Texture by [Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/texture-distortion/animating-uv/flowmap.png)
- Stanford Bunny model by [3D graphics 101](https://sketchfab.com/3d-models/stanford-bunny-zipper-reconstruction-res-2-2a73d9758327485989690fe67f0ffb74)

## Source Code

The source code is available on Github [here](https://github.com/danielshervheim/design-challenge). The relevant shader is located in the repo above, but [here](https://github.com/danielshervheim/design-challenge/blob/master/src/Force%20Field%20Effect/Assets/Shaders/ForceField.shader) is a direct link for your convenience.
