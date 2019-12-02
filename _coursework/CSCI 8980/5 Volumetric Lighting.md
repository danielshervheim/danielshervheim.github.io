---
title: Volumetric Lighting
permalink: /coursework/csci-8980/volumetric-lighting
mathjax: true
hide: true
---

# Volumetric Lighting

A project for Dr. Stephen Guy's class **Game Engine Technologies**.

Our directive was to expand upon a topic we found interesting from earlier in the course. I chose to explore real-time volumetric lighting.

## 1. Physical Background

The radiance at point $p_a$ after travelling through a medium from point $p_b$ can be described with the following equation.

<!-- $L(p_x)$ = the radiance at point $p_x$. -->

<!-- $L(p_x, \omega)$ = the radiance at point $p_x$ from direction $\omega$. -->

<!-- L(x, y) = the radiance at point x from point y after undergoing scattering through a medium. -->

<!-- Li(x, w) = the radiance at point x scattered into direction w = integral over all direction d (phase(w, d)*L(x, d)) dd -->



$L(p_a, d_{ba}) = T(p_a \leftrightarrow p_b)*L(p_b) + \int_{p_a}^{p_b}T(p_a \leftrightarrow p)*\sigma_{s}*L_i(p)dp$

$L_i(p, v_{ab}) = \int_{\Omega} L(p, \omega)*F(\theta)d\omega$



<!-- $\o_{xy} = | p_y - p_x |$ -->



The first term $T(p_a \leftrightarrow p_b)*L(p_b)$ describes the radiance from $p_b$ that reaches $p_a$ after enduring outscattering in the medium.



The second term $\int_{p_a}^{p_b}T(p_a \leftrightarrow p)*\sigma_{s}*L_i(p)dp$ describes the radiance scattered into the ray between both points.



### Outscattering

The transmittance $T$ between two points $p_a$, $p_b$ is proportional to the optical depth $\tau$ between the same points.

$T (p_a \leftrightarrow p_b) = e^{-\tau (p_a \leftrightarrow p_b)}$



The optical depth $\tau$ between two points is equal to the sum of the medium's extinction coefficient $\sigma_t$ at each intermediate point.

$\tau (p_a \leftrightarrow p_b) = \int_{p_a}^{p_b} \sigma_{t}(p)dp$



> Note: the transmittance between two points is associative. That is, $T(p_a \rightarrow p_b) = T(p_a \leftarrow p_b)$. We denote the transmittance function input with $\leftrightarrow$  to show this.



### Inscattering



## 2. Implementation Details









## Notes

These are for my own reference.

### Derivation of Optical Depth $\tau$ and Transmittance $T_{r}$

The optical depth $\tau$ between two points $x$ and $x'$ is equal to the integration of the extinction coefficient at each point along the ray.

$\tau (x\rightarrow x') = \int_{0}^{d} \sigma_{t} (x+tw)dt$

<!-- TODO: this is confusing to use d for distance since its used for derivation, and t for parameterization of ray since it already denotes the extinction coefficient. -->

Where $d$ is the distance between $x$ and $x'$, $w$ is a unit vector from $x$ to $x'$, and $t$ parameterizes the line between $x$ and $x'$ (i.e. $0 \leq t \leq d$).

If the extinction coefficient is constant along the viewing ray (i.e. the participating media is homogeneous), then the integral simplifies to:

$\tau (x \rightarrow x') = d \sigma_{t}$

Unfortunately this is rarely the case, so we must integrate. For reference, below is the formula for numerical integration with the trapezoidal method.

$\int_{a}^{b} f(x)dx \approx \frac{b-a}{n} * (\frac{f(a)}{2} + \sum_{k=1}^{n-1} (f(a + k \frac{b-a}{n}) ) + \frac{f(b)}{2} )$

When we plug this formula into the original optical depth integral, we get the following summation:

$ \int_{0}^{d} \sigma_{t}(x+tw)dt \approx \frac{d}{n} * (\frac{\sigma_{t}(x+0w)}{2} + \sum_{k=1}^{n-1} (\sigma_{t}(x+d\frac{k}{n}w) ) + \frac{\sigma_{t}(x+dw)}{2} )$

We can easily compute this in a shader with a loop. Once we have $\tau$, the transmittance $T_{r}$ is easily calculated:

$T_{r}(x \rightarrow x') = e^{-\tau(x \rightarrow x')}$

### Note on the Extinction Coefficient $\sigma_{t}$

The extinction coefficient $\sigma_{t}$ (sometimes called the [attenuation coefficient](https://en.wikipedia.org/wiki/Attenuation_coefficient)) characterizes how easily a volume of material can be penetrated by a beam. It must be $ \geq 0$.

In general, one could think of it as the "thickness" of the fog at a certain position. The value can vary across the volume. For example, one could use 3D noise for a base density, then inject additional densities via SDFs, analytical functions, or other methods.
