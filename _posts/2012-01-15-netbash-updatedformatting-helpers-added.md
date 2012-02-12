---
title: "NetBash Updated – Formatting Helpers Added"
date: 2012-01-15T11:51:19.0000000+10:00
layout: post
categories:
- Code
- Web
tags:
- netbash
---

<p>NetBash (drop in command line for asp.net web applications) was first released late last year with little to no response from the community. No big deal – I built it to scratch my own itch so it was at least going to be useful to me. Then, like clockwork I go on holidays for a week and a bit and it is featured on <a href="http://asp.net" target="_blank">Asp.net</a> and tweeted by close to 100 people. I have used the past few days to catch up with the bugs people have found (thanks heaps to those who forked and fixed bugs themselves) and get a new release out on <a href="http://nuget.org/packages/NetBash" target="_blank">NuGet</a>.</p> 

<h3>Bug Fixes</h3> 
<ul> 
	<li>NetBash is now compatible with older versions of JQuery (1.5 at least). This was causing some issues with people using a fresh file – new project mvc app to test it out.  </li>
	<li>Console now auto scrolls to bottom when opened.  </li>
	<li>Now more compatible with older versions of IE. </li>
</ul> 

<h3>Formatting Extensions</h3> 

<p>A couple of classes have been included in the NetBash.Formatting namespace to help make the output of your commands a bit prettier. The most useful is the <strong>TableExtensions</strong> class contributed by <a href="https://twitter.com/#!/d1k_is" target="_blank">Damian Karzon</a>. This class includes a couple of extension methods on IEnumerable&lt;T&gt; that take a list of objects and using reflection output them into a nice consoley table. Here is an example:</p>

<pre class="prettyprint">public string Process(string[] args)
{
    var tempData = new List&lt;GridData&gt;
    {
        new GridData
        {
            RowId = 1,
            SomeName = "NUMBER1",
            Longtext = "12345678901234567890",
            SomeDate = DateTime.Today
        },
        new GridData
        {
            RowId = 2,
            SomeName = "sup bro",
            Longtext = "I AM THE GREATEST",
            SomeDate = DateTime.Now.AddDays(21)
        },
        new GridData
        {
            RowId = 5,
            SomeName = "GridCommand",
            Longtext = "longish",
            SomeDate = DateTime.Now.AddDays(-3)
        }
    };

    return tempData.ToConsoleTable();
}</pre>

<p>Output:</p>

<p><a href="http://lukencode.com/wp-content/uploads/2012/01/gridyo.png"><img title="gridyo" border="0" alt="gridyo" src="http://lukencode.com/wp-content/uploads/2012/01/gridyo_thumb.png" width="624" height="115"></a></p>
<p>Pretty neat I think. It works with most things I’ve thrown at it including anonymous classes but not dynamic.</p>
<p>The other class is called <strong>SparkExtensions</strong>. This class is a C# port of this <a href="https://github.com/holman/spark" target="_blank">cool little shell script</a>. The Spark() methods are extension methods on various IEnumerable collections (int, decimal, string, etc) they take the list and turn it into a cool little spark line graph similar to this: ▁▂▃▅▂▇. Here is a basic example:</p>

<pre class="prettyprint">
public string Process(string[] args)
{
    var list = new List&lt;int&gt;() { 5, 7, 3, 8, 9, 2, 12, 7, 6 };

    return list.Spark();
}
</pre>

<p>Hopefully these additions make building commands a little more painless. If you are using NetBash or better still have built some open source commands I'd love to hear from you. NetBash source can be found on <a href="https://github.com/lukencode/NetBash" target="_blank">Github</a> and downloaded using <a href="http://nuget.org/packages/NetBash" target="_blank">NuGet</a>.</p>