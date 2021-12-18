Project 1 - Compositing Images
----
----

<b>Description:</b> The objective of this project is implement an alpha copositing function for raster images using JavasScript.
<br><br>
<b>Assignment:</b> The website give us the following files to help us with this project:<br><a href="https://graphics.cs.utah.edu/courses/cs4600/fall2020/?prj=1">(website link)</a>
<ul>
    <li><b>project1.html:</b> This file contains the entire implementation of the interface, except for the composite function.</li>
    <li><b>project1.js:</b> This file contains the placeholder for the composite function. It is included by the project1.html.</li>
</ul>

The missing part of this application (the part that we will implement) is the JavaScript function that composites a foreground image into a background image using alpha blending. Here how that function looks like:

``` javascript
function composite( bgImg, fgImg, fgOpac, fgPos )
```
This function takes 4 input parameters:
<ul>
    <li><b>bgImg:</b> is the given background image to be modified.</li>
    <li><b>fgImg:</b> is the foreground image that is to be composited onto the background image.</li>
    <li><b>fgOpac:</b> is the opacity of the foreground image. The alpha values of the foreground image should be scaled using this argument.</li>
    <li><b>fgPos:</b> is the position of the foreground image on the background image. it holds x and y coordinates in pixels, such that x=0 and y=0 means the top-left pixels of the foreground and background images are aligned. Note that the given x and y coordinates can be negative.</li>
</ul>
This function does not return anything. It just modifies the given background image. The foreground image may have a different size and its position can be negative. The parts of the foreground image that fall outside of the background image should be ignored.
<br><br>
Complete the composite function in the project1.js file, such that it composites the given foreground image onto the given background image with the given opacity and position arguments for the foreground image.
<br>
<b>Useful tip:</b> Pressing the F4 key reloads the project1.js file without reloading the page, so you can quickly test your implementation.
<br><br>

Solution Documentation
----
(In progress)