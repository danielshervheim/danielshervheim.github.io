---
title: CSCI 8980 Project 2
image: /assets/img/placeholder.jpg
permalink: /hidden_projects/csci-8980-project-2
---

### Rendering Large Scenes

#### 1a
The default scene.
![1a](https://imgur.com/k5qJkqT.png)



#### 1b
An idyllic island scene, featuring a windmill from Google Poly.
![1b](https://imgur.com/NLWirzc.png)



#### 1c
The same island scene, with a dynamic camera implemented.
<iframe width="560" height="315" src="https://www.youtube.com/embed/MMpFz28Ee9A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
#### 1d
The same island scene, with 440+ trees added (28,000+ triangles per tree).
![1d](https://imgur.com/7BxpoR7.png)



#### Thoughts

I implemented three different techniques to help improve the performance of the engine in dense scenes.
- LOD
- Frustum Culling
- Distance Sorting

I found that the LOD system provided the largest performance boost. I would assume it has to do with the sheer amount of triangles being rendered without it. Substituting a lower poly version of a model reduces the number of triangles the GPU has to rasterize and render.

Frustum culling also provided a substantial performance boost, but not as absolutely as the LOD system. Frustum culling only boosts performance when there are objects outside of the frustum that we could skip rendering. If you are viewing the entire scene (say, from the air for example), then frustum culling provides little improvement.

Distance sorting improved performance the least. It was, however, still an improvement. I think the reason the improvement was not as drastic is that

While the performance improvement is impressive, the techniques are not without limitation.  An LOD system is useless without properly prepared assets. Multiple versions of each model must be created by an artist, and care must be taken that the lower poly version remains faithful to the original or "popping" will be visible when the lower poly version replaces the original version.

The techniques are not "free", so to speak. There is a cost associated with sorting the `toDraw` list, and with transforming the models bounding box corners into world space. However, the cost required for each technique is almost always worth it due to the performance improvements gained.

#### LOD

Level of detail (LOD) is a system for swapping out high resolution versions of a mesh for a lower resolution one.

In addition to declaring `child` objects, prefabs can declare a special `lodChild`.

When a prefab is rendered, I check if it has an `lodChild` declared. If it does, and if the model is further away from the camera than a certain preset distance, I render the `lodChild` of the prefab rather than any other children the prefab might have.

On average, I saw a 15-20 fps increase with the LOD system enabled.

![lod example](https://imgur.com/7FpnalF.png)
In this photo, the camera is located just to the right of the wind mill. The low poly trees are highlighted in red, and the regular trees are rendered as normal. Note the smoother curves in the branches of the regular trees.

#### View Frustum Culling

When the application first starts, I run through the list of models and generate an axis-aligned bounding box (AABB) for each model. This describes the model's extents relative to it's center (in object space).

When a model is rendered, I take the eight corners of the bounding box and transform them by the model matrix. The result is an oriented bounding box (OBB) in world space. I then create an AABB by enclosing the eight transformed corners of the OBB. The result is an AABB that accurately describes the extents of the transformed model (in world space).

I then check whether the new AABB intersects the viewing frustum. I only send the model to the GPU for rendering if the AABB intersects the viewing frustum.

The performance acceleration varies depending on how many models are in/out of the frustum. In general, I saw around 10-15 fps increase with view frustum culling enabled.

<iframe width="560" height="315" src="https://www.youtube.com/embed/soYuNgu7gVo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
In this video, the diamond-like shape of the frustum can be seen from above. Trees outside the frustum are not rendered as the camera sweeps in an arc.

#### Distance Sorting

I implemented distance sorting to accelerate the rendering process. Distance sorting is an acceleration technique that 

Every frame, a list of models is sent to the GPU to be rendered. Distance sorting intercepts this list of models before it is sent to the GPU, and sorts it. The list is sorted by placing the models nearest to the camera in the front, and those furthest from the camera at the back.

This enables the GPU to cut some corners later on in the rendering pipeline. When an object is rendered, it writes its depth (distance from the camera) into a special depth buffer. When the next object is rendered, it will check the depth buffer first to see if it is "behind" whatever was previously rendered. If it is, the GPU will cease processing it.

This only works if the nearest objects are rendered first. Otherwise the further objects will render themselves, and just be overwritten by nearer objects rendered later on.

I saw an average 2 fps increase with distance sorting enabled vs disabled.

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