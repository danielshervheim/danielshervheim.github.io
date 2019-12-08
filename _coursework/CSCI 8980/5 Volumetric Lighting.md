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

The simplest illumination model is that of light propogating in a vacuum. The light that bounces off of a surface is able to reach your eye unobstructed. In other words, radiance is constant between two points.



In actuality, light often travels through a medium such as air or water before it reaches your eye. If the medium contains particles that interact with light, we call it a *"participating medium"*. Depending on the composition and concentration of the medium, any of the following events can occur:

1. **Absorbtion**. The light is absorbed by a particle and converted into a different form of energy such as heat.
2. **Out-scattering**. The light hits a particle and bounces out of the path towards your eye.
3. **In-scattering**. The light hits a particle and bounces into the path towards your eye.



### Light Propogation in Participating Media



The light reaching your eye at point $p_a$ after travelling through a medium from a surface at point $p_b$ is described by following equation.



---

$L = L_{out} + L_{in}$

---



Where $L_{out}$ is the light lost between $p_a$ and $p_b$ due to absorbtion and out-scattering, and $L_{in}$ is the light gained between $p_a$ and $p_b$ due to in-scattering.



### How Light is Lost

TODO: add an image of only reduced radiance.
![reduced-radiance](???.png)
> The above image, with only the reduced radiance visible.



$L_{out}$ describes the light lost due to absorbtion and out-scattering before it reaches your eye. It is defined as:



---

$L_{out} = I(p_b, -v) \times T(p_a, p_b)$

---



$I$ Is the light at point $p_b$ travelling towards your eye from direction $-v = (p_a - p_b)$.

$T$ is the transmittance, a measure of the original light at $p_b$ that reaches your eye at $p_a$ as a function of the distance travelled. It is defined as:



---

$T(p_a, p_b) = e^{-\int_{p_a}^{p_b}\sigma_e(p)dp}$

---



$\sigma_{e}$ is the extinction coefficient, equal to the sum of the absorption coefficients $\sigma_{a}$ and scattering coefficients $\sigma_{s}$. The absortion and scattering coefficients are properties inherent to the medium.



> Note that $0 \le T \le 1$. In other words, light is never gained due to absorbtion and/or out-scattering.



### How Light is Gained

TODO: add an image of only inscattered light.
![inscattered-light](???.png)
> The above image, with only the inscattered light visible.

$L_{in}$ describes the light gained due to in-scattering between $p_a$ and $p_b$. It is defined as:



---

$L_{in} = \int_{p_a}^{p_b}T(p_a, p) \times \sigma_s(p) \times L_i(p, v) dp$

---



$L_i$ describes the light at point $p$ scattered into the viewing ray $v = (p_{b} - p_{a})$. It is defined as:



---

$L_i(p, v) = \int_{\Omega} I(p, \omega) \times F(v, \omega) d\omega$

---

$\Omega$ represents the sphere of directions centered over $p$.

$I$ is the light at $p$ travelling from direction $\omega$.

$F$ is the phase function. It is inherent to the medium and describes the percentage of light from direction $\omega$ that is scattered into the viewing ray $v$.



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

