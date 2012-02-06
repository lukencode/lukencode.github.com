---
Title: Timesaving CSS Tools for ASP.Net Developers
Layout: post
Categories:
- Web
Tags:
- .net
---

Are you a developer?

Are you a lazy developer?

Do you hate doing web design?

If you answered yes to that last question you have come to the right blog post. I am going to show you three simple to use libraries to make working with CSS much less painful giving you time to get back to the good stuff – pointlessly refactoring your code!
<h3>1. Blueprint CSS</h3>
First cab off the rank is the<strong> </strong><a href="http://www.blueprintcss.org/" target="_blank"><strong>Blueprint CSS Framework</strong></a>. Blueprint combines a solid reset file,  good looking default typography and an easy to use grid system.

The purpose of the reset file is fairly straightforward – removing some browser inconsistencies.

The <a href="http://www.blueprintcss.org/tests/parts/elements.html" target="_blank">typography</a> defaults are great as a sane starting point for padding, sizes, line height and all the other stuff designers write novels on but us developers have really no idea about. The values are also set in em so they should scale to the user’s font size appropriately.

Last but not least is Blueprint’s grid system. This I am not totally sold on but at the very least its useful for getting together a quick prototype. Essentially the system uses classes such as ‘container’, ‘span-10’ and ‘last’ to quickly and easily bust out complex layouts.

Here is a basic example with a header, content, footer and sidebars.
<pre class="brush: xml;">&lt;div class="container"&gt;
    &lt;div class="span-24 last"&gt;
        Header
    &lt;/div&gt;
    &lt;div class="span-4"&gt;
        Left sidebar
    &lt;/div&gt;
    &lt;div class="span-16"&gt;
        Main content
    &lt;/div&gt;
    &lt;div class="span-4 last"&gt;
        Right sidebar
    &lt;/div&gt;
&lt;/div&gt;</pre>
<h3>2. Bundler</h3>
When building a public facing website its usually a good idea to combine and minify your CSS(and javascript) files into a single file. This of course is a huge pain in the ass. It is possible to use something like the Yahoo YUI Compressor and an MSBuild task to automate this but then you run into problems for things like debugging your CSS.

Enter <a href="http://github.com/jetheredge/bundler" target="_blank"><strong>Bundler</strong></a>. Bundler essentially reduces combining and minifying of CSS and javascript into on tiny bit of code -
<pre class="brush: csharp;">&lt;%= Bundle.Css()
        .AddCss("~/css/reset.css")
        .AddCss("~/css/site.css")
        .RenderCss("~/css/combined.css") %&gt;</pre>
Bundler combines and minifies reset.css and site.css into one file – combined.css. It also takes care of ensuring old files aren't cached and will not combine your files if the website is running in debug mode. Using bundler you have the freedom to split your CSS up into manageable pieces without sacrificing load times.
<h3>3. LESS CSS (using Bundler)</h3>
Last on the list is <a href="http://lesscss.org/" target="_blank"><strong>LESS CSS</strong></a>.
<blockquote>In its own words - <em>“LESS extends CSS with: variables, mixins, operations and nested rules</em>”.</blockquote>
In my words LESS allows you to write CSS more like you would normally write code allowing you to keep your CSS files DRY (don’t repeat yourself… dammit I just repeated myself). It achieves this by using this variables, mixins which are kind of like functions and a few other nifty features.

For the two readers who have gotten this far <em>and</em> clicked through the link will notice LESS CSS is targeted at ruby and not at .Net. However our good friend from step 2 – Bundler (or <a href="http://www.dotlesscss.com/" target="_blank">dotlesscss</a>) will automatically parse CSS files ending with .less using the LESS CSS language.

Variables behave exactly as you would expect them to and are awesome for making sure you don’t keep repeating yourself with things like colours.
<pre class="brush: css;">@brand_color: #4D926F;

#header {
  color: @brand_color;
}

h2 {
  color: @brand_color;
}</pre>
The other feature I really love is mixins. Mixins behave in a way like functions that take parameters as input and return a set of CSS properties based off those parameters. CSS 3 rounded corners are a good example of this.
<pre class="brush: css;">.rounded_corners (@radius: 5px) {
  -moz-border-radius: @radius;
  -webkit-border-radius: @radius;
  border-radius: @radius;
}

#header {
  .rounded_corners;
}</pre>
LESS has a number of other cool features you can check out on the <a href="http://lesscss.org/docs" target="_blank">documentation</a>.