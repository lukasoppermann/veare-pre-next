---
title: SVG animations\: Creating and changing SVGs - PART 1
tags: tag1, tag2
author: Lukas Oppermann
description: learn how SVGs are created, included and changed using css.
---
# SVG animations: Creating and changing SVGs
{$meta}

<a style="width: 100%; display: block; background: #e8f3f5; border-radius: 3px;" href="/media/svg-cloud.svg" target="_blank" download>
<svg xmlns="http://www.w3.org/2000/svg" style="max-width: 400px; left: 50%; transform: translateX(-50%); position: relative;" width="100%" viewBox="0 0 100 100">
  <path d="M31.8 79c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2zM45.6 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.6 1.6 3.2 4.4 3.2 6.2zM65.2 84c0 1.7-1.5 3-3.2 3s-3.2-1.4-3.2-3 2.5-4.7 3.2-6.3c.6 1.5 3.2 4.4 3.2 6.2zM80.8 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2z" fill="#00B5E1"/>
  <path id="rain4" d="M38.7 23.7c1.2 0 2-1 2-2v-7.3c0-1.2-.8-2-2-2s-2 .8-2 2v7.2c0 1.2.8 2 2 2zM22.2 40.2c0-1.2-1-2-2-2h-7.3c-1.3 0-2.2.8-2.2 2s1 2 2 2h7.3c1.3 0 2.2-.8 2.2-2zM53.3 28.5l5-5c1-1 1-2.3 0-3-.7-1-2-1-3 0l-5 5c-.8.8-.8 2.2 0 3 1 1 2.2 1 3 0zM24 28.5c.8.8 2.2.8 3 0 .8-.8.8-2.2 0-3l-5-5c-1-1-2.3-1-3 0-1 .7-1 2 0 3l5 5z" fill="#FFC300"/>
  <path d="M28.4 40.2C28.4 34.5 33 30 38.7 30c3.7 0 7 2 8.7 5 .6-.5 1.7-1 3.4-1.5-2.4-4.3-7-7.2-12.2-7.2-7.7 0-14 6.2-14 14 0 1.5.4 3 1 4.5.4-.5 1.4-1.3 3-2l-.2-2.6z" fill="#FFC300"/>
  <path d="M79.7 47c-2.5 0-4.8.8-6.6 2.3-.3-9.2-8-16.5-17.2-16.5-1.7 0-3.4.3-5 .7-1.7.4-2.8 1-3.4 1.4-3.3 1.7-6 4.6-7.5 8-2-.8-4-1.4-6-1.4s-3.7.4-5.3 1c-1.7.8-2.7 1.7-3.2 2-2.8 2.5-4.6 6-4.6 10 0 7.2 5.7 13 12.8 13h45.8C85.3 67.5 90 62.8 90 57c0-5.5-4.5-10-10.3-10z" fill="#fff"/>
</svg>
</a>

For this tutorial I will be working with this simple multicolored svg icon. If you want to follow along, use a similar svg or just <a href="/media/svg-cloud.svg" download>download the svg above</a>. But before we get into animating SGVs we need to know how to get them correctly out of Illustrator / Sketch / etc. and into our code...

## Creating and exporting svgs
The first thing to know about working with svgs is, that the fewer anchor points you use, the easier working with it will be. Also, reducing the number of anchor points, will reduce the size of your image. Of course, you don't want to effect the quality of your illustration, illustrations are optimized to be printed in huge sizes, so reducing some of the points will actually not be visible on a screen.

Make sure all forms are correctly closed and you are not using any photoshop effects, like shadows, etc. Also when working with fonts, I suggest to turn the font into paths, as this will mean there is no need to include the font into the website and you will not have FOUC or problems when the font can't be downloaded.

Also beware of gradients. While they do work, they will have to be defined in code, using the `<linearGradient>` tag with an ID which is provided the SVGs `fill` attribute. So it is not quite as easy as in css.

So now that you created your illustration keeping the above mentioned things in mind, you can export it.

![Adobe Illustrator export options](/media/illustrator-svg-export.jpg)

As I mentioned before, I suggest to convert the type to outlines (paths), but **not** via the export option. Do it within illustrator, so you can see the result beforehand and tweak it, if needed. If you do this, the **font** option does not matter, as you will not have any fonts inside your svg. If you are actually going to keep your text as text, use the `SVG` option here.

The **options** section is not of interest, as we are not wanting to imbed images in our svg. If you do, I would suggest using the `embed` option, as it means you will not need to keep track of a separate asset.

