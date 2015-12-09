---
title: SVG animations\: Advanced SVG animations - PART 3
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to do advanced SVG  animates using SIML.
---
# SVG animations: Advanced SVG animations
{$meta}

## Animate along a path
<svg ...>
<!-- Define the motion path animation -->
<animateMotion xlink:href="#plane" dur="5s" repeatCount="indefinite" rotate="auto">
  <mpath xlink:href="#planePath" />
</animateMotion> </svg>

<svg xmlns="http://www.w3.org/2000/svg" style="width: 400px; height: 200px; padding: 50px; background: #e8f3f5;">
    <path id="movepath" d="M21.7 145s194 55.7 251.3-44.7-111.3-106-137.3-44 38 98 76.7 104.7c0 0 168.7 25.3 160.7-19.3s-62-72-32.7-92.7" fill="none" stroke="#92c2cb" stroke-dasharray="20 20" />
    <g id="cloud" style="height: 100px; width: 100px; display: block; transform: translate(0, -60px);">
      <path d="M31.8 79c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2zM45.6 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.6 1.6 3.2 4.4 3.2 6.2zM65.2 84c0 1.7-1.5 3-3.2 3s-3.2-1.4-3.2-3 2.5-4.7 3.2-6.3c.6 1.5 3.2 4.4 3.2 6.2zM80.8 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2z" fill="#00B5E1"/>
      <path class="sun-rays" d="M38.7 23.7c1.2 0 2-1 2-2v-7.3c0-1.2-.8-2-2-2s-2 .8-2 2v7.2c0 1.2.8 2 2 2zM22.2 40.2c0-1.2-1-2-2-2h-7.3c-1.3 0-2.2.8-2.2 2s1 2 2 2h7.3c1.3 0 2.2-.8 2.2-2zM53.3 28.5l5-5c1-1 1-2.3 0-3-.7-1-2-1-3 0l-5 5c-.8.8-.8 2.2 0 3 1 1 2.2 1 3 0zM24 28.5c.8.8 2.2.8 3 0 .8-.8.8-2.2 0-3l-5-5c-1-1-2.3-1-3 0-1 .7-1 2 0 3l5 5z" fill="#FFC300"/>
      <path d="M28.4 40.2C28.4 34.5 33 30 38.7 30c3.7 0 7 2 8.7 5 .6-.5 1.7-1 3.4-1.5-2.4-4.3-7-7.2-12.2-7.2-7.7 0-14 6.2-14 14 0 1.5.4 3 1 4.5.4-.5 1.4-1.3 3-2l-.2-2.6z" fill="#FFC300"/>
      <path d="M79.7 47c-2.5 0-4.8.8-6.6 2.3-.3-9.2-8-16.5-17.2-16.5-1.7 0-3.4.3-5 .7-1.7.4-2.8 1-3.4 1.4-3.3 1.7-6 4.6-7.5 8-2-.8-4-1.4-6-1.4s-3.7.4-5.3 1c-1.7.8-2.7 1.7-3.2 2-2.8 2.5-4.6 6-4.6 10 0 7.2 5.7 13 12.8 13h45.8C85.3 67.5 90 62.8 90 57c0-5.5-4.5-10-10.3-10z" fill="#fff"/>
    </g>
    <animateMotion xlink:href="#cloud" dur="5s" repeatCount="indefinite" begin="1s" rotate="auto">
      <mpath xlink:href="#movepath" />
    </animateMotion>
</svg>

## Text along a path
<svg width="500" height="350" viewBox="0 0 500 350">
 <path id="textPath" d="M26.8 133S57.4 78.2 105 84s59.1 83.4 102.7 67.7c34-12.2 45.9-63.9 69-63.9" fill="none" stroke="#000"  stroke-dasharray="10 20"/>
  <text>
    <textpath xlink:href="#textPath" style="font-size: 26px;" startOffset="50%">
      Text on a path.
      <animate attributeName="startOffset" from="0%" to="100%" begin="2s" dur="5s" repeatCount="indefinite"/>
    </textpath>
  </text>
</svg>

http://cubic-bezier.com/#1,.2,.02,1



<svg width="500" height="350" viewBox="0 0 500 350">
 <path id="textPath" d="M26.8 133S57.4 78.2 105 84s59.1 83.4 102.7 67.7c34-12.2 45.9-63.9 69-63.9" fill="none" stroke="#000"  stroke-dasharray="10 20"/>
  <text>
    <textpath xlink:href="#textPath" style="font-size: 26px;" startOffset="50%">
      Text on a path.
      <animate attributeName="startOffset" from="0%" to="100%" begin="2s" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="1 0.2 0.2 1" keyTimes="0;1"/>
    </textpath>
  </text>
</svg>


## Masking

<style type="text/css">
.maskSVG {
  width: 500px;
}

.clip {
  animation: slide 8s infinite;
}

@keyframes slide {
  0% {
    transform: translateY(-135px);
  }
  50% {
    transform: translateY(-5px);
  }
  0% {
    transform: translateY(-135px);
  }
}
</style>

<svg class="maskSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <clipPath id="clip">
      <path class="clip" d="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314
	c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z">
      </path>
    </clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <path class="logo" fill="black" d="M42.8 6.7c19.4 0 46.6 2.8 46.6 35 0 20-12.8 26.4-20.4 30.2 9.4 2.6 25 10 25 33 0 33.4-23.8 38.8-49.6 38.8H11.6c-3.4 0-4.2-.8-4.2-4.2V10.9c0-3.6.8-4.2 4.2-4.2h31.2zm-2.2 56.6c11.8 0 21.8-3 21.8-18.8 0-12.6-8.6-16.8-19.6-16.8h-8.4v35.6h6.2zm1 59.4c13.8 0 25.4-2.4 25.4-19.4 0-16.8-11.6-19-25-19h-7.6v38.4h7.2z"/>
  </g>
</svg>
