---
layout : layout
title : SiteName
---

<ul id="archive">
    {% for post in site.posts %}
		<li>
			<a href="{{ post.url }}">{{ post.title }}</a>
			<span class="date">{{ post.date | date: "%d %B, %Y" }}</span>
		</li>
    {% endfor %}
</ul>

<script type="text/javascript">
//<![CDATA[
(function() {
    var links = document.getElementsByTagName('a');
    var query = '?';
    for(var i = 0; i < links.length; i++) {
    if(links[i].href.indexOf('#disqus_thread') >= 0) {
        query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
    }
    }
    document.write('<script charset="utf-8" type="text/javascript" src="http://disqus.com/forums/DISQUS_NAME/get_num_replies.js' + query + '"></' + 'script>');
})();
//]]>
</script>