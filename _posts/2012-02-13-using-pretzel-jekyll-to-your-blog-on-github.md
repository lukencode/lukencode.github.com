---
title: "Using Pretzel / Jekyll to host your blog on Github"
date: 2012-02-13
layout: post
---

A couple of weeks ago after shamelessly promoting on of my blog post on a social network I received a troubling report that my pride and joy had contracted some type of virus.

![Virus](/img/posts/virus.png "MY GOD - ITS ALL MY FAULT")

This scary red screen (well a similar one) along with some performance issues and me getting bored with wordpress meant I was on the hunt for a new blog platform.  I was after was something fast and simple where I have control over the html and css generated.

[Jekyll](https://github.com/mojombo/jekyll) is a "blog-aware, static site generator in Ruby". It takes markdown and liquid (a templating language) text files and mashes them into a static html site. The "blog-aware" bit means Jekyll will take posts written in mark down and generate a url structure similar to what is seen on most blogs eg [year]/[month]/[day]/[title]. Static html sites have a couple of obvious advantages and disadvantages - they are easy to host, fast and difficult to hack (take that virus man!) but there is no admin interface for update posts.

This is what liquid templating looks like:

    ---
    layout : layout
    title : SiteName
    ---
    
    <ul id="archive">
        {{% for post in site.posts %}}
    		<li>
    			<a href="{{{{ post.url }}}}">{{{{ post.title }}}}</a>
    			<span class="date">{{{{ post.date | date: "%d %B, %Y" }}}}</span>
    		</li>
        {{% endfor %}}
    </ul>
    
The text inbetween the --- up the top is a [YAML](http://www.yaml.org/) header - any files with a yaml header will be processed as special files. The variables being set are for things like the layout to be used, permalink or page title.

A simple post written in markdown might looks something like this:

    --- 
    layout: post
    title: "My First Post"
    author: "Author"
    comments: true
    ---
    
    ## Hello world...
    
    This is my first post on the site!
 

This Jekyll business was sounding wonderful but being the sheltered windows loving, 9-5 enterprise coding, [unhireable](http://blog.expensify.com/2011/03/25/ceo-friday-why-we-dont-hire-net-programmers/) .NET developer that I am I threw it into the "too hard basket" and went back to whinging about wordpress.
Lucky for me there is a gang of open source programmers (with .net flavour to them) that were setting out to build the windows equivalent of Jekyll code named - [Pretzel](https://github.com/Code52/pretzel). 

Pretzel is a .NET console app built in just one week builds static sites in a similar manner to Jekyll, with the jekyll mode more or less emulating it exactly. There are some other cool features in the pipeline such as a razor engine, js and css minification and less support.

With my mind set on a fancy static blog I had one more problem to solve - hosting. It turns out Github allows you to do some really cool stuff with github pages AND github pages supports Jekyll all for free! Hosting my blog as a github repo + [gh pages](http://pages.github.com/) has another advantage my blog is safely stored on github servers with a full history. Updating the site is as easy as pushing updates or new pages to the repo. 

Here is what I did to get my blog up and running on github.

- Set up a repo named [username].github.com. This will tell github to publish any files on the master branch to http://[username].github.com.
- Add a text file named CNAME to your repo with each url you want mapped to the site on separate lines.
- Profit!

One thing to beware of is 404s. You need to add a plain 404.html page to your repo or 404s will be redirected to a github page (and not the one with the [cool star wars one](https://github.com/404)).

This blog now essentially a git repo you can take a look at the source for my blog at [lukencode/lukencode.github.com](https://github.com/lukencode/lukencode.github.com). Without the cruft of a wordpress theme I have been able to drastically simplify the html and css and cut down the page size. I've also had a chance to experiment with responsive design - go on resize this window and let me know what you think. Next on the todo list is a redesigned home page, pages for my wp7 apps and some fancy javascript to load in my current github repos.
