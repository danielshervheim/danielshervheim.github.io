---
title: Cloth Simulation
image: /assets/img/cover_photos/cloth_simulation.png
permalink: /coursework/csci-5611/cloth-simulation
---

# Cloth Simulation


In spring 2019 I took **Animation and Planning in Games** with Dr. Stephen Guy. I wrote this cloth simulation for his course.

Our directive was to implement a physically-based cloth simulation that could interact with the world in real-time.

## Media

<!-- Wind Contribution -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/06mVig4gw7A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- Air Resistance -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/J_5PoH2mDCg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- Spring Contributions -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/Vrs03UxBzfc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- Collision Detection -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/yDs7N-dbP4A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## About

The cloth is based on the mass-spring-damper model. I import a triangulated square mesh and use the vertices as my point-masses. Each vertex is connected to its neighbors by an array of springs. I then update the cloth each frame by integrating the effects of five unique forces.

### 1. Springs

Each vertex is connected to its neighbors by a series of springs.

1. **Parallel** springs connect adjacent vertices horizontally and vertically. They help preserve the overall structure of the cloth.
2. **Diagonal** springs connect adjacent vertices diagonally. They help prevent shearing as the cloth deforms.
3. **Bending** springs are similar to diagonal springs. They connect twice-adjacent vertices diagonally. They help prevent excessive deformation under high force deformation.

Each spring pulls the connected vertices towards each other, in an attempt to maintain a specified spring rest length.

### 2. Gravity

Each vertex is pulled down by a specified gravity force vector.

### 3. Wind

Each triangle is pushed by a wind force. The force is proportional to the percentage of the triangle perpendicular to the specified wind direction vector. The force on the triangle is then distributed across the triangle's vertices.

### 4. Drag

Each triangle is pushed opposite to it's velocity by a force proportional to it's area.

### 5. Collision

While not a physically-based force, each vertex also avoids penetrating a list of specified sphere colliders. If a vertex has penetrated a sphere collider, I move it back to the nearest point on that colliders's surface.

The collision detection method I chose is not continuous. A collision might be missed if the cloth is under intense force, or the collider is moving quickly.

## Source Code

I implemented my cloth simulation in Unity. My cloth simulation is completely separate from the built-in cloth and physics systems.

The source code is available to download [here](https://github.com/danielshervheim/Cloth-Simulation).
