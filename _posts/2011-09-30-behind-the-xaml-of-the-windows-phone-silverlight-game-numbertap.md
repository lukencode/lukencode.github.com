---
title: "Behind the XAML of the Windows Phone Silverlight Game – Numbertap"
date: 2011-09-30
layout: post
categories:
- Mobile
tags:
- code
- wp7dev
- wpdev
---

<a href="http://numbertap.com/" target="_blank">Numbertap</a> is a Windows Phone game built by me and a few mates (<a href="http://twitter.com/benjii22" target="_blank">@benjii22</a>, <a href="http://twitter.com/d1k_is" target="_blank">@d1k_is</a> and <a href="http://twitter.com/fishkopter" target="_blank">@fishkopter</a>). It is alive and well in the marketplace right now in the games section. When people ask this is what we tell people Numbertap is:
<blockquote>
<em>"NumberTap pits you and your mad math skills against the rest of the world in a fast paced number tapping math frenzy!"</em>
</blockquote>
What that actually means is Numbertap is a maths based game where you answer maths questions online organised into 2 minute rounds. At any one time everyone playing the game is playing the same round, at the end scores are tallied and you are placed in your rightful place as king of the maths world on the online leader board. Its kinda like times tables meets guitar hero scoring meets global leader boards. Here is a shot of the game in action:

<a href="http://lukencode.com/wp-content/uploads/2011/09/GameScreen.png"><img style="background-image: none; padding-left: 0px; padding-right: 0px; display: block; float: none; margin-left: auto; margin-right: auto; padding-top: 0px; border-width: 0px;" title="GameScreen" src="http://lukencode.com/wp-content/uploads/2011/09/GameScreen_thumb.png" alt="GameScreen" width="204" height="337" border="0" /></a>

This post is a collection of the libraries and techniques we found useful in both the windows phone app and the asp.net mvc server side.
<h3>The App</h3>
Like all good Windows Phone apps we focused on a few key ideas – simply and beautiful design, fluid movement and animation and speedy performance. Listed in no particular order is the technology we used to (hopefully) achieve this.

<strong>Silverlight over XNA for a game?!</strong>

