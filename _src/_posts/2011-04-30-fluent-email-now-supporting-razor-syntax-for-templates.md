---
Title: Fluent Email Now Supporting Razor Syntax For Templates
Layout: post
Categories:
- Code
Tags:
- .net
- email
- nuget
---

<p>A while back I wrote Fluent Email, a little .NET wrapper for sending emails with System.Net.Mail using a fluent interface. After relentless requests (there was at least 2) to publish the library on <a href="http://nuget.org/" target="_blank">NuGet.org</a> I eventually caved in. You can add Fluent Email to your project using Nuget’s built in library package manager or the following package console command.</p>  <p><a href="http://nuget.org/List/Packages/fluent-email" target="_blank"><img style="background-image: none; border-bottom: 0px; border-left: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top: 0px; border-right: 0px; padding-top: 0px" title="nuget-fluent-email" border="0" alt="PM&gt; Install-Package fluent-email" src="http://lukencode.com/wp-content/uploads/2011/04/nuget-fluent-email.png" width="589" height="70" /></a></p>  <p>The library is pretty simple buts makes the code for sending emails easy to use and read.</p>  <pre class="brush: csharp;">var email = Email
            .From(&quot;john@email.com&quot;)
            .To(&quot;bob@email.com&quot;, &quot;bob&quot;)
            .Subject(&quot;hows it going bob&quot;)
            .Body(&quot;yo dawg, sup?&quot;);

//send normally
email.Send();

//send asynchronously
email.SendAsync((sender, e) =&gt;
{
    Console.WriteLine(&quot;Email Sent&quot;);
});</pre>

<p>There are a few other methods not shown here that work in a similar way for adding the usual email suspects such as CC, BCC&#160; and ReplyTo.</p>

<p>I had also been playing around with some form of templating when I came across <a href="http://razorengine.codeplex.com/" target="_blank">RazorEngine</a>. RazorEngine is an awesome library that brings the razor syntax (from MVC3) to other applications. In Fluent Email we use RazorEngine to make email templates as simple as this:</p>

<pre class="brush: csharp;">var template = &quot;Dear @Model.Name, You are totally @Model.Compliment.&quot;;

var email = Email
            .From(&quot;bob@hotmail.com&quot;)
            .To(&quot;somedude@gmail.com&quot;)
            .Subject(&quot;woo nuget&quot;)
            .UsingTemplate(template, new { Name = &quot;Luke&quot;, Compliment = &quot;Awesome&quot; });</pre>

<p>This will set the body of the email to the rendered template “Dear Luke, You are totally Awesome.&quot; and can be sent the same way as the first example. The UsingTemplate method uses generics so you can pass in a specific type or just use an anonymous object like in the example. If you prefer to use a seperate file for your template there is a method called UsingTemplateFromFile to handle that. Since RazorEngine supports everything you would expect from the Razor view engine so does Fluent Email!</p>

<p>If you want to take a look at the code it is hosted on Github at <a href="https://github.com/lukencode/FluentEmail" target="_blank">lukencode/fluentemail</a> otherwise just grab the NuGet package.</p>