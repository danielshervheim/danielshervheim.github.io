---
title: Project 2
image: /assets/img/placeholder.jpg
permalink: /hidden_projects/csci-5611/project-2
---

[← Back to CSCI 5611](/hidden_projects/csci-5611)

# Project 2
## Physical Simulation

## 1. Cloth Simulation

<iframe width="560" height="315" src="https://www.youtube.com/embed/yDs7N-dbP4A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/J_5PoH2mDCg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/06mVig4gw7A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Cqj74mSNtGo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/I_Ga4QWulWg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Vrs03UxBzfc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

A cloth simulation I wrote for a class assignment. I implemented it in the [Unity](https://www.unity3d.com/) engine. The source code, installation instructions, and usage instructions can be found on my Github page [here](https://github.com/danielshervheim/Cloth-Simulation).

The cloth is represented as a grid of nodes, and is affected by five forces:

1. Gravity.
2. Springs.
3. Wind.
4. Air resistance.
5. Collision with objects.

#### Gravity

Each node is pulled down by the force of gravity.

#### Springs

Each node is connected to its neighbors by a series of springs:

1. **Parallel** springs bind adjacent nodes horizontally and vertically across the grid. They help preserve the overall structure of the cloth.
2. **Diagonal** springs bind adjacent nodes diagonally across the cloth. They help prevent shearing as the cloth moves.
3. **Bending** springs are similar to diagonal springs.  They bind every second node (rather than adjacent nodes) diagonally  across the cloth. They help prevent excessive deformation as the cloth  moves.

#### Wind

Each triangle is pushed by a user-defined wind vector, proportional to the percentage of the triangle facing the wind.

#### Air Resistance

Each triangle also resists the air as it moves, proportional to its area.

#### Collision with Objects

Finally, the cloth reacts to any number of user-defined sphere colliders. These can be moved in real-time.

Collision detection is (currently) not continuous, so fast moving  nodes, or fast moving sphere colliders may result in missed collisions.  I.e. objects may appear to "phase through" the cloth, if either are  moving fast enough.

## 2. Fluid Simulation

<iframe width="560" height="315" src="https://www.youtube.com/embed/aUgFWNUzMw0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

A fluid simulation I wrote for a class assignment. I implemented it in the [Unity](https://www.unity3d.com/) engine. The source code, installation instructions, and usage instructions can be found on my GitHub page [here](https://github.com/danielshervheim/Fluid-Simulation).

It is heavily inspired by the work of Jos Stam and his excellent paper “[*Real-Time Fluid Dynamics for Games*](https://pdfs.semanticscholar.org/847f/819a4ea14bd789aca8bc88e85e906cfc657c.pdf)*.”*

In CPU based fluid solvers, the bottleneck is generally the size of  the simulation grid. To alleviate these problems, I implemented my  solver on the GPU via Unity's ComputeShader interface. This greatly  increased the speed of the resulting simulations. My computer was able  to simulate a 1024 × 1024 grid at interactive frame rates (> 60 fps).

I also included a CPU-only implementation for reference. (In  comparison, my computer was only able to simulate a 64 × 64 grid at  interactive frame rates with the CPU version).
