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

The key element that I wanted to capture from the concept art was the transition of green to blue as the depth of the water increased, and the sharply defined foam around the objects in the water.

To capture the depth, I computed the optical depth (i.e. the length of the view ray from where it enters the water, to where it either exits the water or hits a surface within the water). I used a ray-sphere intersection test to find the "volume depth", and the depth texture combined with the vertex position to find the "surface depth".

![depth](https://imgur.com/tB4de8r.png)
> From left to right: 1) volume depth, 2) surface depth, 3)  optical depth (minimum of both).

I then tranformed the optical depth into optical density, and tinted the scene color by the optical density to get the main color. Finally I used the surface depth as a mask for the foam lines and added them to the main color.

![color](https://imgur.com/B4upoSA.png)
> From left to right: 1) tinted blue by optical density, 2) tinted green uniformly, 3) foam added based on the surface depth.

Vertex shader  (approximate):

```c
// Get the vertex position in world space.
float3 vertexPosWS = modelMatrix * pos;

// Use the world space position to generate noise, and
// offset the position along the normal by the noise.
float noise = simplex3D(vertexPosWS.xyz);
vertexPosWS += vertexNormalWS * noise * noiseAmplitude;

// Return the vertex position in clip space.
return projMatrix * viewMatrix * vertexPosWS;
```



Fragment shader  (approximate):

```c
// Sample the depth and color of the object behind the water.
// This works because our water shader is transparent (i.e.
// rendered after all opaque objects).
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

I wanted the clouds to appear stylized to match the overall aesthetic of the rest of the scene, while still retaining a somewhat physical "feel". I found a stylized cloud shader by [Thomas Schrama](https://www.artstation.com/artwork/mVDVZ) that came pretty close to what I was looking for, so I used it as inspiration for my own.

The basic idea is that the vertices of a sphere are displaced along their normals to achieve a cloud-ish shape. Then they are colored by the standard lambertian diffuse equation. I then generate two masks to use as the pixels alpha value. The first mask is based on the fresnel effect, to "feather" the edges of the clouds. The second mask is based on the view direction to fade out clouds near the camera, to prevent them from blocking the player's view of the world.

![cloud](https://imgur.com/XyETQXl.png)
> From left to right: 1) the fresnel mask, 2) the view direction mask, 3) only the color, 4) the color and alpha combined.

The vertex shader is essentially the same as the water shader: just displacing the vertex positions along the vertex normals by 3D simplex noise.

Fragment shader (approximate):
```c
// Simple lambertian color.
float lambert = saturate(dot(vertexNormal, lightDirection));
float3 color = cloudColor * cloudIntensity * lambert; 

// Get the fresnel to "feather" the edges of the cloud.
float alphaF = 1 - fresnel(vertexNormalWS, viewDirectionWS);

// Get the view-cloud dot product to determine whether
// we are looking down through a cloud onto the map.
// Note: assumes the world is centered at (0, 0, 0).
float3 vertexPosToCenter = normalize(-vertexPosWS);
float alphaView = 1 - saturate(dot(viewDirectionWS, vertexPosToCenter));
alphaView = 1 - (alphaView * opacityAtFullView);

// Return the color with the calculated alpha.
return (color, saturate(alphaF * alphaView));
```





## The Snake

The snake segments use a stylized lambertian diffuse shader with a gradient based on the UV coordinates. This required me to unwrap the snake models in a special way.

I take the uv coordinate and use it to lerp between two gradient colors, then multiply the result by the shadow color (calculated from the stylized lambertian diffuse).

![uv unwrap](https://imgur.com/z3Bj3kQ.png)
> The model is unwrapped such that all +Y faces texcoord.y is greater than 1, all -Y faces texcoord.y is less than 0, and all other faces are stretched across the 0 to 1 range.

![snake](https://imgur.com/xRQ8BOM.png)
> The model is shaded by interpolating two colors across the texture coordinate's y component.

Fragment shader (approximate):
```c
// Calculate the shadow mask with the stylized lambertian diffuse eq.
float stylizedLambert = dot(vertexNormalWS, lightDirectionWS);
stylizedLambert = saturate(stylizedLambert * falloffMultiplier);

// Calculate the diffuse term as a gradient between two colors.
float3 gradientColor = lerp(lowerColor, upperColor, texcoord.y);

// Ensure the shadow color is white where there is no shadows.
float3 shadowColor = lerp(shadowColor, float3(1, 1, 1), stylizedLambert);

// Multiply the diffuse term by the shadow color and return it.
return float4(gradientColor * shadowColor, 1);
```

Every other surface in the game uses the same shader but with a constant diffuse color, rather than a gradient.

## The Background

The background skybox is just a linear interpolation between two colors by the normalized screen position's y component.

Fragment shader (approximate):
```c
return float4(lerp(lowerColor, upperColor, screencoord.y), 1);
```