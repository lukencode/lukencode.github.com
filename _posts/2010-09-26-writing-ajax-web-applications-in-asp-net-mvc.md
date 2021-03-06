---
title: Writing AJAX web applications in Asp.Net MVC
date: 2010-09-26
layout: post
categories:
- Web
tags:
- jqax
- jqote
- jquery
- mvc
---

<p>Asp.Net MVC and jQuery have made it much easier to build awesome Gmail like ajax powered applications. I am going to run through the technique I used to do the ajax web services, call them in javascript and display the html through a template. </p>  <h3>What Do I Need?</h3>  <ol>   <li>An Asp.Net MVC web application </li>    <li><a href="http://jquery.com/" target="_blank">jQuery</a> </li>    <li><a href="http://benjii.me/2010/08/jqax-jquery-plugin-the-jquery-plugin-version-of-the-jqax-ajax-wrapper/" target="_blank">jQax</a> – a wrapper around jQuery ajax </li>    <li><a href="http://aefxx.com/jquery-plugins/jqote2/" target="_blank">jQote</a> – a simple lightweight jQuery templating engine </li> </ol>  <h3>What Do I Do?</h3>  <p>Lets start at the web application because you probably already have something there. Pick a nice simple controller action you wish was ajaxy – say displaying some gig (also know as concert) info?</p>  <p>You probably have a view model you hand to your concert details page. Here is a simplified version of what I use:</p>  <pre class="prettyprint">public class GigViewModel
{
	public int GigID { get; set; }
	public string StartDate { get; set; }
	public string Name { get; set; }
}   </pre>

<p>I am using a string to represent the date to make the eventual javascript I have to write simpler.</p>

<pre class="prettyprint">//
// GET: /Gig/Details/5

public ActionResult Details(int id)
{
	var gigSession = new GigSession();
	var gig = gigSession.Single(g =&gt;; g.GigID == id);

	if (Request.IsAjaxRequest())
	{
		return Json(new GigViewModel(gig), JsonRequestBehavior.AllowGet);
	}
	
	return View(&quot;GigDetails&quot;, new GigViewModel(gig));
}</pre>

<p>
  <br />I have here a pretty standard controller action it grabs some data from the database (the session stuff) dumps it into a view model and returns it to a view. What I’ve added is the Request.IsAjaxRequest() statement. This statement checks the headers of the incoming request for “XMLHttpRequest” meaning the request originated in javascript. If we have an ajax request I use the MVC method Json() to return a json representation of my view model instead of a view. The JsonRequestbehavior parameter allows this control to return json on a Get request.</p>

<p>Now that the backend is set up to give us our json we need to write some javascript to request it. I am using jQax to make this a bit simpler but you could go vanilla jQuery if that floats your boat.</p>

<pre class="prettyprint">var ajax = $.jQax();

ajax.Get(&quot;/gig/1&quot;&quot;, null, function (data) {
	alert(&quot;woo a json gig - &quot; + data)
});</pre>

<p>This bit of javascript uses jQax to make a get request to the url “/gig/1” to get the very first gig in my database. That null parameter is used to set query string parameters which I didn’t need in this case. jQax also has a few other pretty cool options that you can check out on <a href="http://benjii.me/2010/08/jqax-jquery-plugin-the-jquery-plugin-version-of-the-jqax-ajax-wrapper/" target="_blank">benjii’s blog</a>, for now we will keep it simple.</p>

<p>So now that we have our json gig what should we do with it? You coooouuuld manually set some html up and inject it into a container or you could do what the cool kids are doing and use a template engine. A template engine basically allows you to set up a sort of javascript view which renders the model (a json object) you pass to it. I am using jQote (what’s with the stupid names?) which under the covers uses <a href="http://ejohn.org/blog/javascript-micro-templating/" target="_blank">John Resig’s micro templating</a> code which in turn invokes black voodoo magic to do it’s bidding (its quite complicated).</p>

<p>Before I show you the template this little bit is important to us asp.net developers. By default jQote will want to use tags like: &lt;%= %&gt;. Asp,Net doesn’t like that so we change jQote’s tag character to be something else, I like #.</p>

<pre class="brush: js;">$.jqotetag&quot;#&quot;);</pre>

<p>It is easiest to do this once on document load before you attempt to do any templates.</p>

<p>jQote templates look pretty similar to MVC views using javascript rather than C#. They also work best when they live in a script tag like so:</p>

<pre class="prettyprint">&lt;script type=&quot;text/x-jqote-template&quot; id=&quot;GigDetailsTemplate&quot;&gt;
	&lt;div class=&quot;gigDetails&quot;&gt;
		&lt;h2&gt;&lt;#= this.Name #&gt;&lt;/h2&gt;
		&lt;span class=&quot;date&quot;&gt;&lt;#= this.StartDate #&gt;&lt;/span&gt;
	&lt;/div&gt;
&lt;/script&gt;</pre>

<p>The “this” in the template refers to the json object you pass it. This example is pretty simple but jQote allows you do easily work with lists, conditions and pretty much any other javascript – <a href="http://aefxx.com/api/jqote2-reference/" target="_blank">the doco page has some pretty good examples</a>.</p>

<p>Now all the pieces are in place it is just a matter of giving the gig json to the GigDetailsTemplate and putting the resulting html somewhere on the page. jQote has a few different methods depending if you want to replace, append, prepend or just get the raw html. This example alters the code used to get the gig json to use the jqotesub method which will replace whatever you had in the target dom element with the rendered template html:</p>

<pre class="brush: js;">var ajax = $.jQax();

ajax.Get(&quot;/gig/1&quot;, null, function (data) {
	$(&quot;#gigWrapper&quot;).jqotesub(&quot;#GigDetailsTemplate&quot;, data);
});</pre>

<p>First we use jQuery to select the container we want the html in. Next we call jqotesub with the selector for the template we created above and the gig json data returned from the ajax call. BAM! The template is filled out with the values of the gig and displayed on the page.</p>

<p><strong>Helpful Tips</strong></p>

<ul>
  <li>I found to keep things organized creating templates as Partial Views in MVC and then rendering them on the pages they are required worked well. </li>

  <li>In your view models try to avoid DateTime – its pretty annoying trying to display javascript dates how you like. </li>
</ul>