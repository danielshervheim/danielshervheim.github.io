---
title: Crosshatch Effect
image: /assets/img/placeholder.jpg
permalink: /projects/design-challenge-crosshatch
hide: true
---

# Crosshatch Effect

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/BZ6p3Yt_1oQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

![ch1](/assets/img/design-challenge/ch1.png)

![ch2](/assets/img/design-challenge/ch2.png)

![ch3](/assets/img/design-challenge/ch3.png)

## About

I was inspired by the non-photorealistic crosshatch style of drawing, so I attempted to recreate it in a shader!

The shader works in two passes. The first pass is a fairly standard extruded back-face outline, while the second pass samples from a custom crosshatch texture based on the intensity of the light. I also utilized a curvature map to accentuate cavities that would not have otherwise been picked up by the outline pass.

The key effect that I noticed from studying crosshatch style drawings was that the crosshatch lines tended to follow the curvature of the surface. I tried to recreate this effect by UV unwrapping the 3D model and aligning the UV islands against the crosshatch direction.

## Credit

- Crosshatch textures by [Hernan Liatis](https://sites.google.com/site/cs7490finalrealtimehatching/files){:target="_blank"}
- David model by [Statens Museum for Kunst](https://www.myminifactory.com/object/3d-print-head-of-michelangelo-s-david-52645){:target="_blank"}

## Source Code

The source code is available on Github [here](https://github.com/danielshervheim/design-challenge){:target="_blank"}. The relevant shader is located in the repo above, but [here](https://github.com/danielshervheim/design-challenge/blob/master/src/Cross%20Hatch%20Effect/Assets/Shaders/CrossHatch.shader){:target="_blank"} is a direct link for your convenience.
