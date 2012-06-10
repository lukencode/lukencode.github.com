---
title: "Fluent Email now supporting custom template renderers"
date: 2012-06-10
layout: post
---

Fluent Email is a simple wrapper for System.Net.Mail that provides a fluent interface for constructing and sending emails in .Net. It also provides a Razor based template rendering engine. After getting a couple of requests for different renderers I decided to provide an interface in Fluent Email for templating that anyone can implement.

The updated version of fluent email is available as always on [nuget](http://nuget.org/packages/fluent-email) and you can find the source on [github](https://github.com/lukencode).

The interface itself is really basic and has just one method:

    public interface ITemplateRenderer
    {
    	string Parse<T>(string template, T model);
    }
	
The default renderer uses the awesome [RazorEngine](http://nuget.org/packages/RazorEngine) to implement the interface:

    public class RazorRenderer : ITemplateRenderer
    {
    	public string Parse<T>(string template, T model)
    	{
    		return Razor.Parse<T>(template, model);
    	}
    }

If you want to use your own renderer all you need to do is implement the ITemplateRenderer interface and call the UsingTemplateEngine method when constructing an email:

    var email = Email
    			.FromDefault()
    			.To("test@test.test")
    			.Subject("awesome new fluent email features")
    			.UsingTemplateEngine(new CustomTemplateRenderer())
    			.UsingTemplate(template, new { Name = "LUKE" })
    			.Send();
			
Here are a couple of the different engines I have seen people using for fluent email (not yet implementing the new interface but hopefully soon).  If you have your own implementation leave a comment with a link and I will add it too the list.

 - Markdown support - Nguyen Ly has some markdown support sitting in his [fluent email fork on github](https://github.com/lyphtec/FluentEmail)
 - Mustache - [Frank Radocaj](http://twitter.com/frankr) is uses Mustache (using Nustache) for his templates hopefully he can post some code up soon.
 
 