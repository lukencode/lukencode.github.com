---
title: Sending email in .NET Core with FluentEmail
date: 2018-07-01
layout: post
---

It has been a long time since I posted about or contributed to [FluentEmail](https://github.com/lukencode/FluentEmail), the open source .net email package I created way back in 2010. During that time (largely thanks to the awesome work by [Ben Cull](https://benjii.me)) fluent email has been updated to support .net core.

![FluentEmail](https://raw.githubusercontent.com/lukencode/FluentEmail/master/assets/fluentemail_logo_64x64.png)

I recently got my hands dirty coding again to improve the .net core support - specifically around dependency injection. Here is a walkthrough for using FluentEmail in an ASP.NET core web application.

### Required Packages

`PM> Install-Package FluentEmail.Core` <br />
The core FluentEmail classes and interfaces

`PM> Install-Package FluentEmail.Razor` <br />
A Razor implementation of `ITemplateRenderer` this uses RazorLight to render Razor templates as the email body.

`PM> Install-Package FluentEmail.Smtp` <br />
An Smtp implementation of `ISender` which uses System.Net.Mail under the hood.

There are a couple of other packages available to use in place of smtp or razor:

 - [FluentEmail.Mailgun](https://github.com/lukencode/FluentEmail/blob/master/src/Senders/FluentEmail.Mailgun)
 - [FluentEmail.SendGrid](https://github.com/lukencode/FluentEmail/blob/master/src/Senders/FluentEmail.Sendgrid)
 <!-- - [FluentEmail.DotLiquid](https://github.com/lukencode/FluentEmail/blob/master/src/Renderers/FluentEmail.DotLiquid) -->

### Dependency Injection
In previous versions of FluentEmail emails were composed using a static helper method. This is not now recommended due to the difficulty in testing and maintainability. The FluentEmail libraries now come with extensions methods for Microsoft Dependency Injection. The code below should be added to the ConfigureServices method in Startup.cs.

```c#
public void ConfigureServices(IServiceCollection services)
{
    services
        .AddFluentEmail("defaultsender@test.test")
        .AddRazorRenderer()
        .AddSmtpSender("localhost", 25);
}
```

The `AddFluentEmail("defaultsender@test.test")` extension method accepts a default sender address and has extension methods to set the IRenderer, in this case the RazorLight renderer using `.AddRazorRenderer()` and the SMTP sender using `.AddSmtpSender("localhost", 25)`. The MailGun and SendGrid packages also have extension method helpers.

These methods will make two interfaces available in your application for sending email `IFluentEmail` for a single email and `IFluentEmailFactory` for multiple emails.

### Sending an email

Below is the most basic example of sending an email. This code will take the IFluentEmail configured above and send using the SmtpSender. The email will be sent from "defaultsender@test.test" as configured on startup (this can be overridden with the `email.SetFrom()` method)

```c#
public async Task<IActionResult> SendEmail([FromServices]IFluentEmail email)
{
    await email
        .To("test@test.test")
        .Subject("test email subject")
        .Body("This is the email body")
        .SendAsync();

    return View();
}
```

There are a bunch of other useful methods on IFluentEmail to do things like add CC or BCC recipients, add attachments, set priority or set the reply to address. 

### Render email using a Razor template

Sending basic plain text emails is fine - but most of the time you are going to want to mix in some rich data. FluentEmail allows you to set the body of the email as a template rather than a plain string by using `.UsingTemplate<T>(string template, T model)` instead of `.Body()`. This will be taken combined with an object as a model and be passed to the IRenderer that has been set - in our case FluentEmail.Razor to process. Here is a simple example:

```c#
public async Task<IActionResult> SendEmail([FromServices]IFluentEmail email)
{
    var model = new
    {
        Name = "test name"
    };

    var template = "hi @Model.Name this is a razor template @(5 + 5)!";

    await email
        .To("test@test.test")
        .Subject("test email subject")
        .UsingTemplate(template, model)
        .SendAsync();

    return View();
}
```

The body of this email will render as "Hi test name this is a razor template 10!". The Razor renderer will allow you to write just about any valid Razor code. The model passed to the renderer can be any object type - I often find it convenient to use an anonymous object as in the example above.

FluentEmail has a couple of helper methods to make using templates a bit cleaner. I personally like the embedded resource option because it makes it easy to share templates across projects. 

Render template from file: 

```c#
.UsingTemplateFromFile($"{Directory.GetCurrentDirectory()}/Mytemplate.cshtml", model)
```

Render template from embedded resource: 
```c#
.UsingTemplateFromEmbedded("Example.Project.Namespace.template-name.cshtml", 
	model, 
	TypeFromYourEmbeddedAssembly.GetType().GetTypeInfo().Assembly)
```

**Note for .NET Core 2 users:** You will need to add the following line to the project containing any embedded razor views. 

`<MvcRazorExcludeRefAssembliesFromPublish>false</MvcRazorExcludeRefAssembliesFromPublish>`

### Send multiple emails in the same scope

If you need to send multiple emails from the same class or action you will want to use IFluentEmailFactory rather than reusing an instance of IEmail. IFluentEmailFactory has a single Create() method which will give you a new instance of IFluentEmail to use.

```c#
public async Task<IActionResult> SendMultiple([FromServices] IFluentEmailFactory emailFactory)
{
    await emailFactory.Create()
        .To("test1@test.test")
        .Subject("test email subject")
        .UsingTemplate("hi @Model.Name this is the first email @(5 + 5)!", new { Name = "test name" })
        .SendAsync();

    await emailFactory.Create()
        .To("test1@test.test")
        .Subject("test email subject")
        .UsingTemplate("hi @Model.Name this is the second email @(5 + 5)!", new { Name = "test name 2" })
        .SendAsync();

    return View();
}
```

### Extending

As I have mentioned a couple of times FluentEmail can be easily extended by implementing ISender or ITemplateRenderer. ISender dictates how the email will actually sent. ITemplate renderer accepts a template string and a model and returns the rendered result.

For more information check out the **[FluentEmail Github repository](https://github.com/lukencode/FluentEmail)**.