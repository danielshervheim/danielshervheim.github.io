---
title: Volumetric Lighting
image: /assets/img/volumetric-lighting/cover-bw.jpg
permalink: /coursework/csci-8980/volumetric-lighting
mathjax: true
---

# Volumetric Lighting

A project for Dr. Stephen Guy's class **Game Engine Technologies**.

Our directive was to expand upon a topic we found interesting from earlier in the course. I chose to explore real-time volumetric lighting.

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/lEUu0IehhOs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> Sunlight filtering into the Sponza atrium.

<iframe width="560" height="315" src="https://www.youtube.com/embed/h3GW8Afwd4Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> A point light moving through the Sponza atrium at night.

<iframe width="560" height="315" src="https://www.youtube.com/embed/WUtQPJMQpU8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> A spot light moving through the Sponza atrium at night.

## 1. About

For the final project I wanted to explore volumetric rendering. Specifically, the behavior of light in a participating medium.

Below I give a brief overview of the math that governs the behavior of light in a participating medium. If you are familiar with the math already, then feel free to skip that section.

I then describe how I implemented the equations in an existing engine. Finally, I give an implementation of the equations in platform agnostic pseudo-code.

## 2. Physical Background

The simplest illumination model is that of light propagating in a vacuum. The light that bounces off of a surface is able to reach your eye unobstructed. In other words, radiance is constant between two points.



In actuality, light often travels through a medium such as air or water before it reaches your eye. If the medium contains particles that interact with light, we call it a *"participating medium"*. Depending on the composition and concentration of the medium, any of the following events can occur:

- **Absorption**. The light is absorbed by a particle and converted into a different form of energy such as heat.
- **Out-scattering**. The light hits a particle and bounces out of the path towards your eye.
- **In-scattering**. The light hits a particle and bounces into the path towards your eye.



### 2.1 Light Propagation in Participating Media

![volumetric lighting](/assets/img/volumetric-lighting/combined.png)
> Light that has reached the camera after undergoing scattering events in a dense medium.

The light reaching your eye at point $p_a$ after traveling through a medium from a surface at point $p_b$ is described by following equation.



$L = L_{out} + L_{in}$



Where $L_{out}$ is the light lost between $p_a$ and $p_b$ due to absorption and out-scattering, and $L_{in}$ is the light gained between $p_a$ and $p_b$ due to in-scattering.


### 2.2 How Light is Lost

![reduced radiance](/assets/img/volumetric-lighting/reduced radiance.png)
> The above image, with only the reduced light visible (no in-scattered light).



$L_{out}$ describes the light lost due to absorption and out-scattering before it reaches your eye. It is defined as:



$L_{out} = I(p_b, -v) \times T(p_a, p_b)$



$I$ Is the light at point $p_b$ traveling towards your eye from direction $-v = (p_a - p_b)$.

$T$ is the transmittance, a measure of the original light at $p_b$ that reaches your eye at $p_a$ as a function of the distance travelled. It is defined as:



$T(p_a, p_b) = e^{-\int_{p_a}^{p_b}\sigma_e(p)dp}$



$\sigma_{e}$ is the extinction coefficient, equal to the sum of the absorption coefficients $\sigma_{a}$ and scattering coefficients $\sigma_{s}$. The absorption and scattering coefficients are properties inherent to the medium.



> Note that $0 \le T \le 1$. In other words, light is never gained due to absorption and/or out-scattering.



### 2.3 How Light is Gained

![inscattered radiance](/assets/img/volumetric-lighting/inscattered radiance.png)
> The above image, with only the in-scattered light visible (no attenuated light).

$L_{in}$ describes the light gained due to in-scattering between $p_a$ and $p_b$. It is defined as:



$L_{in} = \int_{p_a}^{p_b}T(p_a, p) \times \sigma_s(p) \times L_i(p, v) dp$



$L_i$ describes the light at point $p$ scattered into the viewing ray $v = (p_{b} - p_{a})$. It is defined as:



$L_i(p, v) = \int_{\Omega} I(p, \omega) \times F(v, \omega) d\omega$



$\Omega$ represents the sphere of directions centered over $p$.

