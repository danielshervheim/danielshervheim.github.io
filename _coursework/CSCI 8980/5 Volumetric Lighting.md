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

## 1. About

TODO: write this.

bla bla bla, below I give a brief word on the physical processes behind light transport, and then give some tips on implementation.

## 2. Physical Background

The simplest illumination model is that of light propogating in a vacuum. The light that bounces off of a surface is able to reach your eye unobstructed. In other words, radiance is constant between two points.



In actuality, light often travels through a medium such as air or water before it reaches your eye. If the medium contains particles that interact with light, we call it a *"participating medium"*. Depending on the composition and concentration of the medium, any of the following events can occur:

- **Absorbtion**. The light is absorbed by a particle and converted into a different form of energy such as heat.
- **Out-scattering**. The light hits a particle and bounces out of the path towards your eye.
- **In-scattering**. The light hits a particle and bounces into the path towards your eye.



### 2.1 Light Propogation in Participating Media

The light reaching your eye at point $p_a$ after travelling through a medium from a surface at point $p_b$ is described by following equation.



$L = L_{out} + L_{in}$



Where $L_{out}$ is the light lost between $p_a$ and $p_b$ due to absorbtion and out-scattering, and $L_{in}$ is the light gained between $p_a$ and $p_b$ due to in-scattering.


### 2.2 How Light is Lost

TODO: add an image of only reduced radiance.
![reduced-radiance](???.png)
> The above image, with only the reduced radiance visible.



$L_{out}$ describes the light lost due to absorbtion and out-scattering before it reaches your eye. It is defined as:



$L_{out} = I(p_b, -v) \times T(p_a, p_b)$



$I$ Is the light at point $p_b$ travelling towards your eye from direction $-v = (p_a - p_b)$.

$T$ is the transmittance, a measure of the original light at $p_b$ that reaches your eye at $p_a$ as a function of the distance travelled. It is defined as:



$T(p_a, p_b) = e^{-\int_{p_a}^{p_b}\sigma_e(p)dp}$



$\sigma_{e}$ is the extinction coefficient, equal to the sum of the absorption coefficients $\sigma_{a}$ and scattering coefficients $\sigma_{s}$. The absortion and scattering coefficients are properties inherent to the medium.



> Note that $0 \le T \le 1$. In other words, light is never gained due to absorbtion and/or out-scattering.



### 2.3 How Light is Gained

TODO: add an image of only inscattered light.
![inscattered-light](???.png)
> The above image, with only the inscattered light visible.

$L_{in}$ describes the light gained due to in-scattering between $p_a$ and $p_b$. It is defined as:



$L_{in} = \int_{p_a}^{p_b}T(p_a, p) \times \sigma_s(p) \times L_i(p, v) dp$



$L_i$ describes the light at point $p$ scattered into the viewing ray $v = (p_{b} - p_{a})$. It is defined as:



$L_i(p, v) = \int_{\Omega} I(p, \omega) \times F(v, \omega) d\omega$



$\Omega$ represents the sphere of directions centered over $p$.

$I$ is the light at $p$ travelling from direction $\omega$.

$F$ is the phase function. It is inherent to the medium and describes the percentage of light from direction $\omega$ that is scattered into the viewing ray $v$.



## 3. Implementation Details



### 3.1 Approaches

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



### 3.2 Pseudocode

I will attempt to keep the pseudocode below implementation agnostic, although I will assume that you have certain buffers available to you (depth, color, and world position).



The first step is calculating the ray origin ($p_a$), direction ($v$), and end ($p_b$). The origin is the world-space camera position. The end is the world-space fragment position. (This could be supplied in a buffer as part of a deferred rendering pipeline, or recalculating by multiplying the value in the depth buffer by the inverse view-projection matrix).

```c
// Calculate the fragment position from the world position buffer,
// and get the camera position.
vec3 fragPos = SAMPLE_WORLD_POSITION_BUFFER(screenCoord);
vec3 viewPos = GetWorldSpaceCameraPos();

// Calculate the viewing direction (unit vector) and
// distance to the fragment from the camera.
vec3 viewDir = fragPos - viewPos;
float fragDist = length(viewDir);
viewDir /= fragDist;
```



The next step is declaring accumulator values for the optical depth and inscattered light. We also need to decide how many times to step through the volume.

```c
// Accumulators.
float opticalDepth = 0.0;
vec3 inscatteredRadiance = vec3(0.0, 0.0, 0.0);

// Higher step count yields better results,
// but is more expensive.
const int STEPS = 32;
const float DP = fragDist / (float)STEPS;
```



Then we must actually step through the volume and perform the integrations.

```c
for (int i = 0; i < STEPS; i++)
{
  // How far along the ray we are, as a 0...1 percentage.
  float percent = i / (float)(STEPS-1.0);

  // The current position along the ray.
  vec3 p = lerp(viewPos, fragPos, percent);
}
```