If I were to guess I would say the vast majority of windows phone games are XNA based (and with good reason!) but we had a couple of reasons to roll with Silverlight:
<ul>
	<li>We know Silverlight. This one is the most obvious 3/4 developers had built reasonably successful apps using Silverlight while 0/4 of us had built anything at all in XNA.</li>
	<li>We wanted a kick ass metro design. Building apps with expression blend in Silverlight almost feels like cheating in terms of design. All the styles, colours, buttons and fonts are right there ready to go all the [crap at design] developer has to do is follow <a href="http://www.jeff.wilcox.name/2011/03/metro-design-guide-v1/" target="_blank">Jeff Wilcox’s excellent metro design guide</a>to metro UI heaven (just don't let Jeff catch you missing a 12px margin). Since the gameplay we had in mind was pretty simple and Silverlight animations are actually pretty powerful we didn’t give up too much on the XNA front.</li>
	<li>There is no 3.</li>
</ul>
<br />
<strong>Awesome Open Source Control Libraries</strong>

This is one are where windows phone is really starting to shine, nearly any control you would want UI wise that isn’t in the base SDK exists in a well documented and supported open source library. The two we like best are the official <a href="http://silverlight.codeplex.com/" target="_blank">Silverlight Toolkit</a> and the <a href="http://coding4fun.codeplex.com/" target="_blank">Coding4Fun Toolkit</a> both are available on NuGet.

Silverlight toolkit is more or less a must have in every windows phone app. The most useful thing it brings to the table is really nice and super simple to implement page transitions. Here is an example of some XAML form the Numbertap about page to do turnstile transitions in and out:
<pre class="prettyprint">
<toolkit:transitionservice.navigationintransition>
    <toolkit:navigationintransition>
        <toolkit:navigationintransition.backward>
            <toolkit:turnstiletransition mode="BackwardIn" />
        </toolkit:navigationintransition.backward>
        <toolkit:navigationintransition.forward>
            <toolkit:turnstiletransition mode="ForwardIn" />
        </toolkit:navigationintransition.forward>
    </toolkit:navigationintransition>
</toolkit:transitionservice.navigationintransition>
<toolkit:transitionservice.navigationouttransition>
    <toolkit:navigationouttransition>
        <toolkit:navigationouttransition.backward>
            <toolkit:turnstiletransition mode="BackwardOut" />
        </toolkit:navigationouttransition.backward>
        <toolkit:navigationouttransition.forward>
            <toolkit:turnstiletransition mode="ForwardOut" />
        </toolkit:navigationouttransition.forward>
    </toolkit:navigationouttransition>
</toolkit:transitionservice.navigationouttransition>
</pre>
The other Silverlight Toolkit feature I really like is the tilt effect, it really helps bring an application to life when elements react to touch. You can automatically add a “tilt” to all eligible controls (buttons, list items, etc) on a page by just adding this to your PhoneApplicationPage xaml.
<pre class="prettyprint">toolkit:TiltEffect.IsTiltEnabled="True"</pre>
Coding4Fun is the other toolkit we make heavy use of. It has a couple of good controls but the ones we really like are the prompts. The input prompt was clean way to prompt players on registration, as with all the Coding4Fun prompts the code is really simple.
<pre class="prettyprint">var msg = new InputPrompt();
msg.Title = "Create Player";
msg.Message = "Please enter a player name";

msg.Show();</pre>
That code (plus a tiny bit extra to add the buttons) gives this result:

<a href="http://lukencode.com/wp-content/uploads/2011/09/input-prompt.png"><img style="background-image: none; padding-left: 0px; padding-right: 0px; display: block; float: none; margin-left: auto; margin-right: auto; padding-top: 0px; border-width: 0px;" title="input-prompt" src="http://lukencode.com/wp-content/uploads/2011/09/input-prompt_thumb.png" alt="input-prompt" width="206" height="340" border="0" /></a>

These are other prompts we use are the regular message prompt and the toast prompt (that one looks awesome, slides in and out). They use really similar and really simple code to display so I won’t show it again (but if you want to see let me know).
<div style="margin: 20px auto; width: 600px;"><a href="http://lukencode.com/wp-content/uploads/2011/09/message-box-resize.png"><img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border-width: 0px;" title="message-box-resize" src="http://lukencode.com/wp-content/uploads/2011/09/message-box-resize_thumb.png" alt="message-box-resize" width="244" height="129" border="0" /></a><a href="http://lukencode.com/wp-content/uploads/2011/09/toast-resize.png"><img style="background-image: none; margin: 0px 0px 0px 20px; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border-width: 0px;" title="toast-resize" src="http://lukencode.com/wp-content/uploads/2011/09/toast-resize_thumb.png" alt="toast-resize" width="244" height="52" border="0" /></a></div>
<strong>Web Services with RestSharp</strong>

I've already posted about how much I love <a href="http://restsharp.org/" target="_blank">RestSharp</a> for <a href="http://lukencode.com/2010/08/04/rest-web-services-in-windows-phone-7/" target="_blank">communicating with web services in windows phone apps</a> but screw it I will say it again: USE RESTSHARP its fast, simple and reliable.

<strong>Prompt Users to Review with AppEvents</strong>

With mobile apps getting a good review is pretty much gold. As a user I am very unlikely to try any app with a sub 3/5 star rating. We wanted to give Numbertap the best chance we could at a decent rating by asking users (nicely) to rate the app. We didn’t just want to annoy any user either, we wanted to hit them up when we KNOW they are enjoying the game and they are at a point where they can jump out and give us a good score.

To achieved this lofty goal we used a little library @d1k_is open sourced – <a href="https://github.com/dkarzon/AppEvents" target="_blank">AppEvents</a>. The syntax is a little funky so you should probably check out <a href="http://dkdevelopment.net/2011/04/29/appevents-do-stuff-when-things-happen-wp7/" target="_blank">dk’s blog post</a> for a full intro but essentially what we are doing here is running the method AskToRate() when the “games-played” event has been fired 5 or more times and the “rated” event has not occurred.
<pre class="prettyprint">//in app.xaml.cs set up the rule
AppEventsClient.New(Rule.When("rate-app",
                el =&gt; el.Any(e =&gt; e.Name == "games-played" &amp;&amp; e.Occurrrences.Count &gt;= 5) &amp;&amp; !el.Any(e =&gt; e.Name == "rated"))
                .Do(r =&gt; DispatcherHelper.SafeDispatch(() =&gt; AskToRate()))
            );

//when a game has played fire the event
AppEventsClient.Current.Fire("games-played");</pre>
This little piece of code has helped us gain 170+ reviews with an average of about 4.5 / 5 so far (hopefully having a cool game helped).

<strong>The Icon</strong>

When you live in an app store (sorry marketplace… don’t sue me) you basically have two ways to attract any customers that may be passing by. One is to have a good review and the other is a slick icon. Given that no one ever has or (or ever will) describe my artistic skills as “slick” we jumped on the crowd sourcing bandwagon and cruised over to <a href="http://99designs.com/" target="_blank">99designs</a> to get ourselves an icon on the cheap ($140ish). We think it turned out pretty good:

<img style="display: block; float: none; margin-left: auto; margin-right: auto;" src="http://catalog.zune.net/v3.2/en-AU/apps/4594645f-fd41-48bd-b12e-b6b1f9fcea40/primaryImage?width=95&amp;height=95&amp;resize=true" alt="" />
<h3>The Server</h3>
Like the App we wanted the server side of Numbertap to be fast and simple, this is what we used.

<strong>The Framework</strong>

We know ASP.NET MVC so just like the Silverlight decision we rolled with what we knew. Turns out combining RestSharp, mvc and a shared class library for the API models makes REST based API’s really easy. Because both our app and server shares a class library for RestSharp models it means that we can easily update our web service responses and have that data available in the app. We return json over xml because json rules – this is how you do it from an MVC controller, this action returns some info on player rank and the current number of players in game:
<pre class="prettyprint">[HttpPost]
public ActionResult GameStats(LoginRequest loginRequest)
{
    var player = DB.Queries.Player.GetPlayer(loginRequest.ID, loginRequest.PlatformID, loginRequest.GameID, null);

    var response = new GameStatsResponse();

    response.PlayerStats = DB.Queries.Player.GetPlayerStats(loginRequest.GameID, player.PlayerID);
    response.PlayerStats.PlayerRank = DB.Queries.Player.WeeklyRank(player.PlayerID, loginRequest.GameID);

    return Json(response, JsonRequestBehavior.AllowGet);
}</pre>
<strong>The Platform</strong>

Being a multiplayer game Numbertap needed a server side component and where better to look for a server than the cloud? I bet you are thinking I’m going to talk about how awesome azure is right? WRONG! Bottom line is I looked at azure and I looked at the azure pricing table and quickly shut my browser and unplugged my computer before my head exploded. Azure is too hard for a simple developer like me, we wanted easy cloud and found it with <a href="https://appharbor.com/" target="_blank">App Harbour</a>. App Harbour in their own words is “Azure done right”. Deployment is super simple – pushing to a git repo will build your project, run your tests and deploy. We went with the $10 a month shared Sql Server DB and have the option to add instances to scale at any time BALLIN’.

Hopefully from this rambling post you can pick up a tip or two you can use in your own app. If anyone (ha! like anyone reads my blog) would like some more information on something I have posted here hit my up in the comments and I might do a blog post on it or maybe just send you some code.