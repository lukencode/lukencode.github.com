---
title: "An embeddable JSONP javascript widget template"
date: 2012-02-13
layout: post
published: true
---

Recently I've been hacking together a little [online poll creator - pollfu](http://pollfu.com). For the app I needed to have the option to embed the poll on an external website. One of the best examples of this is the [checkout widget by stripe](https://stripe.com/docs/checkout). The cool thing about the stripe widget is it loads everything it needs through that one script.  

This is the core of what I came up with:

<pre class="pretty-print">
(function () {

    var scriptName = &quot;embed.js&quot;; //name of this script, used to get reference to own tag
    var jQuery; //noconflict reference to jquery
    var jqueryPath = &quot;http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js&quot;; 
    var jqueryVersion = &quot;1.8.3&quot;;
    var scriptTag; //reference to the html script tag

    /******** Get reference to self (scriptTag) *********/
    var allScripts = document.getElementsByTagName(&#39;script&#39;);
    var targetScripts = [];
    for (var i in allScripts) {
        var name = allScripts[i].src
        if(name &amp;&amp; name.indexOf(scriptName) &gt; 0)
            targetScripts.push(allScripts[i]);
    }

    scriptTag = targetScripts[targetScripts.length - 1];

    /******** helper function to load external scripts *********/
    function loadScript(src, onLoad) {
        var script_tag = document.createElement(&#39;script&#39;);
        script_tag.setAttribute(&quot;type&quot;, &quot;text/javascript&quot;);
        script_tag.setAttribute(&quot;src&quot;, src);

        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (this.readyState == &#39;complete&#39; || this.readyState == &#39;loaded&#39;) {
                    onLoad();
                }
            };
        } else {
            script_tag.onload = onLoad;
        }
        (document.getElementsByTagName(&quot;head&quot;)[0] || document.documentElement).appendChild(script_tag);
    }

    /******** helper function to load external css  *********/
    function loadCss(href) {
        var link_tag = document.createElement(&#39;link&#39;);
        link_tag.setAttribute(&quot;type&quot;, &quot;text/css&quot;);
        link_tag.setAttribute(&quot;rel&quot;, &quot;stylesheet&quot;);
        link_tag.setAttribute(&quot;href&quot;, href);
        (document.getElementsByTagName(&quot;head&quot;)[0] || document.documentElement).appendChild(script_tag);
    }

    /******** load jquery into &#39;jQuery&#39; variable then call main ********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== jqueryVersion) {
        loadScript(jqueryPath, initjQuery);
    } else {
        initjQuery();
    }

    function initjQuery() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    /******** starting point for your widget ********/
    function main() {
		//your widget code goes here
	
        jQuery(document).ready(function ($) {
			//or you could wait until the page is ready
			
			//example jsonp call
			//var jsonp_url = &quot;www.example.com/jsonpscript.js?callback=?&quot;;
			//jQuery.getJSON(jsonp_url, function(result) {
			//	alert(&quot;win&quot;);
			//});
			
			//example load css
			//loadCss(&quot;http://example.com/widget.css&quot;);
			
			//example script load
			//loadScript(&quot;http://example.com/anotherscript.js&quot;, function() { /* loaded */ });
        });
		
    }

})();
</pre>

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
<script src="http://pollfu.com/public/js/embed.v1.js" data-id="9"> </script>
</div>
