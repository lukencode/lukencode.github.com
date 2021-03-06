---
title: Google and Yahoo Add to Calendar Html Helpers for Asp.net MVC
date: 2010-08-09
layout: post
categories:
- Web
tags:
- html helper
- mvc
---

I’ve been working on implementing some iCal functionality for the my <a href="http://gigpig.fm" target="_blank">gig guide website – Gigpig</a> so users could easily add concert dates to their calendars. This works fine and dandy if you have some desktop program to handle iCal files. I have however been informed that the cool kids roll with Google Calendar (and some strange people with Yahoo?!). I dug around a bit and found you can easily prompt users to add events to these calendars using a link to the calendar with the event details in the query string.

If you want to play around with these parameters I recommend using google’s tools to <a href="http://www.google.com/googlecalendar/event_publisher_guide.html#public" target="_blank">create a button for google calendar</a> and following the guide on <a href="http://chris.photobooks.com/tests/calendar/Notes.html" target="_blank">this site</a> for yahoo.

I’ve gone ahead and wrapped them up into some Html helpers for Asp.Net MVC. I didn't go overboard with the options here so if you will probably want to tweak the code a bit.
<script src="https://gist.github.com/536521.js"> </script>
Calling the helpers is a little wieldy but gets the job done (yahoo is more of the same).
<pre class="prettyprint">&lt;%= Html.GoogleCalendar("add to google calendar", "a test event!", DateTime.Now, null, "its a test", "testington", "websitename", "www.website.com") %&gt;</pre>
Here are some rendered links I prepared earlier:

<a href="http://www.google.com/calendar/b/0/render?action=TEMPLATE&amp;text=Global+Sound+System&amp;dates=20100903T200000Z/20100903T200000Z&amp;details=Global+Sound+System+at+The+Met&lt;br+/&gt;Featuring:+Global+Sound+System&amp;location=256 Wickham St,+Fortitude+Valley+Qld&amp;trp=false&amp;sprop=Gigpig.fm&amp;sprop=name:http://gigpig.fm/gig/2329/Global-Sound-System&amp;sf=true&amp;output=xml" target="_blank">Google Calendar Event</a>

<a href="http://calendar.yahoo.com/?v=60&amp;view=d&amp;type=10&amp;title=Global%20Sound%20System&amp;st=20100903T200000Z&amp;desc=Global%20Sound%20System%20at%20The%20Met%3Cbr%20/%3EFeaturing:%20Global%20Sound%20System&amp;in_loc=The%20Met&amp;in_st=256%20Wickham%20St&amp;in_csz=Fortitude%20Valley%20Qld" target="_blank">Yahoo Calendar Event</a>