Within the loop, we also need to get the coefficients at the current position in the volume. We also need to calculate the transmittance at the current position along the ray.

```c
// Sample the coefficients at the current position.
float absorbtion = GetAbsorbtionCoefficientAt(p);
float scattering = GetScatteringCoefficientAt(p);
float extinction = absorbtion + scattering;

// Calculate the transmittance up to this point in the ray.
float curTransmittance = exp(-opticalDepth);
```



We also need to calculate the Li term, all of the light at the current position scattered into the viewing ray. In the real world light would be coming into the point from every direction and we would have to integrate all of it. In this implementation, we only have light coming in from a discrete set of lights, so we can just loop over those.

```c
// Calculate the inscattered light at the current position.
vec3 Li = vec3(0.0, 0.0, 0.0);
for (int l = 0; l < LIGHTS.length; l++)
{
  // GetLightVisibility() just returns whether the point p is
  // in shadow or not, from the perspective of the light l. This
  // is typically done by sampling the lights shadow map.
  vec3 curLi = GetLightVisibility(p, l) * LIGHTS[l].color;


  // The phase function relies on the angular difference
  // between the view direction and the light direction.
  // The Henyey-Greenstein phase function is commonly used
  // because it can approximate many different types of
  // media with a single parameter G = [-1, 1].
  float theta = acos(dot(viewDir, LIGHTS[l].dir));
  curLi *= HenyeyGreenstein(theta, G);

  // Accumulate Li.
  Li += curLi;
}
```



Finally, we need to actually integrate the accumulators along the ray.

```c
// Integrate along the ray.
opticalDepth += extinction * DP;
inscatteredRadiance += curTransmittance * scattering * Li * DP;
```



After the loop is done, we need to calculate the final transmittance and return the final radiance.

```c
// Calculate the final transmittance.
float transmittance = exp(-opticalDepth);

// Sample the color buffer and calculate the reduced radiance.
vec3 fragRadiance = SAMPLE_COLOR_BUFFER(screenCoord);
vec3 reducedRadiance = fragRadiance * transmittance;

// Return the reduced + inscattered radiance.
return vec4(reducedRadiance + inscatteredRadiance, 1.0);
```



The final implementation:

```c
// Calculate the ray information.
vec3 fragPos = SAMPLE_WORLD_POSITION_BUFFER(screenCoord);
vec3 viewPos = GetWorldSpaceCameraPos();
vec3 viewDir = fragPos - viewPos;
float fragDist = length(viewDir);
viewDir /= fragDist;

// Calculate the integration information.
float opticalDepth = 0.0;
vec3 inscatteredRadiance = vec3(0.0, 0.0, 0.0);
const int STEPS = 32;
const float DP = fragDist / (float)STEPS;

// Perform the integration.
for (int i = 0; i < STEPS; i++)
{
  // Calculate the current position along the ray.
  float percent = i / (float)(STEPS-1.0);
  vec3 p = lerp(viewPos, fragPos, percent);

  // Sample the coefficients at the current position.
  float absorbtion = GetAbsorbtionCoefficientAt(p);
  float scattering = GetScatteringCoefficientAt(p);
  float extinction = absorbtion + scattering;

  // Calculate the transmittance up to this point in the ray.
  float curTransmittance = exp(-opticalDepth);

  // Calculate the inscattered light at the current position.
  vec3 Li = vec3(0.0, 0.0, 0.0);
  for (int l = 0; l < LIGHTS.length; l++)
  {
    vec3 curLi = GetLightVisibility(p, l) * LIGHTS[l].color;
    float theta = acos(dot(viewDir, LIGHTS[l].dir));
    curLi *= HenyeyGreenstein(theta, G);
    Li += curLi;
  }

  // Integrate along the ray.
  opticalDepth += extinction * DP;
  inscatteredRadiance += curTransmittance * scattering * Li * DP;
}

// Calculate the final transmittance.
float transmittance = exp(-opticalDepth);

// Sample the color buffer and calculate the reduced radiance.
vec3 fragRadiance = SAMPLE_COLOR_BUFFER(screenCoord);
vec3 reducedRadiance = fragRadiance * transmittance;

// Return the reduced + inscattered radiance.
return vec4(reducedRadiance + inscatteredRadiance, 1.0);
```



## 4. Source Code / Credit

- The source code is available to download [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q).
- I borrowed a ray-AABB intersection algorithm from [here](https://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms).
- I used a set of free blue noise textures by [Christoph Peters](http://momentsingraphics.de/BlueNoise.html). 
- The 3D model of the Sponza Atrium is from Morgan McGuire's [Computer Graphics Archive](https://casual-effects.com/data/).
- Finally, Wojciech Jarosz's [dissertation](https://cs.dartmouth.edu/~wjarosz/publications/dissertation/chapter4.pdf) on light transport in participating media was an invaluable resource.
