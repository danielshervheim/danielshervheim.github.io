---
title: Volumetric Lighting
permalink: /coursework/csci-8980/volumetric-lighting
mathjax: true
hide: true
---

# Volumetric Lighting

A project for Dr. Stephen Guy's class **Game Engine Technologies**.

Our directive was to expand upon a topic we found interesting from earlier in the course. I chose to explore real-time volumetric lighting.

## Media

TODO: images here.

## About

TODO: write this.

bla bla bla, below I give a brief word on the physical processes behind light transport, and then give some tips on implementation.

## Physical Background

The reason we see the objects around us is because a photon has bounced off that object and into our eyes. Before it reaches our eyes, it can undergo any of the following events:

1. Absorbtion. The photon is absorbed by a particle and converted into a different form of energy such as heat.
2. Out-scattering. The photon hits a particle and bounces out of the path towards your eye.
3. In-scattering. The photon hits a particle and bounces into the path towards your eye.

Most real-time renderers neglect the effects of the medium on the light before it reaches your eyes. 

TODO: More here??????

![diagram](https://imgur.com/qtu6e3i.png)
> Light that has bounced off of a box interacting with the surrounding medium before reaching the camera.

The radiance at point $p_a$ after travelling through a medium from point $p_b$ can be described with the following equation.



$L(p_a) = L_{out} + L_{in}$



Where $L_{out}$ is the radiance lost between $p_a$ and $p_b$ due to absorbtion and out-scattering, and $L_{in}$ is the radiance gained between $p_a$ and $p_b$ due to in-scattering.



### Equations for Light Lost ($L_{out}$)

TODO: add an image of only reduced radiance.
![reduced-radiance](???.png)
> The above image, with only the reduced radiance visible.

$L_{out}$, also called the *"reduced radiance"* describes how the light that bounced off the object towards your eye is lost before it reaches you. It is equal to the radiance at $p_b$ multiplied by the transmittance between $p_a$ and $p_b$. 



$L_{out} = L(p_b) \times T(p_a, p_b)$



The transmittance describes how light is lost due to absorbtion and out-scattering between two points. It is defined as:



$T(p_a, p_b) = e^{-\int_{p_a}^{p_b}\sigma_e(p)dp}$



Where $\sigma_{e}$ is the extinction coefficient, and is equal to the sum of the absorption coefficient $\sigma_{a}$ and the scattering coefficient $\sigma_{s}$.



$\sigma_e(p) = \sigma_a(p) + \sigma_s(p)$



The absortion and scattering coefficients are properties inherent to the medium, and can vary spatially throughout the medium (hence the dependance on $p$).



### Equations for Light Gained ($L_{in}$)

TODO: add an image of only inscattered light.
![inscattered-light](???.png)
> The above image, with only the inscattered light visible.

The second term, $L_{in}$ describes the radiance gained due to in-scattering as the light travels through the medium.



$L_{in} = \int_{p_a}^{p_b}T(p_a, p) \times \sigma_s(p) \times L_i(p, v) dp$



Where $L_i$ describes the incoming light at point $p$ scattered into the viewing ray $v = (p_{b} - p_{a})$.



$L_i(p, v) = \int_{\Omega} I(p, \omega) \times F(v, \omega) d\omega$



Where $\Omega$ represents the sphere of directions centered over $p$, $I(p, \omega)$ is the intensity of incoming light at $p$ from angle $\omega$, and $F$ is the phase function.



The phase function is inherent to the medium and describes how much light is scattered into the viewing ray $v$ from the incoming light direction $\omega$. The [Henyey-Greenstein](https://www.astro.umd.edu/~jph/HG_note.pdf) phase function is commonly used in computer graphics. It takes a single asymmetry parameter $g = [-1, 1]$ which conveniently describes the amount of back-scattering vs. forward-scattering.



## Implementation Details

TODO: write about my approach in very high level, and give an overview of other possible approaches.

High-level approaches (screen-space post process effect vs. froxel vs. per-volume material/geometry-based approach). Outline pros and cons of each

Screen space effect:
- ^ simple.
- v expensive, wasted effort on pixels not in volume.

Froxel (like AC4)
- ^ less expensive.
- v much more complex, requires compute shaders.

Geometry (like nvidia):
- ^ no wasted pixels.
- v more complex for case when inside volume.
- v doesn't handle intersecting volumes.

TODO: walk through how to implement each of the above equations, and any "gotcha's" someone might encounter.

## Source Code

The source code is available to download [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q).

