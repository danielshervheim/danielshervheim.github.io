---
title: CSCI 8980 Project 2
image: /assets/img/placeholder.jpg
permalink: /hidden_projects/csci-8980-project-2
---

### Rendering Large Scenes

#### Part 1
The default scene.
![1a](https://imgur.com/k5qJkqT.png)

An idyllic island scene, featuring a windmill from Google Poly.
![1b](https://imgur.com/NLWirzc.png)

The same island scene, with a dynamic camera implemented.
<iframe width="560" height="315" src="https://www.youtube.com/embed/MMpFz28Ee9A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The same island scene, with 440+ trees added (28,000+ triangles per tree).
![1d](https://imgur.com/7BxpoR7.png)



#### Part 2

I implemented three different techniques to accelerate the rendering performance in large scenes:

- LOD
- Frustum Culling
- Distance Sorting

I found that the LOD system provided the most substantial performance gains. I assume that is because of the sheer amount of triangles rendering.






I found that the LOD system provided the most performance gains. I assume it has to do with the sheer amount of triangles being rendered.

Frustum culling also provided a substantial performance gain, but not across the board. Frustum culling only boosts performance when there are objects outside of the frustum that you could skip rendering. If you are viewing the entire scene (from the air, for example) then frustum culling provides little improvement.

Distance sorting also provided a performance gain, but much smaller than the LOD and frustum culling systems.

Combined, the techniques provide an impressive performance gain. They are not, however, without limitations. The LOD system is useless without properly prepared assets. High poly and low poly versions of each model must be created, and the low poly version must remain faithful to the high poly version or popping will be visible when the two versions are swapped.

They are also not without costs themselves. The `toDraw` list must be sorted each frame, and each model's bounding box must be multiplied with its transform matrix as well. I have found however, that the cost of each technique is more than worth it given the performance gains.

#### LOD

Level of detail (LOD) is a system for swapping out high poly versions of a mesh for a lower poly one.

The GEFS allows prefabs to declare other children as prefabs. The general rendering algorithm is something like this:

```
draw(model)
	if model.children > 0
		draw(model.children[i])
	
	render model
```

I extended the engine to allow prefabs to declare a special lod child, and the rendering algorithm to take the lod child into account. If the prefab has an lod child, only the lod child is rendered and any other children are ignored.

```
draw(model)
	if model.lodChild and model.distanceFromCamera > lodDistance
		draw (model.lodChild)
		return
	if model.children > 0
		draw(model.children[i])
	
	render model
```

On average, I saw a 15-20 fps increase with the LOD system enabled.

![lod example](https://imgur.com/7FpnalF.png)
In this screenshot (viewed through the debug camera), the main camera is located just to the right of the windmill. The tree prefab has two children: the main tree prefab and the low poly lod child prefab. The low poly version is highlighted in red.

#### View Frustum Culling

When the application first starts, I run through the list of models and generate an axis-aligned bounding box (AABB) for each model. This describes the model's extents relative to it's center (in object space).

When a model is rendered, I take the eight corners of the bounding box and transform them by the model matrix. The result is an oriented bounding box (OBB) in world space. I then create an AABB by enclosing the eight transformed corners of the OBB. The result is an AABB that accurately describes the extents of the transformed model in world space.

I then check whether the new AABB intersects the viewing frustum and discard it from rendering if it doesn't.

The performance gains vary depending on how many models are in/out of the frustum. In general, I saw around 10-15 fps increase with view frustum culling enabled.

<iframe width="560" height="315" src="https://www.youtube.com/embed/soYuNgu7gVo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
In this video, the diamond-like shape of the frustum can be seen from above. Trees outside the frustum are not rendered as the camera sweeps around the scene.

#### Distance Sorting

Every frame, a list of models is sent to the GPU to be rendered. Distance sorting intercepts this list of models before it is sent to the GPU, and sorts it. The list is sorted by placing the models nearest to the camera in the front, and those furthest from the camera at the back.

This enables the GPU to cut some corners later on in the rendering pipeline. When an object is rendered, it writes its depth (distance from the camera) into a special depth buffer. When the next object is rendered, it will check the depth buffer first to see if it is "behind" whatever was previously rendered. If it is, the GPU will discard it from further processing.

This only works if the nearest objects are rendered first. Otherwise the further objects will render themselves, and be overwritten by nearer objects rendered later on.

I saw around a 2 fps increase with distance sorting enabled.

#### Videos

The island scene rendered with no acceleration techniques. The framerate hovers around 5 fps, far too low for realtime use.
<iframe width="560" height="315" src="https://www.youtube.com/embed/wGmOhkj5X3Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The island scene rendered with acceleration techniques. The framerate hovers around 30 fps, acceptable for realtime use.
<iframe width="560" height="315" src="https://www.youtube.com/embed/milhOFbAaIk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
The island scene as viewed through the debug camera. The frustum culling system is visible throughout the video as the camera "sweeps" in an arc around the scene. The LOD system is visible around 0:15 (notice the slight change in contour of the trees).
<iframe width="560" height="315" src="https://www.youtube.com/embed/1ySQNrvL_OA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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