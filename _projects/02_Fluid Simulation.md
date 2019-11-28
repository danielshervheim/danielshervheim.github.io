---
title: Fluid Simulation
image: /assets/img/cover_photos/fluid_simulation.jpg
permalink: /projects/fluid-simulation
---

# Fluid Simulation

In spring 2019 I took **Animation and Planning in Games** with Dr. Stephen Guy. I wrote this fluid simulation for his course.

Our directive was to implement a physically-based simulation in real-time. I chose to offload the simulation to the GPU via compute shaders. This allowed me to simulate a 1024 × 1024 grid in real-time.

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/aUgFWNUzMw0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## About

I referenced Jos Stam's paper *[Real-Time Fluid Dynamics for Games](https://www.researchgate.net/publication/2560062_Real-Time_Fluid_Dynamics_for_Games)* heavily in my implementation.

The basic idea is that two grids are kept: a grid of densities and a grid of velocities.

The density grid can be modified by depositing additional densities into certain grid cells. (Imagine using an ink-dropper to drop ink into a basin of water). The velocity grid can be modified by applying forces to certain grid cells. (Imagine waving your hand through the basin of water).

The density grid is then advected. In essence, each cell in the density grid looks up the velocity at the corresponding position in the velocity grid. The cell then takes a portion of its density, follows the velocity, and deposits the density in a neighboring cell. The velocity grid is then advected in the same way.

In CPU-based fluid solvers, the bottleneck is typically the size of the simulation grid. To alleviate these problems, I implemented my  solver on the GPU via compute shaders. This allowed me to solve the advection of cells in parallel, and greatly increased the speed of the resulting simulation.

I consistently measured 60 fps while simulating over a 1024 × 1024 grid. I also wrote a reference CPU-only version. For comparison, I was only able to simulate a 64 × 64 grid at 60 fps.

## Source Code

I implemented my fluid simulation in Unity. My fluid simulation is completely separate from the built-in physics system.

The source code is available to download [here](https://github.com/danielshervheim/Fluid-Simulation).
