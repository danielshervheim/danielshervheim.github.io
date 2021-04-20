---
title: Frustum Culling
image: /assets/img/frustum-culling/frustum-culling-edit.png
permalink: /coursework/csci-8980/frustum-culling-in-opengl

order: 5
---

# Frustum Culling in OpenGL

A project for Dr. Stephen Guy's class **Game Engine Technologies**. We were provided with a minimal OpenGL game engine written by the professor.

Our directive was to implement acceleration techniques in the provided engine. I chose to implement frustum culling, an LOD system, and distance-based sorting.

## Media

<iframe width="560" height="315" src="https://www.youtube.com/embed/wGmOhkj5X3Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> An island scene rendered with no acceleration techniques. The frame-rate hovers around 5 fps, far too low for realtime use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/milhOFbAaIk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> The same island scene rendered with acceleration techniques. The frame-rate hovers around 30 fps, acceptable for realtime use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/1ySQNrvL_OA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> The same island scene as viewed through the debug camera. The frustum culling system is visible throughout the video as the camera "sweeps" in an arc around the scene. The LOD system is visible around 0:15 (notice the slight change in the tree contours).

## About

GEFS (game engine from scratch) is a lightweight game engine provided to us for the purpose of this project. Our goal was to enhance the engine's performance when rendering complex, large-scale scenes. Towards that goal, I implemented three different techniques to accelerate the performance:

1. An LOD system.
2. View Frustum Culling.
3. Distance Sorting.

Of the three techniques, I found that the LOD system provided the most substantial performance gains. I assume the reason is that the engine was choking on the sheer amount of triangles it had to process, and reducing the triangle count reduced the amount of rendering work required during each frame. View frustum culling also provided an impressive performance gain in certain situations. When objects were out of the view frustum (when the player is looking up at the sky, for instance), the engine substantially sped up. Distance sorting also provided performance gains, but not as drastically.

Some work is required to take advantage of the acceleration techniques. The LOD system especially requires proper asset preparation. Each 3D model must have a corresponding low-poly version in order to take advantage of the LOD system. The low-poly version must be modeled by an artist, or created by decimating the original model. Both options are non-trivial.

The techniques themselves also incur additional costs each frame. The list of models must be sorted, and the model bounds must be recalculated by matrix multiplication each frame. While there are costs associated with each technique, the performance gained more than covers them. Overall, the three techniques provided an impressive performance boost. On complex scenes (~4 fps) I saw gains of up to 20-30 fps with the acceleration techniques enabled.

### 1. LOD

A Level of detail (LOD) system swaps out high-poly versions of a mesh for a low-poly proxy based on the camera distance.

The engine uses a hierarchical prefab structure to represent objects in a scene. A prefab is allowed to declare other prefabs as it's children. The prefab rendering algorithm is something like this:

```java
void draw(Prefab p)
{
	if (p.children.length > 0)
	{
		foreach (Prefab c in p.children)
		{
			draw(c);
		}
	}
	render(p.model)
}
```

I extended the engine to allow prefabs to declare a special `lodChild` member, and updated the rendering algorithm to take the lod child into account. If the prefab has an lod child then only the lod child is rendered, and any other children are ignored.

```java
void draw(Prefab p)
{
	if (p.lodChild != null && p.distanceFromCamera > LOD_DISTANCE)
	{
		draw(p.lodChild);
		return;
	}
	else
	{
		if (p.children.length > 0)
		{
			foreach (Prefab c in p.children)
			{
				draw(c);
			}
		}

		render(p.model);
	}
}
```

On average, I saw a 15-20 fps increase with the LOD system enabled.

![lod example](https://imgur.com/7FpnalF.png)

> An example of the LOD system in action. The main camera is located to the right of the windmill, and the LOD system has swapped out the regular tree prefabs for low-poly versions (highlighted in red).

### 2. View Frustum Culling

When the engine first starts, I run through the list of loaded models and generate an axis-aligned bounding box (AABB) for each model. This describes the model's extents relative to it's center (in object-space).

Because objects in the scene may be arbitrarily translated, rotated, and/or scaled, we must take the model's transform into account before utilizing the model's bounds. Each frame, I compute a new AABB in world-space by transforming the object-space bounds by the model matrix. I then use the reconstructed world-space AABB to perform the view frustum intersection.

```java
void render(Model model)
{
	Vector3[] corners = model.bounds.getCorners();
	AABB boundsWS = new AABB();

	foreach (Vector3 v in corners)
	{
		v = model.transform * v;
		boundsWS.extendBy(v);
	}

	// Uses Inigo Quilez's frustum-aabb intersection algorithm.
	if (CAMERA_FRUSTUM.intersects(boundsWS))
	{
		// perform GL rendering code for model.
	}
}
```

The performance gain varies depending on how many models are in/out of the frustum. In general, I saw around a 10-15 fps increase with view frustum culling enabled.

<iframe width="560" height="315" src="https://www.youtube.com/embed/soYuNgu7gVo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> The shape of the frustum can be seen from above as the main camera looks around in a circle.

### 3. Distance Sorting

Each frame a list of models is sent to the GPU to be rendered. By default, there is no order to the list. Distance sorting takes this list and sorts each model within it by its distance from the camera before sending the list on to the GPU. This allows the GPU to cut corners later on in the rendering pipeline.

When an object is rendered, it writes its depth (distance from the camera) into a special depth buffer. When the next object is rendered, it will check the depth buffer first to see if it is "behind" whatever was previously rendered. If it is, the GPU will not process it further.

If each object that is rendered constantly overwrites the depth buffer, many unnecessary objects will be rendered only to be covered up later. Sorting by distance ensures that the GPU doesn't waste time rendering objects which will only be covered up.

I saw around a 2 fps increase with distance sorting enabled.

## Credits

- rokuz's [AABB](https://github.com/rokuz/glm-aabb) library for C++/GLM.
- Inigo Quilez's [frustum-AABB intersection](https://www.iquilezles.org/www/articles/frustumcorrect/frustumcorrect.htm) algorithm.
- BitGem's [Birch Tree](https://sketchfab.com/3d-models/birch-tree-proto-series-free-f0203eb84beb4d638d148e2116f5dbf7).
- Skybox from [opengameart.org](https://opengameart.org/content/sky-box-sunny-day).
- Windmill from [Google Poly](https://poly.google.com/view/ctIRaIM3zXu).



## Source Code

The source code is available to download [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q?usp=sharing).
