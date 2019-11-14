---
title: The Visuals of Spherical Snake
image: /assets/img/placeholder.jpg
permalink: /coursework/csci-8980/project-4/report
---

# The Visuals of Spherical Snake

## Previous Work

I had been working on Spherical Snake for a while, but never put much effort into the visuals. The models were just unlit textured spheres.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Xusf6nHCNC0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
> The game as it appeared previously.

## Concept

I wanted the game to look stylized, yet physically plausible. I was inspired by games like [Super Mario Galaxy](https://www.youtube.com/watch?v=UrF6YW5W998), [Rime](https://www.youtube.com/watch?v=biPr3V7-IXI), and [Abzu](https://www.youtube.com/watch?v=bpvHqAsNVH0) as well as the work of [Oskar Stålberg](https://oskarstalberg.tumblr.com/post/136461533291/polygonal-planet-project-a-study-in-tilesets-by). In the end, I decided on a beach theme and drew up a concept of how I wanted it to look.

![concept art](https://imgur.com/ukle427.png)
> Concept art for how I wanted the game to look ideally.

## Implementation

I knew if I wanted to remain faithful to the concept that there were a few **key** visual elements I would have to implement. Below I briefly detail the most important shaders I wrote to help bring the concept to life.

### 1. Water

The most important feature from the concept art, at least for me, was the transition from green to blue as the water gets deeper.

I consider the water as a uniform density volume of participating media. To calculate the correct density of a given pixel, I first needed the optical depth. That is, the length of the viewing ray from where it enters the water to where it either 1) exits the water or 2) hits a surface within the water. To calculate the optical depth, I needed to consider both cases.

I first calculated the "volume depth". That is, the length of the view ray from where it enters the water to where it exits. To do this, I passed the water sphere mesh's center and radius into the shader. I then used a ray-sphere intersection algorithm to find the two points of intersection of the view ray with the water sphere. Finally I calculated the volume depth as the magnitude of the difference between them.

I then calculated the "surface depth". That is, the length of the view ray from where it enters the water to where it hits a surface. To do this, I used the depth texture which contains the depth from the view position to the previously rendered surface. (Note that this does not include the water sphere, which is rendered after all opaque objects due to its sorting order). I then found the depth to the water surface as the magnitude difference of the view position and the vertex position. Finally I calculated the surface depth by subtracting the distance to the water from the distance to the surface behind it.

I only wanted to use the surface depth if there was a surface within the water sphere. If the surface depth was greater than the volume depth, then I knew the view ray exited the water sphere before hitting a surface. For an accurate optical depth, I took the minimum of both the surface depth and volume depth. The figure below illustrates why this is both necessary and sufficient.

![figure](https://imgur.com/MruqcR9.png)
> The red lines represent the surface depth, and the blue lines represent the volume depth.

![depth](https://imgur.com/tB4de8r.png)
> From left to right: 1) volume depth, 2) surface depth, 3)  optical depth (minimum of both).

I also wanted to have a sharp ring of foam around anything within the water. I didn't want to create and manage dynamic foam-ring-meshes at run-time, so I went with a shader based approach. I reused the surface depth from earlier as a mask. If a pixel is "shallower" than a given threshold I consider it foam. The effect can break if the threshold is too high, or the viewing angle is too extreme, but on average it looks good enough for me.

![color](https://imgur.com/B4upoSA.png)
> From left to right: 1) tinted blue by optical density, 2) tinted green uniformly, 3) foam added based on the surface depth.

Vertex shader pseudocode:
```c
// Get the vertex position in world space.
float3 vertexPosWS = modelMatrix * vertexPosOS;

// Use the world space position to generate noise, and
// offset the position along the normal by the noise.
float noise = simplex3D(vertexPosWS.xyz/waveLength + waveDirection*waveSpeed*time);
vertexPosWS += vertexNormalWS * noise * waveAmplitude;

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



### 2. Clouds

I wanted the clouds to appear stylized to match the overall aesthetic of the rest of the scene, while still retaining a somewhat physical "feel". After some research, I found a stylized cloud shader by [Thomas Schrama](https://www.artstation.com/artwork/mVDVZ) that came pretty close to what I was looking for, so I used it as inspiration for my own.

The basic idea is that the vertices of a sphere are displaced along their normals to achieve a cloud-ish shape. Then they are colored by the standard Lambertian diffuse equation. I then generate two masks to use as the pixels alpha value. The first mask is based on the fresnel effect, to "feather" the edges of the clouds. The second mask is based on the view direction to fade out clouds near the camera, which prevents them from blocking the player's view of the game.

![cloud](https://imgur.com/XyETQXl.png)
> From left to right: 1) the Fresnel mask, 2) the view direction mask, 3) only the color, 4) the color and alpha combined.

The vertex shader is essentially identical to the water shader but without the offset by time.

Fragment shader pseudocode:
```c
// Simple Lambertian color.
float lambert = saturate(dot(vertexNormal, lightDirection));
float3 color = cloudColor * cloudIntensity * lambert; 

// Get the Fresnel to "feather" the edges of the cloud.
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



### 3. Snake

My initial idea for the snake was based on statues I had seen of the Mesoamerican deity Quetzalcoatl. I tried using a 3D scan of a Quetzalcoatl statue as my snake but visually it was too complex, so I modeled a simpler one myself.

I wanted the snake to be easy to read in motion, but not boring and flat. I ended up using a gradient based on the snake models texture coordinates.

![uv unwrap](https://imgur.com/z3Bj3kQ.png)
> I unwrapped the model such that all +Y faces `texcoord.y > 1`, all -Y faces `texcoord.y < 0`, and for all other faces` 0 < texcoord.y < 1`.

![snake](https://imgur.com/lQhoKTt.png)
> The model is shaded by interpolating two colors across it's `texcoord.y`.

I then used a modified version of the Lambertian diffuse equation to generate a shadow mask. The gradient color is then tinted based on the mask by a shadow color parameter.

Fragment shader pseudocode:

```c
// Calculate the shadow mask with the stylized lambertian diffuse eq.
float lambert = dot(vertexNormalWS, lightDirectionWS);
lambert = saturate(lambert * shadowStrength);

// Multiply the shadow mask with shadow map supplied by Unity.
lambert *= shadowMap;

// Calculate the diffuse term as a gradient between two colors.
float3 color = lerp(lowerColor, upperColor, texcoord.y);

// Ensure the shadow color is white where there is no shadows.
float3 shadow = lerp(shadowColor, float3(1,1,1), lambert);

// Multiply the diffuse term by the shadow color and return it.
return float4(color * shadow, 1);
```



### 4. Other Shaders

All the other props (including the terrain) use the same shader as the snake, but with a solid color rather than a gradient for the diffuse term.

The skybox is a linear interpolation between two color parameters by the normalized `screencoord.y`.


## Results

<iframe width="560" height="315" src="https://www.youtube.com/embed/qCyZzmVQuRI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
## Thoughts and Challenges

From a technical perspective, Unity handles most of the engine-rendering integration for you. I just had to drop in my 3D models, and assign them materials with the shaders I created.

In my game there is no single change in rendering triggered by any specific event. Instead i keep a `time` variable and increment it every frame. I then pass it into my water shader and use it as an offset in my wave equation so the waves appear to change over time.

It is worth noting that I used [Amplify Shader Editor](http://amplify.pt/unity/amplify-shader-editor/), a graph-based shader authoring tool to create my shaders. The above code snippets are my attempt to translate my graphs into pseudocode. The actual shader code (generated by the shader editor) and screenshots of the graphs themselves can be found with the rest of the source code [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q?usp=sharing).