---
title: Simple C# Synchronous / Asynchronous Email Sender
date: 2010-04-08T10:47:51.0000000+10:00
layout: post
categories:
- Code
tags:
- email
---

<strong>UPDATE:</strong> 
I am now using a <a href="http://lukencode.com/2010/04/11/fluent-email-in-net/">Fluent Email Class </a> that implements similar techniques.

I noticed quite a few search queries coming in for my post on <a title="c# email templates" href="http://lukencode.com/2010/03/23/user-control-email-templates-in-asp-net/">User Control Email Templates</a> so I thought I should post the code I am using to actually send the emails in that example. The class uses the SMTP configuration information in the web.config or app.config of the application. An example of the config is after the code.

The code is pretty quick and dirty but if you are only sending one off emails it works fine.
<pre class="prettyprint">    public static class EmailSender
    {
        ///
        /// Sends an Email.
        ///
        public static bool Send(string sender, string senderName, string recipient, string recipientName, string subject, string body)
        {
            var message = new MailMessage()
            {
                From = new MailAddress(sender, senderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(recipient, recipientName));

            try
            {
                var client = new SmtpClient();
                client.Send(message);
            }
            catch (Exception ex)
            {
                //handle exeption
                return false;
            }

            return true;
        }

        ///
        /// Sends an Email asynchronously
        ///
        public static void SendAsync(string sender, string senderName, string recipient, string recipientName, string subject, string body)
        {
            var message = new MailMessage()
                {
                    From = new MailAddress(sender, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
            message.To.Add(new MailAddress(recipient, recipientName));

            var client = new SmtpClient();
            client.SendCompleted += MailDeliveryComplete;
            client.SendAsync(message, message);
        }

        private static void MailDeliveryComplete(object sender, AsyncCompletedEventArgs e)
        {
            if (e.Error != null)
            {
                //handle error
            }
            else if (e.Cancelled)
            {
                //handle cancelled
            }
            else
            {
                //handle sent email
                MailMessage message = (MailMessage)e.UserState;
            }
        }
    }</pre>

Here is an example of the mailSettings config section.

<pre class="prettyprint">
    &lt;system.net&gt;
      &lt;mailSettings&gt;
        &lt;smtp from=&quot;test@test.test&quot;&gt;
          &lt;network host=&quot;smtphost&quot; port=&quot;25&quot; username=&quot;user&quot; password=&quot;password&quot; defaultCredentials=&quot;true&quot; /&gt;
        &lt;/smtp&gt;
      &lt;/mailSettings&gt;
    &lt;/system.net&gt;
</pre>