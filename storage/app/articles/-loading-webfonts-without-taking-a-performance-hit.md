# Loading webfonts without taking a Performance hit

TL;DR only when the page is completely loaded, you start downloading your fonts. On the next page load, you can use the cached fonts without a performance hit.

## the issue with using webfonts

Webfonts are and important addition to create the character and brand of your website, but they due come with a downside: performance decrease and FOUC.

### Performance problems when using web fonts.

As you probably know the fewer resources you download, the better. Firstly every download has the overhead of establishing an HTTP connection (reference) and on mobile you even need to establish a connection with a tower which in itself might take up to .5s (reference). Additionally the fonts have to be parsed and display which leads the the content taking a long time to appear or the more common FOUC.

### FOUC when using web fonts

FOUC stands for flash of unstyled content, which describes the situation when content is loaded and styles, that are downloading slowly are only applied afterwards. This can be very annoying for your users, especially when they already started reading and loose their position because the newly applied font has a different width.

## Solving the ux issues of webfonts

To avoid the above mentioned problems with webfonts we need to only display custom webfonts if they are already available when our page is loaded. This of course means we have to find a decent font for when the case where our fonts are not installed or stored in the users cache, but we would have to do this in any case, to minimize the visual effect of the FOUC.

Our plan of attack is to first check ID the fonts are available and if not, default to downloading them once all content is downloaded and displayed with our backup font. 

### detecting font availability

Sadly, the only way to detect if a font is loaded is to do a little JavaScript magic. Basically we will set the font of two elements to a web save font, than set on to our custom font. Now we measure the width of both elements. If they differ the custom font is available. Of course we need to choose the web save font wisely as well as the letters we use, to get the maximum effect.

Example js code here.

If the font is available we add a class to our body, which we will use to change the font.

HTML example

CSS example

### asynchronously downloading web fonts

If the width of both elements is equal, our font has not been loaded. We will trigger the font loading, using the Google font loader, once the page is completely loaded. This ensures that the user will not experience any delay due to the font downloading. Once the font is downloaded it will be in the users cache. The next time a page is loaded the font will be available.

