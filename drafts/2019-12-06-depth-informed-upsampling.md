---
title: "Depth Informed Upsampling"
image: /assets/img/placeholder.jpg
---

# Depth Aware Upsampling


Inputs:

- High resolution depth map `depth`.
- Low resolution solution `solutionSmall`.



Procedure:

- Compute a low resolution depth map `depthSmall` by downsampling to the same size as `solutionSmall`.

- Fill out the high resolution solution `solution` by the following procedure:

- For each pixel position `p` in `solution`.
  - Sample the high resolution depth map at `p` and save it as `depthAtP`.
  - Compute the corresponding pixel position `pSmall` in `solutionSmall`.
  - Look at the 9 pixels `qSmall` surrounding `pSmall`.
  - Sample the small resolution depth map at `qSmall` and save it as `depthAtQSmall`.
    - If the difference in depth between `depthAtP` and `depthAtQSmall` is smaller than any difference so far, save `qSmall` as `qSmallestPixelPosition`.
- Set the `solution` at pixel position `p` to the small resolution solution sampled at `qSmallestPixelPosition`.
