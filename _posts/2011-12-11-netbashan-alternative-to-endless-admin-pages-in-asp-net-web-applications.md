---
title: "NetBash – An Alternative to Endless Admin Pages in Asp.Net Web Applications"
date: 2011-12-11T21:14:54.0000000+10:00
layout: post
categories:
- Code
- Web
tags:
- netbash
- open-source
---

<p>One thing that always annoys me when working on a web app is having to write those inevitable pages full of admin functions some of which are just a single button. When hacking up one such page I had a thought - a plug in library providing a command line for your web app might save me a lot of time. <a href="https://github.com/lukencode/NetBash" target="_blank">NetBash</a> is what I came up with.</p> <p><a href="http://lukencode.com/wp-content/uploads/2011/12/netbash.png"><img alt="netbash" src="http://lukencode.com/wp-content/uploads/2011/12/netbash_thumb.png" width="1028" height="561"></a></p> 
<p>As you can see from the screenshot NetBash is basically a miniature command line complete with that sweet lime green on black theme that lives in your web app. It can be expanded, minimised and hidden with keyboard shortcuts (<a href="https://github.com/madrobby/keymaster" target="_blank">keymaster</a> ftw) and remembers recent command history using localStorage. NetBash works in a similar way to the <a href="http://code.google.com/p/mvc-mini-profiler/" target="_blank">MVC Mini Profiler</a> meaning that it can be installed with minimal effort on your part (just a NuGet package) and follows you around your site. This is the setup:</p>

<pre class="prettyprint">protected void Application_Start()
{
    AreaRegistration.RegisterAllAreas();

    RegisterGlobalFilters(GlobalFilters.Filters);
    RegisterRoutes(RouteTable.Routes);

    NetBash.Init();

    //this is optional, allows you to decide who sees netbash
    NetBash.Settings.Authorize = (request) =&gt;
        {
            return request.IsLocal;
        };
}
</pre>

<p>The call to Init inserts a couple of routes for the handler, css and js files. You also need to somewhere in your _Layout.cshtml / MasterPage add the RenderIncludes function to write the css and script tags to the page.</p><pre class="prettyprint">NetBash.RenderIncludes()</pre>
<p>The way it works is by searching your application using reflection for classes implementing IWebCommand with a WebCommand attribute. The WebCommand attribute defines a name for the command which is used to invoke it as well as a description displayed on help. The IWebCommand interface has a method called Process which passes in a string array of arguments in the same manor that a .NET console application’s main method would. When a command is entered on the front end an ajax request is made to the NetBash handler. The handler grabs the first word of the request text and matches it to a WebCommand with the same name then invokes Process and returns the result. Here is a very simple example command that returns the length of the arguments passed in:</p>

<pre class="prettyprint">[WebCommand("length", "Returns number of characters in given arguments")]
public class LengthCommand : IWebCommand
{
    public bool ReturnHtml
    {
        get { return false; }
    }

    public string Process(string[] args)
    {
        return string.Join(" ", args).Length.ToString();
    }
}</pre>

<p>Hopefully defining commands this way makes it both dead easy to implement while allowing flexibility to do something more complex (perhaps parsing the arguments with <a href="http://www.ndesk.org/Options" target="_blank">nDesk.Options</a>).</p>
<p>It is pretty early days for the code so I probably wouldn’t recommend using it in a production situation at the moment. NetBash is available as a <a href="http://nuget.org/packages/NetBash" target="_blank">NuGet package</a> and the source on GitHub at <a href="https://github.com/lukencode/NetBash" target="_blank">lukencode/netbash</a>. I’d love to hear people opinions on the api (nothing is set in stone) as well as the UI which could use some work. I have some ideas for some useful commands (some mad stats with a .net version of <a href="https://github.com/holman/spark" target="_blank">spark</a>) also <a href="http://benjii.me/" target="_blank">Ben Cull</a> promises me he will write an asp.net membership command pack.</p>