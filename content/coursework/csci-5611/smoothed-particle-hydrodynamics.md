---
title: Smoothed-particle Hydrodynamics
image: /assets/img/sph/sph.png
permalink: /coursework/csci-5611/smoothed-particle-hydrodynamics
hide: true
---

# Smoothed-particle Hydrodynamics

A project for Dr. Stephen Guy's class **Animation and Planning in Games**. My classmates [Ben Lemma](mailto:lemma017@umn.edu), [Q Bayo](mailto:bayo0006@umn.edu), and I collaborated on this project.

Our directive was to expand upon a topic we found interesting from earlier in the course. We chose to explore smoothed-particle hydrodynamics.

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/ltnG4ZWAdxA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## About

Smoothed-particle hydrodynamics (SPH) is a method for simulating fluids. For this project we wanted to implement it ourselves and render the resulting simulation. Ben and Q were primarily responsible for the simulation, and I handled the rendering.

### 1. Simulation

For the simulation we drew heavily from Simon Clavet's paper *[Particle-based Viscoelastic Fluid Simulation](https://dl.acm.org/citation.cfm?id=1073400)*.

One of the most important effects in realistic looking fluid simulations is incompressibility. Mass must be conserved, areas of high density fluid must flow to areas of lower density fluid in an attempt to equalize the pressure. We capture this phenomenon by connecting every pair of particles with a virtual spring. The springs model the pressure a single particle experiences from its neighbors. The magnitude of the spring force is calculated by summing up the inverse squared distance of each neighbor particle within a specified radius.

We then use standard eulerian integration to calculate the particles new velocities and positions. Finally, we restrict the particles positions within a specified bounding volume. If a particle escapes the bounding volume, we clamp it's position within the bounding volume and reflect it's velocity by the bounding volume normal.

### 2. Rendering

For the rendering we drew heavily from Wladimir Van der Laan's paper *[Screen Space Fluid Rendering with Curvature Flow](https://dl.acm.org/citation.cfm?id=1507164)*.

We use two cameras: the first camera draws the scene normally (with no fluid), and the second camera renders a sphere at each particle location.

We take the depth texture from the sphere camera and smooth it with a bilateral filter. The filter replaces the appearance of individual spheres with that of a smooth, continuous surface.  It was important to use the bilateral filter (rather than a gaussian filter) as the bilateral filter doesn't blur edges. This allowed us to smooth out neighboring areas while still maintaining meaningful visual divisions between the various parts of the fluid.

We then reconstruct each fragment's world position from the smoothed depth map. We also take the screen-space derivatives of the world position to calculate the fragment's normal. Once the we've calculated the fragment's normal we can shade it as we would any standard mesh.

The only part of Van der Laan's paper we didn't implement is the density-based transparency. Van der Laan renders an additional pass on the sphere camera with additive blending to approximate the depth (from front-facing boundary to back-facing boundary) of the fluid. Rather than estimating the density, we give the fragment a uniform 50/50 blend between the fluid color and the scene color.

The advantage of rendering the fluid in screen space is that the complexity is dependent not on the number of particles, but only on the percentage of the screen filled with fluid.

## Source Code

The source code is available to download <a href="https://github.umn.edu/sherv029/S19_5611/tree/master/Homework 5/Assets/">here</a>.
