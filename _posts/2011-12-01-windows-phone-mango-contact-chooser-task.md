---
title: Windows Phone (Mango) Contact Chooser Task
date: 2011-12-01
layout: post
categories:
- Code
- Mobile
tags:
- wp7
---

<p>When creating the amazing, incredible and life changing app for managing money you borrow and lend <a href="http://www.windowsphone.com/en-US/apps/7745a9a4-6926-4767-9e61-837fdd1faba5" target="_blank">Metrowe</a> I was pretty annoyed to discover that in the Mango SDK there are choosers for selecting emails: <em>EmailAddressChooserTask</em><strong> </strong>and phone numbers: <em>PhoneNumberChooserTask </em>but not just plain selecting a contact. The problem with the other choosers is the email address will exclude contacts without an email and similarly the phone number chooser and phone numbers. After much complaining decided to develop my own contact chooser (quite closely based off <a href="http://blog.naviso.fr/wordpress/?p=851" target="_blank">this french one</a>) matching the OS version as closely as possible. This is what it ended up looking like:</p> <p><a href="http://lukencode.com/wp-content/uploads/2011/12/contact-chooser.png"><img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: block; float: none; border-top-width: 0px; border-bottom-width: 0px; margin-left: auto; border-left-width: 0px; margin-right: auto; padding-top: 0px" title="contact-chooser" border="0" alt="contact-chooser" src="http://lukencode.com/wp-content/uploads/2011/12/contact-chooser_thumb.png" width="333" height="553"></a></p> <p>Seamless huh? I’ve managed to get the calling code for this down to something nice a simple which pretty much matches the built in choosers:</p>

<pre class="prettyprint">
private void button1_Click(object sender, RoutedEventArgs e)
{
    var contactChooser = new ContactChooserTask();
    contactChooser.OnSelected += new EventHandler&lt;ContactChooserEventArgs&gt;(contactChooser_OnSelected);
    contactChooser.Show();
}

void contactChooser_OnSelected(object sender, ContactChooserEventArgs e)
{
    MessageBox.Show(e.Contact.DisplayName);
}
</pre>
<p>Under the covers it is a bit of a different story. The display relies on the <a href="http://silverlight.codeplex.com/" target="_blank">Silverlight Toolkit’s</a> LongListSelector (which is awesome) and uses code pretty similar to that described by my good friend Benjii in his post: <a href="http://benjii.me/2011/10/how-to-use-the-long-list-selector-for-windows-phone-mango/" target="_blank">How to Use the Long List Selector for Windows Phone Mango</a>. The code to encapsulate the page is kind of a mish mash of code adapted(/stolen) from the source of the <a href="http://coding4fun.codeplex.com/" target="_blank">Coding4Fun</a> toolkit (also awesome). That said it seems to work well in my app and in my very limited testing.</p>
<p>The code for the library lives on github at <a href="https://github.com/lukencode/ContactChooser" target="_blank"><strong>lukencode/ContactChooser</strong></a> and is free and open source fork it, try it out, tell me how I suck then submit a pull request fixing the aforementioned suck! A couple of things that would be cool to see added would be some nice transition animations in and out and some more control over how the chooser looks.</p>