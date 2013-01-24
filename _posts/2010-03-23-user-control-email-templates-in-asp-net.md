---
title: User Control Email Templates in asp.net
date: 2010-03-23
layout: post
categories:
- Code
tags:
- .net
- email
---

Just about every project i work on needs to send customized emails and everytime I hate doing it. Inspired by some answers in this <a href="http://stackoverflow.com/questions/122784/hidden-net-base-class-library-classes/122967">stackoverflow question</a> I thought I'd give a simple .ascx based email template system a dig.

First thing I did was set up a base class for template controls to inherit from. This class inherits from UserControl and has the methods to render the control to a string. It also has methods and properties to set up "tags" to replace in the email body.

<pre class="prettyprint">
public class EmailTemplateBase : UserControl
{
    public EmailTemplateBase()
    {
        Tags = new Dictionary&lt;string, string&gt;();
    }

    public Dictionary&lt;string, string&gt; Tags { get; set; }

    protected string GetTagValue(string tagName)
    {
        return Tags[tagName].Value;
    }

    protected string GetTagValue(string tagName, string defaultValue)
    {
        string val = GetTagValue(tagName);
        return string.IsNullOrEmpty(val) ? defaultValue : val;
    }

    public string RenderTemplate()
    {
        StringBuilder sb = new StringBuilder();
        StringWriter sw = new StringWriter(sb);
        Html32TextWriter htw = new Html32TextWriter(sw);
        RenderControl(htw);

        // Get full body text
        return sb.ToString();
    }
}
</pre>

Below is a simple example from the project I am working on it is used for sending feedback emails  This template is really simple but because the rendering uses the same page cycle as a regular control you can style and render the template how ever you like.

<pre class="prettyprint">&lt;p&gt;
   Feedback from System sent &lt;%= GetTagValue("sent")%&gt;
&lt;/p&gt;

&lt;p&gt;
    &lt;strong&gt;Sender: &lt;/strong&gt; &lt;%= GetTagValue("sender")%&gt;&lt;br /&gt;
    &lt;strong&gt;Subject: &lt;/strong&gt; &lt;%= GetTagValue("subject")%&gt;
&lt;/p&gt;

&lt;p&gt;
    &lt;strong&gt;Message: &lt;/strong&gt; &lt;br /&gt;
     &lt;%= GetTagValue("message").Replace(Environment.NewLine, "&lt;br /&gt;")%&gt;
&lt;/p&gt;
</pre>

I created a class to easily load and use the email templates within my code by passing the location of the template on the server.

<pre class="prettyprint">

public class EmailTemplate
{
    private readonly EmailTemplateBase _template;

    public EmailTemplate(string templateLocation)
    {
        Page p = new Page();
        _template = (EmailTemplateBase) p.LoadControl(templateLocation);
    }

    public Dictionary&lt;string, string&gt; Tags
    {
        get { return _template.Tags; }
        set { _template.Tags = value; }
    }

    public string Render()
    {
        return _template.RenderTemplate();
    }
}

</pre>

Below is how I use the templates in my code, sending using a basic <a title="c# email sender" href="http://lukencode.com/2010/04/08/synchronous-asynchronous-email-sender/">email sender</a> class I have (or better still <a title=".net fluent emal" href="http://lukencode.com/2010/04/11/fluent-email-in-net/">fluent email</a>).

<pre class="prettyprint">
var template = new Common.Email.EmailTemplate("~/Emails/Templates/Feedback.ascx");
template.Tags.Add("sender", sender);
template.Tags.Add("sent", sent);
template.Tags.Add("subject", subject);
template.Tags.Add("message", message);

string body = template.Render();

EmailSender.Send(from, fromName, to, toName, subject, body);
</pre>

I could probably try encapsulate a bit more of the email sending inside my template (toName, toAddress etc) to clean this up a bit so feel free to tell me how come I suck.