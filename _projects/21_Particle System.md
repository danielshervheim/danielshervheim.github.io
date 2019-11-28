---
title: Particle System
image: /assets/img/cover_photos/particle_system.jpg
permalink: /projects/particle-system
---

# Particle System

In spring 2019 I took **Animation and Planning in Games** with Dr. Stephen Guy. I wrote this particle system for his course.

Our directive was to implement a particle system capable of handling a large number of particles in real-time. I chose to offload the simulation and rendering components to the GPU via compute shaders. This allowed me to simulate a hundreds of thousands of particles in real-time.

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/OdgPrdHz6cI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/KyDh5KuZ6vI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/hT2g4IP0Dn8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Features

- Rectangle, circle, sphere, and cone emitters.
- Box and sphere colliders.
- Change a particle's behavior over time (color, size, transparency, and speed).
- Custom spawn rate (e.g. X particles per Y seconds).
- Custom gravity vector.
- Custom coefficient of restitution (with a randomize option).

## About

I initialize the particle system on the CPU. I calculate starting positions and velocities for each particle, then upload them to the GPU.

To avoid costly CPU-GPU communication each frame, I spawn the maximum number of particles at the beginning of the simulation and upload them to the GPU before the simulation starts. I then avoid updating a percentage of the particles until the desired spawn-rate has been achieved.

I also maintain a list of sphere and box colliders on the CPU. I upload them to the GPU (either once at initialization, or each frame).

I update the particles in parallel on the GPU each frame. I also perform collision detection between each particle and all of the colliders on the GPU. This enables the particles to react to the environment. Once a particle has died, I reset its position and velocity to recycle it.

## Source Code

I implemented my particle system in Unity. My particle system is completely separate from the built-in particle and physics systems.

The source code is available to download [here](https://github.com/danielshervheim/Particle-System).
