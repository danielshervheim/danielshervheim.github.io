---
title: Signed Distance Field Generator
image: /assets/img/cover_photos/sdf.gif
permalink: /projects/signed-distance-field-generator
layout: page  # (required for debugging in --drafts mode).
---

# Signed Distance Field Generator

WIP.

```c
struct Triangle
{
	float3 v1, v2, v3;
};

float[,,] signedDistanceField(Triangle[] triangles, int dimension)
{
	float[,,] sdf = new float[dimension, dimension, dimension];

	// Find the min and max vertices of the triangle list.
	float3 minV = triangles[0].v1;
	float3 maxV = triangles[0].v1;
	for (int i = 0; i < triangles.length; i++)
	{
		minV = min(minV, triangles[i].v1);
		minV = min(minV, triangles[i].v2);
		minV = min(minV, triangles[i].v3);

		maxV = max(maxV, triangles[i].v1);
		maxV = max(maxV, triangles[i].v2);
		maxV = max(maxV, triangles[i].v3);
	}
	float3 range = maxV - minV;

	for (int z = 0; z < dimension; z++)
	{
		for (int y = 0; y < dimension; y++)
		{
			for (int x = 0; x < dimension; x++)
			{
				// Transform the point from voxel coordinates to mesh space.
				float3 p = float3(x, y, z);  // 0:(dim-1)
				p /= (float)(dimension-1);  // 0:1
				p *= range;  // 0:range
				p += minV;  // minV:maxV

				// Fill the voxel.
				sdf[x, y, z] = signedDistance(triangles, p);
			}
		}
	}

	return sdf;
}

float signedDistance(Triangle[] triangles, float3 point)
{
	// Find the distance to the nearest triangle.
	float min = triangleDist(triangles[0], point);
	for (int i = 1; i < triangles.length; i++)
	{
		float d = triangleDist(triangles[i], point);
		if (d < min)
		{
			min = d;
		}
	}

	// Raycast from the point upwards to see how many triangles we hit.
	int hits = 0;
	for (int i = 0; i < triangles.length; i++)
	{
		if (triangleRayIntersection(triangles[i], point, float3(0,1,0)))
		{
			hits++;
		}
	}

	// If we hit an odd number of triangles, then we are inside the mesh.
	if (hits % 2 != 0)
	{
		min *= -1;
	}

	return min;
}

float triangleDist(Triangle t, float3 point)
{

}

bool triangleRayIntersection(Triangle t, float3 origin, float3 direction)
{

}
```