$I$ is the light at $p$ traveling from direction $\omega$.

$F$ is the phase function. It is inherent to the medium and describes the percentage of light from direction $\omega$ that is scattered into the viewing ray $v$.



## 3. Implementation Details

### 3.1 My Approach

I implemented my approach in the Unity engine. My first attempt was a full-screen quad image-effect shader, rendered after the transparent pass. For each fragment, I sampled the depth buffer and reconstructed the world position. I then traced rays from the camera to the fragment, and integrated the above equations along the ray.

That worked very well, and was relatively easy to implement. Unfortunately, there were some major limitations. To my knowledge, Unity only provides information about non-directional (point and spot) lights at certain periods during the rendering pipeline. By the time my full-screen image effect shader was running, that information had been lost. So with this approach, I was unable to support point lights, spot lights, and light probes.

Additionally, ray-tracing proved to be very expensive. I ended up performing the ray-tracing on a quarter resolution texture, and up-sampling back into full resolution. I also reduced the amount of samples that I took along the ray from 128 (which provided nearly perfect visual quality) to 32. This introduced severe banding artifacts. To mitigate these artifacts, I offset each ray by a random amount every frame. This helped hide the banding, but also introduced noise. Thankfully, the temporal anti-aliasing system in Unity was able to smooth the noise out relatively well.

![banding](/assets/img/volumetric-lighting/banding.png)
> Severe banding artifacts (L), reduced artifacts due to random ray offsets (R).

Unfortunately that still didn't solve the problem of not being able to access the point and spotlight data. For that, I turned to another approach. I re-implemented my shader as a standard shader (rather than an image effect shader) and applied it to a cuboid in the scene. This allowed me to receive information about all the lights. Unfortunately, because it was applied to a physical mesh in the scene (rather than a full-screen image effect) I could not move the camera inside of the volume or the effect would break. Likewise, because it was not a screen-space effect I could not downsample and compute the in-scattered light, so the performance was much worse than my initial attempt.

In the future, I would like to experiment more to try and find a way to access all of the lights in a single screen-space shader pass. Integrating my implementation with the Unity engine was not difficult, per-se, but I did feel at times as though I was fighting the engine. I think it would be interesting to write my own engine, so I had more control over what was rendered and when, and to try and integrate volumetric lighting there.

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



The next step is declaring accumulator values for the optical depth and in-scattered light. We also need to decide how many times to step through the volume.

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



Within the loop, we also need to get the coefficients at the current position in the volume. These could be supplied as an analytical function (e.g. height fog), by sampling a 3D noise texture, or by some other method. We also need to calculate the transmittance at the current position along the ray.

```c
// Sample the coefficients at the current position.
float absorption = GetAbsorptionCoefficientAt(p);
float scattering = GetScatteringCoefficientAt(p);
float extinction = absorption + scattering;

// Calculate the transmittance up to this point in the ray.
float curTransmittance = exp(-opticalDepth);
```



We also need to calculate the Li term, all of the light at the current position scattered into the viewing ray. In the real world light would be coming into the point from every direction and we would have to integrate all of it. In this implementation, we only have light coming in from a discrete set of lights, so we can just loop over those.

```c
// Calculate the in-scattered light at the current position.
vec3 Li = vec3(0.0, 0.0, 0.0);
for (int l = 0; l < LIGHTS.length; l++)
{
    // GetLightVisibility() just returns whether the point p is
    // in shadow or not, from the perspective of the light l. This
    // is typically done by sampling the light's shadow map.
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

// End of integration for-loop.
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



## 4. Source Code / Credit

- The source code is available to download [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q).
- I borrowed a ray-AABB intersection algorithm from [here](https://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms).
- I used a set of free blue noise textures by [Christoph Peters](http://momentsingraphics.de/BlueNoise.html).
- The 3D model of the Sponza Atrium is from Morgan McGuire's [Computer Graphics Archive](https://casual-effects.com/data/).
- Finally, Wojciech Jarosz's [dissertation](https://cs.dartmouth.edu/~wjarosz/publications/dissertation/chapter4.pdf) on light transport in participating media was an invaluable resource.
