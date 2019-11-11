---
title: CSCI 8980 Project 4
image: /assets/img/placeholder.jpg
permalink: /coursework/csci-8980/project-4
---

# Project 4

## Spherical Snake

The goal for project 4 was to explore shaders and how they affect the appearence of the objects rendered in a game engine. I decided to take a game I had already been working on and improve the appearence by writing my own shaders.

The game I made was a version of the classic computer game Snake, but played on a spherical map rather than a 2D map. This is what it looked like previously:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Xusf6nHCNC0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> The game as it appeared previously, with no visual upgrades.

I created concept art for how I wanted the game to look ideally. My goal was to try and recreate the concept as closely as possible, using custom shaders wherever possible.

![concept art](https://imgur.com/gHx8BRZ.png)

> Concept art for how I wanted the game to look ideally.

After working for a few weeks I am reasonably pleased with the results I achieved. I think I was able to capture the spirit of the concept art fairly well.

<iframe width="560" height="315" src="https://www.youtube.com/embed/qCyZzmVQuRI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> The game as it appears now, with improved visuals based on the concept art. 



There were a few key visual elements I knew I had to achieve. I detail them below.



## The Water

wip

![depth](https://imgur.com/tB4de8r.png)
> From left to right: 1) volume depth, 2) surface depth, 3)  optical depth (minimum of both).

Wip

![color](https://imgur.com/B4upoSA.png)
> From left to right: 1) tinted blue by optical density, 2) tinted green uniformly, 3) foam added based on the surface depth.

Wip

```c
// Sample the depth and color of the object behind the water. This works because our water shader is transparent (i.e. rendered after all opaque objects).
float depth = tex2D(depthTex, screencoord).r;
float3 color = tex2D(colorTex, screencoord).rgb;

// Get the distance from the water to the surface behind the water.
float distToWater = length(vertexPos - viewPos);
float surfaceDepth = depth - distToWater;

// Get the distance from the water to the water on the other side of the sphere.
// Note: t0 and t1 are returned as the x and y components of a float2.
float2 t = RaySphereIntersection(viewPos, viewDir, spherePos, sphereRadius);
float volumeDepth = abs(t.x - t.y);

// Calculate the optical density.
float opticalDepth = min(surfaceDepth, volumeDepth);
float opticalDensity = 1 - saturate(exp(-waterDensity * opticalDepth));

// Tint the color blue by the optical density.
color *= lerp(float3(1,1,1), deepColor, opticalDensity);

// Tint the color green uniformly.
color *= shallowColor;

// Calculate the foam ring based on the surface depth.
float foam = surfaceDepth < foamThreshold ? 1 : 0;

// Add the foam and return the resulting pixel color.
color += float3(1,1,1)*foam;
return float4(saturate(color), 1);
```


## The Clouds

wip

ref: https://www.artstation.com/artwork/mVDVZ



## The Snake

wip



## Other Surfaces

wip

## 