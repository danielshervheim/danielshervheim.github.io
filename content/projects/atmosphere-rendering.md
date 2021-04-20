---
title: Atmospheric Rendering
image: /assets/img/atmospheric-rendering/all.png
order: 2
---

# Atmospheric Rendering

### [Web Demo](https://danielshervheim.com/atmosphere/)

[![img](/assets/img/atmospheric-rendering/all.png)](https://danielshervheim.com/atmosphere/)

## About

Rendering realistic and dynamic skies is a challenging problem in real-time computer graphics.

I was inspired to tackle this problem after I realized that the math was very similar to volumetric lighting, which I worked on as the [final project](https://danielshervheim.com/coursework/csci-8980/volumetric-lighting) in a course I took. The math behind light scattering is too complex to solve directly in real-time, but it can be precomputed.

I wrote this program that solves the atmospheric scattering equations for every possible view and sun direction, and stores the results in look-up tables.

I also wrote a WebGL demo to show how the tables can be utilized to render a realistic sky in real-time.

## Source Code

The source code, as well as instructions to integrate the solution into an existing renderer are available [here](https://github.com/danielshervheim/atmosphere).

## Thanks

Gustav Bodare and Edvard Sandberg's [thesis](http://publications.lib.chalmers.se/records/fulltext/203057/203057.pdf) on atmospheric scattering was incredibly helpful. Without it I would have been lost.
