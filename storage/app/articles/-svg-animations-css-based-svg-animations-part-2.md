---
title: SVG animations\: CSS bases SVG animations - PART 2
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to animate SVGs using css animations.
---


## SVG properties in css

## Animating with CSS transformations & changes

## Drawing the outlines
<style type="text/css">
@keyframes draw {
    0% {
    opacity: 0;
    stroke-dashoffset:-300;
  }
  100% {
    opacity: 1;
    stroke-dashoffset:0;
  }
}
#draw path{
    stroke-dasharray: 300 300;
    animation: draw 3s;
    animation-fill-mode: forwards;
}
</style>

<svg id="draw" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <path id="outside" d="M48 15.2c9.7 0 23.3 1.4 23.3 17.5 0 10-6.4 13.2-10.2 15.1 4.7 1.3 12.5 5 12.5 16.5 0 16.7-11.9 19.4-24.8 19.4H32.4c-1.7 0-2.1-.4-2.1-2.1V17.3c0-1.8.4-2.1 2.1-2.1H48z" fill="none" stroke="#000"/>
  <path id="innertop" d="M46.9 43.5c5.9 0 10.9-1.5 10.9-9.4 0-6.3-4.3-8.4-9.8-8.4h-4.2v17.8h3.1z" fill="none" stroke="#000"/>
  <path id="innerbottom" d="M47.4 73.2c6.9 0 12.7-1.2 12.7-9.7 0-8.4-5.8-9.5-12.5-9.5h-3.8v19.2h3.6z" fill="none" stroke="#000"/>
</svg>