The **advanced options** are the options that actually interest us. Choose the `style attribute` option for **CSS Properties**, as it will produce the most readable output. **Decimal Places** describes the decimal places used for positioning anchor points. You should be good with 1 decimal place in most cases, if the result is wrong, you can adjust it by increments of 1.

## Optimizing the SVG
Currently the best option for optimizing an SVG is [*svgo*](https://github.com/svg/svgo). After installing it via `npm` you can run it from the terminal `$ svgo test.svg` but doing so is less than comfortable. So there are two alternatives: implementing *svgo* into a task runner, like [gulp](https://www.npmjs.com/package/gulp-svgmin), which is sensible if you use a task runner in any case.

If not and you just having a couple of SVGs to optimise a [browser based solution](https://jakearchibald.github.io/svgomg/) might be right for you. This is also useful for important and more complicated SVGs, as you can see the result straight away. You also have a huge amount of options available, which you can try out, *including the decimal places* so you can export an svg with problems using 5 decimal places and reduce them in this tool to find the optimal number.

![SVGO web tool](/media/svgo-webtool.jpg)

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <path fill="#FFC300" d="M38.7 23.7c1.2 0 2-1 2-2v-7.3c0-1.2-.8-2-2-2s-2 .8-2 2v7.2c0 1.2.8 2 2 2zM22.2 40.2c0-1.2-1-2-2-2h-7.3c-1.3 0-2.2.8-2.2 2s1 2 2 2h7.3c1.3 0 2.2-.8 2.2-2zM53.3 28.5l5-5c1-1 1-2.3 0-3-.7-1-2-1-3 0l-5 5c-.8.8-.8 2.2 0 3 1 1 2.2 1 3 0zM24 28.5c.8.8 2.2.8 3 0 .8-.8.8-2.2 0-3l-5-5c-1-1-2.3-1-3 0-1 .7-1 2 0 3l5 5z"/>
  <path fill="#00B5E1" d="M31.8 79c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2zM45.6 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.6 1.6 3.2 4.4 3.2 6.2zM65.2 84c0 1.7-1.5 3-3.2 3s-3.2-1.4-3.2-3 2.5-4.7 3.2-6.3c.6 1.5 3.2 4.4 3.2 6.2zM80.8 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2z"/>
  <path fill="#E1EBEB" d="M79.7 47c-2.5 0-4.8.8-6.6 2.3-.3-9.2-8-16.5-17.2-16.5-1.7 0-3.4.3-5 .7-1.7.4-2.8 1-3.4 1.4-3.3 1.7-6 4.6-7.5 8-2-.8-4-1.4-6-1.4s-3.7.4-5.3 1c-1.7.8-2.7 1.7-3.2 2-2.8 2.5-4.6 6-4.6 10 0 7.2 5.7 13 12.8 13h45.8C85.3 67.5 90 62.8 90 57c0-5.5-4.5-10-10.3-10z"/>
  <path fill="#FFC300" d="M28.4 40.2C28.4 34.5 33 30 38.7 30c3.7 0 7 2 8.7 5 .6-.5 1.7-1 3.4-1.5-2.4-4.3-7-7.2-12.2-7.2-7.7 0-14 6.2-14 14 0 1.5.4 3 1 4.5.4-.5 1.4-1.3 3-2l-.2-2.6z"/>
</svg>
```

If you actually named your layers in illustrator you get something even better. As you can see below the names of the layers are kept as ids. Make sure when optimizing that you disable `Clean IDs` as this will actually remove the IDs. We do need the IDs though to get parts of the SVG and change it.

```xml
<svg id="rainsuncloud" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <g id="sun" fill="#FFC300">
    <path d="M28.4 40.2C28.4 34.5 33 30 38.7 30c3.7 0 7 2 8.7 5 .6-.5 1.7-1 3.4-1.5-2.4-4.3-7-7.2-12.2-7.2-7.7 0-14 6.2-14 14 0 1.5.4 3 1 4.5.4-.5 1.4-1.3 3-2l-.2-2.6zM38.7 23.7c1.2 0 2-1 2-2v-7.3c0-1.2-.8-2-2-2s-2 .8-2 2v7.2c0 1.2.8 2 2 2zM22.2 40.2c0-1.2-1-2-2-2h-7.3c-1.3 0-2.2.8-2.2 2s1 2 2 2h7.3c1.3 0 2.2-.8 2.2-2zM53.3 28.5l5-5c1-1 1-2.3 0-3-.7-1-2-1-3 0l-5 5c-.8.8-.8 2.2 0 3 1 1 2.2 1 3 0zM24 28.5c.8.8 2.2.8 3 0 .8-.8.8-2.2 0-3l-5-5c-1-1-2.3-1-3 0-1 .7-1 2 0 3l5 5z"/>
  </g>
  <path id="rain4" fill="#00B5E1" d="M31.8 79c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2z"/>
  <path id="rain3" fill="#00B5E1" d="M45.6 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.6 1.6 3.2 4.4 3.2 6.2z"/>
  <path id="rain2" fill="#00B5E1" d="M65.2 84c0 1.7-1.5 3-3.2 3s-3.2-1.4-3.2-3 2.5-4.7 3.2-6.3c.6 1.5 3.2 4.4 3.2 6.2z"/>
  <path id="rain1" fill="#00B5E1" d="M80.8 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2z"/>
  <path id="cloud" fill="#E1EBEB" d="M79.7 47c-2.5 0-4.8.8-6.6 2.3-.3-9.2-8-16.5-17.2-16.5-1.7 0-3.4.3-5 .7-1.7.4-2.8 1-3.4 1.4-3.3 1.7-6 4.6-7.5 8-2-.8-4-1.4-6-1.4s-3.7.4-5.3 1c-1.7.8-2.7 1.7-3.2 2-2.8 2.5-4.6 6-4.6 10 0 7.2 5.7 13 12.8 13h45.8C85.3 67.5 90 62.8 90 57c0-5.5-4.5-10-10.3-10z"/>
</svg>
```

If your IDs are badly named, you can just rename the IDs in your code as they have no influence on the SVG at the moment. Pick some names that make sense.

## Embedding / loading the SVG

### `<img>` tag
There are multiple ways to embed an SVG into your website, the by far easiest way is to just use it as the source of an `<img>` tag. Just like loading any other image. If the image depends in the browser width, the SVG will scale and look crips in all resolutions.

The problem with this method though is, that the image can not be changed via css. Another downside is, that this adds an http request for the image resource. This is bad, as you generally want to have as few resources downloaded as possible to boost performance.

### CSS background-image
Just like with other image types, you can use svgs as background-images via css. They work exactly the same and scale nicely. Note though, that you have to set the size of the image, for e.g. to `100%` or so depending on your case, or else there may only be a part of the SVG shown.

But just like when using the `<img>` tag to include an SVG, using them as css backgrounds brings the same downsides. You have an additional http request and even worse, you can not change the SVG using css. An **exception** is css that is within the SVG itself. For example, you can define media queries that hide and show parts of the SVG, depending on the screen size, those will still work, even if included via the `<img>` tag or as a css background.

### Direct code include
As you have seen above, SVGs are code itself, some kind of *xml* stuff. So shouldn't you be able to just dump this in your html files as is? Well, you are and its a pretty spiffy way of using SVGs as it does mean there is no additional http request and you will be able to manipulate the SVG via css. Also, since SVG is text, it gzips very well.

You can even include something like an icon sprite on the top of your page and just reference individual items. For this you need to use the `<use>` tag and reference the ID of something like a symbol. I will talk further about this technique in a later post.

```html
<svg ... style="display:none;">
  <path id="someIcon" .../>
</svg>

<svg viewBox="0 0 50 50" class="some-icon">
  <use xlink:href="#someIcon"></use>
</svg>
```

Styling this is not as straight forward as one would wish. You can directly style the element in the SVG you included, but this will change it for all instances of `someIcon`. A better approach is to style the `<svg>` element. **Make sure** your `path` does not have a `fill` attribute (this means it should show up black). Now you can just change the css `fill` attribute for the SVG `.some-icon` and only the SVG inside will inherit this color. The downside to this approach is, that it does not work for changing multiple colors on a multi-colored SVG.

There are a couple other methods to include SVGs, but the 3 above are the more important ones as you will use the mostly.

## Changing the SVG using css
Animating means changing properties, so lets look into how we can change the properties of our SVG. Hover the image to see the css changing the color of the rays.

<style type="text/css">
.changing-svg .sun-rays{
    fill: #ff7e00;
}
.changing-svg:hover .sun-rays{
    fill: #FFC300;
}
</style>
<div style="display: flex; flex-wrap: wrap; justify-content: flex-start;">
<svg class="changing-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="flex-shrink: 0; flex-basis: 250px; flex-grow: 1; background: #e8f3f5; border-radius: 3px; margin: 0 20px 20px 0;">
  <path d="M31.8 79c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2zM45.6 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.6 1.6 3.2 4.4 3.2 6.2zM65.2 84c0 1.7-1.5 3-3.2 3s-3.2-1.4-3.2-3 2.5-4.7 3.2-6.3c.6 1.5 3.2 4.4 3.2 6.2zM80.8 90.6c0 1.8-1.5 3.2-3.2 3.2s-3.2-1.5-3.2-3.2 2.5-4.6 3.2-6.2c.5 1.6 3.2 4.4 3.2 6.2z" fill="#00B5E1"/>
  <path class="sun-rays" d="M38.7 23.7c1.2 0 2-1 2-2v-7.3c0-1.2-.8-2-2-2s-2 .8-2 2v7.2c0 1.2.8 2 2 2zM22.2 40.2c0-1.2-1-2-2-2h-7.3c-1.3 0-2.2.8-2.2 2s1 2 2 2h7.3c1.3 0 2.2-.8 2.2-2zM53.3 28.5l5-5c1-1 1-2.3 0-3-.7-1-2-1-3 0l-5 5c-.8.8-.8 2.2 0 3 1 1 2.2 1 3 0zM24 28.5c.8.8 2.2.8 3 0 .8-.8.8-2.2 0-3l-5-5c-1-1-2.3-1-3 0-1 .7-1 2 0 3l5 5z"/>
  <path d="M28.4 40.2C28.4 34.5 33 30 38.7 30c3.7 0 7 2 8.7 5 .6-.5 1.7-1 3.4-1.5-2.4-4.3-7-7.2-12.2-7.2-7.7 0-14 6.2-14 14 0 1.5.4 3 1 4.5.4-.5 1.4-1.3 3-2l-.2-2.6z" fill="#FFC300"/>
  <path d="M79.7 47c-2.5 0-4.8.8-6.6 2.3-.3-9.2-8-16.5-17.2-16.5-1.7 0-3.4.3-5 .7-1.7.4-2.8 1-3.4 1.4-3.3 1.7-6 4.6-7.5 8-2-.8-4-1.4-6-1.4s-3.7.4-5.3 1c-1.7.8-2.7 1.7-3.2 2-2.8 2.5-4.6 6-4.6 10 0 7.2 5.7 13 12.8 13h45.8C85.3 67.5 90 62.8 90 57c0-5.5-4.5-10-10.3-10z" fill="#fff"/>
</svg>
<pre class=" language-html" style="flex-grow: 2; flex-basis: 300px; flex-shrink: 0; margin: 0 0 20px 0;">
<code class=" language-html">&lt;svg class="your-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  &lt;path .../>
  &lt;path class="sun-rays" d="M38.7 23.7c1.2 0 2-1 2-2v-7.3c0-1.2-.8-2-2-2s-2 .8-2 2v7.2c0 1.2.8 2 2 2zM22.2 40.2c0-1.2-1-2-2-2h-7.3c-1.3 0-2.2.8-2.2 2s1 2 2 2h7.3c1.3 0 2.2-.8 2.2-2zM53.3 28.5l5-5c1-1 1-2.3 0-3-.7-1-2-1-3 0l-5 5c-.8.8-.8 2.2 0 3 1 1 2.2 1 3 0zM24 28.5c.8.8 2.2.8 3 0 .8-.8.8-2.2 0-3l-5-5c-1-1-2.3-1-3 0-1 .7-1 2 0 3l5 5z"/>
  &lt;path .../>
  &lt;path .../>
&lt;/svg></code>
</pre>
<pre class=" language-css" style="flex-grow: 2; flex-basis: 300px; flex-shrink: 0;">
<code class=" language-css">.your-svg .sun-rays{
    fill: #ff7e00;
}
.your-svg:hover .sun-rays{
    fill: #FFC300;
}</code>
</pre>
</div>

However, keep in mind that properties that have been set on the SVG or path, like a `fill` or a `style` attribute need to be overrules by the css just like any other property. So you might want to remove those properties before you use the SVG. If not, a stronger selector will win and overwrite previously defined styles, just like with any other property.

Depending on what you want to change you need to be carful with optimization tools, as many, like in my example, can combine multiple elements to one, so that at with my resulting SVG I cannot change an individual sun ray because they are one element with one ID.
