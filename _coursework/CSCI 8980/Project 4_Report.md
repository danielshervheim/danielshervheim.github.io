---
title: The Visuals of Spherical Snake
image: /assets/img/placeholder.jpg
permalink: /coursework/csci-8980/project-4/report
---

# The Visuals of Spherical Snake



## What It Used to Look Like

I had been working on this game for a while, but never put much effort into the visuals. Here is what it used to look like.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Xusf6nHCNC0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> The game as it appeared pre project 4.

I knew I wanted the game to look stylized yet physically plausible. Games like [Super Mario Galaxy](https://www.youtube.com/watch?v=UrF6YW5W998), [Rime](https://www.youtube.com/watch?v=biPr3V7-IXI), [Abzu](https://www.youtube.com/watch?v=bpvHqAsNVH0) and the work of [Oskar Stalberg](https://oskarstalberg.tumblr.com/post/136461533291/polygonal-planet-project-a-study-in-tilesets-by) were some of my biggest inspirations. In the end I settled on a beach scene!

![concept art](https://imgur.com/gHx8BRZ.png)
> Concept art for how I wanted the game to look ideally.

There were a few **key** visual elements that I knew I had to incorperate into my game if it was to match the concept art. I anticipated that the water would be my biggest challenge, followed by the clouds.



### 1. The Water

The most important feature from the concept art, at least for me, was the transition from green to blue as the water gets deeper. My initial attempt to use the depth texture was quickly scrapped after I realized that it was not correct in situations where the viewing ray entered and exited the water sphere without hitting an opaque surface. I ended up calculating two depths, and taking the minimum of each as the optical depth.

The first is the "volume depth". That is the length of the viewing ray within the water sphere. I found the two intersection points of the viewing ray into the sphere with a ray-sphere intersection test, and took the magnitude of the difference between them as the volume depth.

The second is the "surface depth". That is the distance from the water boundary to the opaque surface behind it. I calculated this by subtracting the magnitude of the difference of the vertex and camera positions from the depth texture.

![depth](https://imgur.com/tB4de8r.png)
> From left to right: 1) volume depth, 2) surface depth, 3)  optical depth (minimum of both).

I also knew I wanted to have a sharply defined ring of foam around anything that touches the water. I didn't want to have to create and manage extra foam ring meshes at runtime, so I went with a completely "in-shader" approach. I re-used the surface depth from earlier as a mask. Essentially, if a surface is shallower than a predefined threshhold, I consider it as foam. This works only for very small threshhold values, and can break at extreme viewing angles, but the effect looks good enough on average for me.

![color](https://imgur.com/B4upoSA.png)
> From left to right: 1) tinted blue by optical density, 2) tinted green uniformly, 3) foam added based on the surface depth.

Vertex shader pseudocode:
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

Fragment shader pseudocode:
```c
// Sample the depth and color of the object behind the water.
// This works because our water shader is transparent (i.e.
// rendered after all opaque objects).
float depth = tex2D(depthTex, screencoord).r;
float3 color = tex2D(colorTex, screencoord).rgb;

// Get the distance from the water to the surface behind the water.
float distToWater = length(vertexPosWS - viewPosWS);
float surfaceDepth = depth - distToWater;

// Get the distance from the water to the water on the other side of the sphere.
// Note: t0 and t1 are returned as the x and y components of a float2.
float2 t = RaySphereIntersection(viewPosWS, viewDirWS, spherePosWS, sphereRadius);
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



### 2. The Clouds

I wanted the clouds to appear stylized to match the overall aesthetic of the rest of the scene, while still retaining a somewhat physical "feel". After some research, I found a stylized cloud shader by [Thomas Schrama](https://www.artstation.com/artwork/mVDVZ) that came pretty close to what I was looking for, so I used it as inspiration for my own.

The basic idea is that the vertices of a sphere are displaced along their normals to achieve a cloud-ish shape. Then they are colored by the standard lambertian diffuse equation. I then generate two masks to use as the pixels alpha value. The first mask is based on the fresnel effect, to "feather" the edges of the clouds. The second mask is based on the view direction to fade out clouds near the camera, which prevents them from blocking the player's view of the game.

![cloud](https://imgur.com/XyETQXl.png)
> From left to right: 1) the fresnel mask, 2) the view direction mask, 3) only the color, 4) the color and alpha combined.

The vertex shader is essentially identical to the water shader. It just displaces the vertices positions along their normals by some noise.

Fragment shader pseudocode:
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



### 3. The Snake

My inspiration for the snake was statues that I had seen of the mesoamerican god Quetzalcoatl. I initially tried using an actual 3D scan of a statue for my snake, but it was far too busy visually so I modelled a simple one myself.

I wanted the segments to be visually simple and easy to read, but not boring and flat. I ended up using a gradient to color the segments based on the UV coordinates, which required me to unwrap the snake model in a specific way.

![uv unwrap](https://imgur.com/z3Bj3kQ.png)
> The model is unwrapped such that all +Y faces texcoord.y is greater than 1, all -Y faces texcoord.y is less than 0, and all other faces are stretched across the 0 to 1 texcoord.y space.

![snake](https://imgur.com/xRQ8BOM.png)
> The model is shaded by interpolating two colors across the texture coordinate's y component.

I then used a modified version of the lambertian diffuse equation to generate a mask. The gradient color is then tinted based on the mask by a shadow color parameter before being returned.

Fragment shader pseudocode:

```c
// Calculate the shadow mask with the stylized lambertian diffuse eq.
float lambert = dot(vertexNormalWS, lightDirectionWS);
lambert = saturate(lambert * shadowStrength);

// Calculate the diffuse term as a gradient between two colors.
float3 color = lerp(lowerColor, upperColor, texcoord.y);

// Ensure the shadow color is white where there is no shadows.
float3 shadow = lerp(shadowColor, float3(1,1,1), lambert);

// Multiply the diffuse term by the shadow color and return it.
return float4(color * shadow, 1);
```



### 4. Other Surfaces

All the other props (including the terrain) use the same shader as the snake, but with a solid color rather than a gradient for the diffuse term.

The skybox is just a linear interpolation of two color parameters based on the normalized `screencoord.y`.



## Integration with the Engine

From a technical perspective, Unity handles most of the engine-rendering integration for you. I just had to drop in my 3D models, and assign them materials with the shaders I created.

In my game there is no single change in rendering triggered by any specific event. Instead, I keep a `time` variable and increment it every frame, then pass it into my water shader and use it as an offset in my wave equation so the waves appear to change over time.




## The Final Result

<iframe width="560" height="315" src="https://www.youtube.com/embed/qCyZzmVQuRI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> The game as it appears now!



## Disclaimer

I used [Amplify Shader Editor](http://amplify.pt/unity/amplify-shader-editor/), a graph-based shader authoring tool to create my shaders. The above code snippets are my attempt to translate my graphs into pseudocode. The actual shader code (generated by the shader editor) and screenshots of the graphs themselves can be found with the rest of the source code [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q?usp=sharing).