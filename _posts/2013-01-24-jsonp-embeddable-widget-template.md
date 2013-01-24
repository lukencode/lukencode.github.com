---
title: "An embeddable JSONP javascript widget template"
date: 2013-01-24
layout: post
published: true
---

Recently I've been hacking together a little [online poll creator - pollfu](http://pollfu.com). For the app I needed to have the option to embed the poll on an external website. One of the best examples of this is the [checkout widget by stripe](https://stripe.com/docs/checkout). The cool thing about the stripe widget is it loads everything it needs through that one script.  

This is the core of what I came up with:

<div>
<script src="https://gist.github.com/4629345.js"> </script>
</div>


This is what it can do:

 
* Check for the existence of jquery (and version) on the page, if it isn't there load it in. Just set the jquery script location and version variables at the top. It uses noconflict and sets jquery to the var jQuery variable. After jquery is ready the main() function is called, from there you can listen for document ready.
* Load in any other script and call back a function when it has loaded using the loadScript(src, onLoad) function.
* Load in a css file and add it to the document head using the loadCss(src) function.
* Has a reference to the script tag itself (var scriptTag). This means you can place the script on the page where you want to inject your html ala stripe checkout.

After you have jquery and your scripts loaded in you can use it grab data from your server using jsonp (there is a super simple example commented out in the source). 


Another cool thing to try is setting widget variables on the script tag using data attirbutes (eg data-id="1"). Once you have a reference to the script tag these are super easy to read in eg:

<pre>
&lt;script src=&quot;http://pollfu.com/public/js/embed.v1.js&quot; data-id=&quot;9&quot;&gt;&lt;/script&gt;
</pre>

This is an example of the end result embedded poll for pollfu:

<div>
<script src="http://pollfu.com/public/js/embed.v1.js" data-id="9">;</script>
</div>
