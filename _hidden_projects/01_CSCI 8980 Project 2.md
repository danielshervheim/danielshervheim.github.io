---
title: CSCI 8980 Project 2
image: /assets/img/placeholder.jpg
permalink: /hidden_projects/csci-8980-project-2
---

### Rendering Large Scenes

#### Part 1
![1a](https://imgur.com/k5qJkqT.png)
The default scene.

![1b](https://imgur.com/NLWirzc.png)
An island scene, featuring a windmill from Google Poly.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MMpFz28Ee9A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The same island scene, with a dynamic camera implemented.

![1d](https://imgur.com/7BxpoR7.png)
The same island scene with 441 trees, running at 4 frames per second.



#### Part 2

GEFS is a lightweight game engine provided to us for the purpose of this project. Our goal was to enhance the engine's performance when rendering complex, large-scale scenes. Towards that goal, I implemented three different techniques to accelerate the engine performance:

1. An LOD system.
2. View Frustum Culling.
3. Distance Sorting.

Of the three techniques, I found that the LOD system provided the most substantial performance gains. I assume the reason is that the engine was choking on the sheer amount of triangles it had to process, and reducing the triangle count reduced the amount of rendering work required during each frame. View frustum culling also provided an impressive performance gain in certain situations. When objects were out of the view frustum (when the player is looking up at the sky, for instance), the engine substantially sped up. Distance sorting also provided performance gains, but not as drastically.

Some work is required to take advantage of the acceleration techniques. The LOD system especially requires proper asset preparation. Each 3D model must have a corresponding low-poly version in order to take advantage of the LOD system. The low-poly version must be modelled by an artist, or created by decimating the original model. Both options are non-trivial.

The techniques themselves also incur additional costs each frame. The list of models must be sorted, and the model bounds must be recalculated by matrix multiplication each frame. While there are costs associated with each technique, the performance gained more than covers them. Overall, the three techniques provided an impressive performance boost. On complex scenes (~4 fps) I saw gains of up to 20-30 fps with the acceleration techniques enabled. 

#### 1. LOD

A Level of detail (LOD) system swaps out high-poly versions of a mesh for a low-poly proxy based on the camera distance.

The engine uses a heirarchical prefab structure to represent objects in a scene. A prefab is allowed to declare other prefabs as it's children. The prefab rendering algorithm is something like this:

```
void draw(model)
	if model.children > 0
		draw(model.children[i])
	end
	
	render model
end
```

I extended the engine to allow prefabs to declare a special lod child, and updated the rendering algorithm to take the lod child into account. If the prefab has an lod child then only the lod child is rendered, and any other children are ignored.

```
void draw(model)
	if model.lodChild and model.distanceFromCamera > lodDistance
		draw (model.lodChild)
		return
	end
	
	if model.children > 0
		draw(model.children[i])
	end
	
	render model
end
```

On average, I saw a 15-20 fps increase with the LOD system enabled.

![lod example](https://imgur.com/7FpnalF.png)
An example of the LOD system in action. The main camera is located to the right of the windmill, and the LOD system has swapped out the regular tree prefabs for low-poly versions (highlighted in red).

#### 2. View Frustum Culling

When the engine first starts, I run through the list of loaded models and generate an axis-aligned bounding box (AABB) for each model. This describes the model's extents relative to it's center (in object space).

Because objects in the scene may be arbitrarily translated, rotated, and/or scaled, we must take the model's transform into account before utilizing the model's bounds. Each frame, I compute a new AABB in world space by transforming the object space bounds by the model matrix. I then use the reconstructed world space AABB to perform the view frustum intersection.

```
render(model, frustum)
	corners = model.bounds.getCorners()
	
	foreach corner in corners
		corner = model.transform * corner
	end
	
	AABB boundsWS = new AABB
	
	foreach corner in corners
		boundsWS.extendBy(corner)
	end
	
	if frustum intersects boundsWS
		render model
	else
		return
	end
end
```

The performance gain varies depending on how many models are in/out of the frustum. In general, I saw around a 10-15 fps increase with view frustum culling enabled.

<iframe width="560" height="315" src="https://www.youtube.com/embed/soYuNgu7gVo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The shape of the frustum can be seen from above as the main camera looks around in a circle.

#### 3. Distance Sorting

Each frame a list of models is sent to the GPU to be rendered. By default, there is no order to the list. Distance sorting takes this list and sorts each model within it by its distance from the camera before sending the list on to the GPU. This allows the GPU to cut corners later on in the rendering pipeline.

When an object is rendered, it writes its depth (distance from the camera) into a special depth buffer. When the next object is rendered, it will check the depth buffer first to see if it is "behind" whatever was previously rendered. If it is, the GPU will not process it further.

If each object that is renders constantly overwrites the depth buffer, many unnecessary objects will be rendered only to be covered up later. Sorting by distance ensures that the GPU doesn't waste time rendering objects which will only be covered up.

I saw around a 2 fps increase with distance sorting enabled.

#### Videos

<iframe width="560" height="315" src="https://www.youtube.com/embed/wGmOhkj5X3Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The island scene rendered with no acceleration techniques. The framerate hovers around 5 fps, far too low for realtime use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/milhOFbAaIk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The island scene rendered with acceleration techniques. The framerate hovers around 30 fps, acceptable for realtime use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/1ySQNrvL_OA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The island scene as viewed through the debug camera. The frustum culling system is visible throughout the video as the camera "sweeps" in an arc around the scene. The LOD system is visible around 0:15 (notice the slight change in contour of the trees).


#### Credits

- rokuz's [AABB](https://github.com/rokuz/glm-aabb) library for C++/GLM.
- Inigo Quilez's [frustum-AABB intersection](https://www.iquilezles.org/www/articles/frustumcorrect/frustumcorrect.htm
) algorithm.
- BitGem's [Birch Tree](https://sketchfab.com/3d-models/birch-tree-proto-series-free-f0203eb84beb4d638d148e2116f5dbf7
).
- Skybox from [opengameart.org](https://opengameart.org/content/sky-box-sunny-day
).
- Windmill from [Google Poly](https://poly.google.com/view/ctIRaIM3zXu
).



#### Source Code

The source code is available to download [here](https://drive.google.com/drive/folders/15e5d5eMOY7Mnlr6pb9vtDpczVOlYjQ4Q?usp=sharing).