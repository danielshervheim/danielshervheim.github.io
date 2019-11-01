---
title: Project 3
image: /assets/img/placeholder.jpg
permalink: /coursework/csci-5611/project-3
---

# Project 3
## Path Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/DxKMQp_Z_j0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/3Hd-tyJBBts" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/FHYsOk5XwhA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/rcr8cJHw1XQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This is a joint project between myself and [Ben Lemma](mailto:lemma017@umn.edu). I was primarily responsible for the boids, while he took care of the A* implementation and path-finding. A Github repository with our code is [here](https://github.umn.edu/sherv029/S19_5611/tree/master/Homework 3/Assets).

For local interaction, we implemented Craig Reynold’s boids algorithm.

For our global navigation strategy, we implemented a PRM and A* Path finding. Our PRM generates points in 3d space and is thus fully 3d navigation-wise.

We run a check every 1 second to determine if the goal was changed. If it was, we consult our PRM to find new paths to the goal position. We also check every 1 second if any collider in the scene has changed. If it has, we recalculate the edge list for each node in the PRM, and then recalculate the paths in the same manner as above. We implement A* which allows these real-time calculations in feasible frame-rates. (We initially started with breadth-first search and found it to be too inefficient for real-time use). In short, our path is fully dynamic to both changes to the environment, and changes to the goal.

As a trade-off between speed and desirable behavior, we implement two options for path computation. The faster method recalculates a single path shared between every boid. It uses the flock’s center of mass as the starting position and calculates a path to the goal. Sharing a path in this way reduces computation time as A* needs only be called once per second, rather than linearly in the number of boids. The downside of this optimization is that boids easily become stuck in local minima if they do not have a clear line of sight to the center of mass. To fix this, we implemented another method which calculates unique paths for each voxel in our spatial data structure which a boid occupies, and assign the path to every boid in that voxel. This mitigates the local minima problem while still being more efficient than calculating a unique path for each individual boid.

Additionally, we add a constraint that if a boid is “stuck”, then we recalculate a unique path for it from its current position to the goal. This helps prevent boids from becoming separated and stuck, and aids in preventing traps in local minima. We have not observed any detrimental performance from this. We define “stuck” to be either colliding with the environment more than 5 times in a span of 10 seconds, or having a neighbor count of 0 for more than 5 seconds.

Finally, we implement a spatial data structure by “voxelizing” the boid bounding volume and assigning each boid to its containing voxel. When a boid checks for potential neighbors, it gets a list of all the boids in its own voxel, and the 26 adjacent voxels. Of these neighbors, we first run a “field of view” check to determine if the boid is facing a potential neighbor. (By default, our boids have a field of view of 300 degrees). If it is, we run one final raycast to determine if there are any obstacles between the boids. If not, then the neighbor is considered when the boid calculates its new acceleration.

We model each force described in Reynolds original work (cohesion, alignment, and seperation), as well as two additional forces. A “boundary” force utilizes a distance-based spring-like function to keep the boids contained within a predefined bounding volume. We also model the path generated from the PRM as a force. By default, a boid will start at the “Start” node of the path. Every frame, it will check if it has a clear line of site to each node in the path, and if so it will start moving towards that node. This allows boids which may have a clear line of site to the goal to skip the path, and also ensures that boids which may become stuck in local minima are able to back-track back down the path.

The performance increase from utilizing our spatial data structure cannot be overstated. Without it, we routinely saw frame-rates in the 10-15 fps range for 250 boids. Utilizing our spatial data structure, we averaged 90 fps. We initially implemented our boid simulation on the GPU and were able to simulate around 20,000 boids at usable frame-rates, but it proved to be too time consuming to incorporate our PRM into the GPU model, so we ported our work to the CPU and utilized the spatial data structure to speed up the performance (albeit at far less than 20,000 boids).

We ran into the most difficulty getting A* to work, but the fix ending up being extremely simple. We were initially setting our F and G scores to 0, when they needed to be infinity.
