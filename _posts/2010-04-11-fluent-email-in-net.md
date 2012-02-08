---
title: Fluent Email in .NET
date: 2010-04-11T18:33:01.0000000+10:00
layout: post
categories:
- Code
tags:
- .net
- email
- open-source
---

I have been working with <a href="http://lukencode.com/2010/04/08/synchronous-asynchronous-email-sender/">sending emails with System.Net.Mail</a> and had a few people mention they would like fluent interface. It sounded like a pretty cool idea and I also needed an excuse to learn git/github thus was born <a href="http://github.com/lukencode/FluentEmail" target="_blank">FluentEmail for .NET</a>.

Here is a quick example of intended usage, the Smtp details if not provided using the .UsingClient(SmptClient client) method will be taken from the mailSettings config section.
<pre class="prettyprint">
var email = Email
            .From("john@email.com")
            .To("bob@email.com", "bob")
            .Subject("hows it going bob")
            .Body("yo dawg, sup?");

//send normally
email.Send();

//send asynchronously
email.SendAsync(MailDeliveredCallback);
</pre>

The fluent interface is acheived by using a builder pattern. The .From method is static and returns the underlying email object for the other methods to build upon.
<pre class="prettyprint">
public class Email : IHideObjectMembers
{
    private SmtpClient _client;
    public MailMessage Message { get; set; }

    private Email()
    {
        Message = new MailMessage() { IsBodyHtml = true };
        _client = new SmtpClient();
    }

    public static Email From(string emailAddress, string name = "")
    {
        var email = new Email();
        email.Message.From = new MailAddress(emailAddress, name);
        return email;
    }

    public Email To(string emailAddress, string name = "")
    {
        Message.To.Add(new MailAddress(emailAddress, name));
        return this;
    }

    //other methods left out for readability
}</pre>
Its early days at the moment but it does support multiple recipients, BCC and CC. Some of the things I would like to eventually include is support for bulk email sending (sending in batches) and easy support for different Smpt clients such as gmail.

You can grab/fork the code at <a title="http://github.com/lukencode/FluentEmail" href="http://github.com/lukencode/FluentEmail">http://github.com/lukencode/FluentEmail</a>. Let me know if you have any comments or suggestions.