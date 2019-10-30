---
title: Project 1
image: /assets/img/placeholder.jpg
permalink: /hidden_projects/csci-5611/project-1
---

[← Back to CSCI 5611](/hidden_projects/csci-5611)

# Project 1
## Particle System

<iframe width="560" height="315" src="https://www.youtube.com/embed/OdgPrdHz6cI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/KyDh5KuZ6vI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/hT2g4IP0Dn8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

A particle system I wrote for a class assignment. I implemented it in the [Unity](https://www.unity3d.com/) engine. The source code, installation instructions, and usage instructions can be found on my Github page [here](https://github.com/danielshervheim/Particle-System-in-Unity).

It supports the following features:

- Custom emitter shapes (rectangle, circle, sphere, and cone).
- Custom spawn rate (i.e. X particles per Y seconds).
- Change in appearance over time (albedo, emission, size, transparency, and speed).
- Real-time gravity vector (can be used to simulate wind, for instance).
- Real-time coefficient of restitution (with a randomization factor to help hide the perfect “steppes” that arise when every particle has the same C.O.R.).
- Static and dynamic box and sphere colliders.

The particle system is initialized on the CPU. I calculate starting positions and velocities for each particle, then upload them to the GPU to advance the simulation each frame. Each particle is rendered as a quad, through GPU instancing and custom shaders.

Because each particle lives on the GPU, my system spawns the maximum number of particles initially. Every particle starts with a “spawn timer” which ticks down. The particle will not appear until the timer has run out. Once a particle dies, it returns to its original position and velocity. This gives the appearance of spawning particles over time, while removing the need for costly CPU-GPU communication every frame to instantiate and destroy particles.

Sphere and box colliders are also uploaded to the GPU (each frame, at a slightly increased computational cost, or on initialization). This enables the particles to react to the environment (this is demonstrated in the fountain demo).

The coefficient of restitution (which controls the particles “bounciness”) and the gravity vector are updated each frame as well. This allows for complex wind-like behavior.
