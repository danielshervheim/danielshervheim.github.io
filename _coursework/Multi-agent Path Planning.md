---
title: Multi-agent Path Planning
image: /assets/img/cover_photos/flocking.png
permalink: /coursework/csci-5611/multi-agent-path-planning
mathjax: true
hide: true
---

# Multi-agent Path Planning

A project for Dr. Stephen Guy's class **Animation and Planning in Games**. My classmate [Ben Lemma](mailto:lemma017@umn.edu) and I collaborated on this project.

Our directive was to implement a real-time system capable of planning paths for multiple agents in a dynamic environment.

## Media

<!-- dynamic obstacles -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/DxKMQp_Z_j0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- performance -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/3Hd-tyJBBts" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- more examples -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/FHYsOk5XwhA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- behind the scenes -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/rcr8cJHw1XQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## About

Our path planner consists of two sub-systems: 1) global navigation and 2) local navigation. Ben was primarily responsible for the global navigation, and I handled the local navigation.

### 1. Global Navigation

The global navigation system is responsible for answering the question *"how do I get from point A to point B without colliding with the environment?"*.

We decided to implement a probabilistic road map (PRM).

We start by randomly generating a set of points within our environment. We discard any points generated within an environment mesh. We also push points away from environmental meshes if they are closer than a specified threshold.

We then shoot rays between each pair of points to determine which pairs are unobstructed by the environment. We place edges between mutually-visible point pairs to build a graph. The resulting graph represents the valid paths for a single agent through the environment. We recompute pair-wise visibility and update the edges at a specified interval (for the above videos we used an interval of 1 second).

It is too costly for each agent in the flock to generate their own unique path from the start to the goal, so we consider the center-of-mass of the flock as a single agent. We then take the nearest visible node and consider it as the starting point. (The ending point is specified by us and can be moved dynamically). Once we have our starting node and goal node, we use A* to find the shortest path between both points. We recompute the path in the same way each time the graph is updated.

Each agent receives a "goal" force which pushes it towards the next node in the path towards the goal. Because each agent shares the same path, some of them tend to become stuck in local minima or maxima. If we detect that an agent has become stuck, we break it away from the main path and recompute a unique path from the agent's current position to the goal. We define an agent to be stuck if it collides with the environment more than 5 times in 10 seconds, or has no neighbors within a specified radius for more than 10 seconds.

Because we recompute the graph (and therefore the path) continuously, the agents can navigate from their current position to the goal regardless of how the environment changes.

### 2. Local Navigation

The local navigation system is responsible for answering the question *"how do I move forward without running into my neighbors?"*.

We decided to implement Craig Reynold's famous [boid](https://www.red3d.com/cwr/boids/) algorithm.

Each boid decides how to move based on it's neighbors. Reynold describes three forces that govern the movement of a single boid.

1. A cohesion force guides the boid towards the center of mass of it's neighbors.
2. An alignment force guides the boid towards the average heading of it's neighbors.
3. A separation force guides the boid away from it's nearest neighbors.

These three rules are enough to produce complex emergent behavior. In addition to these three forces, we model an additional "boundary" force (a simple spring-like force that discourages the boids from leaving a specified bounding volume), and a "goal" force (described above).

The boid algorithm is a classic example of an $O(N^2)$ problem. Each boid must consider every other boid. For a large number of boids this quickly becomes a problem. To alleviate this problem we also implented a spatial data structure.

The flock is confined to a specified bounding volume. We voxelize the volume into discrete cells and maintain a list of boids within each cell. When a boid wants to get a list of it's neighbors, it only needs to query it's own cell to figure out it's neighbors.

After determining a list of neighbors by distance, we further prune the list by discarding boids outside of a specified field of view. Finally, we prune the list further by discarding boids which are separated by obstacles (as determined by a ray-cast).

Once the final neighbor list is calculated, we then apply the above forces derived from the neighbor list. This process is repeated for every boid, on every frame.

## Source Code

We implemented out path planner in Unity. Our path planner is completely separate from the built-in navigation and physics systems.

The source code is available to download [here](https://github.umn.edu/sherv029/S19_5611/tree/master/Homework 3/Assets).
