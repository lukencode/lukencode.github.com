---
title: IP to Geo Location in Asp.Net MVC
date: 2010-05-19
layout: post
categories:
- Web
tags:
- location
---

I have been working on a couple of projects recently (like the new and improved version of <a href="http://gigpig.fm" target="_blank">Gigpig</a> which is coming soon!) which could really benefit from some automagic geolocation lookups for visitors. In the case of Gigpig I wanted to filter what gigs users could see based on where they were in the world.

The database I am using is the binary version of the <a href="http://www.maxmind.com/app/geolitecity" target="_blank">Max Mind GeoLite City</a> free location database. The database essentially maps IP address ranges to cities and countries.  The binary format, I am informed is the fastest version however there is a csv file you can download and import into your database of choice.

Max Mind provide some C# code for querying the binary database but it takes a little work to set up where as I never like doing work someone else has done for me. The library I use is the <a href="http://en.googlemaps.subgurim.net/" target="_blank">GoogleMaps.Subgurim.NET</a> which as well as from google map functions provides code to access the GeoLite City database.

The code to call the Subgurim methods is super simple. Here I am returning the location class which is also included in the library – it has properties for longitude, latitude, country, city and a few other things. All that needs to be passed to it is the location of your database and the ip address you want to look up.

<pre class="prettyprint">
public static Location GetLocationFromIP(string ipAddress)
{
    string databasePath = HttpContext.Current.Server.MapPath(&quot;~/app_data/geocitylite.dat&quot;);
    LookupService service = new LookupService(databasePath);
    Location loc = service.getLocation(ipAddress);

    return loc;
}</pre>

One way I like to use this code in Asp.Net MVC is including some properties in a base controller class that my controllers all inherit so I can access the current location on any controller. One thing to be aware of is the lookup will return null for the ip address 127.0.0.1 so you might want to hard code it for testing.

<pre class="prettyprint">public class ControllerBase : Controller
{
    public string CurrentUserIPAddress
    {
        get
        {
            return HttpContext.Request.UserHostAddress;
        }
    }

    public Location CurrentLocation
    {
        get
        {
            if (Request.Cookies[&quot;pref&quot;] == null)
            {
                var loc = LocationHelper.GetLocationFromIP(CurrentUserIPAddress);

                if (loc != null)
                {
                    Response.Cookies[&quot;pref&quot;][&quot;city&quot;] = loc.city;
                    Response.Cookies[&quot;pref&quot;][&quot;country&quot;] = loc.countryCode;
                    Response.Cookies[&quot;pref&quot;][&quot;lat&quot;] = loc.latitude.ToString();
                    Response.Cookies[&quot;pref&quot;][&quot;lng&quot;] = loc.longitude.ToString();
                    Response.Cookies[&quot;pref&quot;].Expires = DateTime.Now.AddDays(1);
                }

                return loc;
            }
            else
            {
                var loc = new Location
                {
                    city = Request.Cookies[&quot;pref&quot;][&quot;city&quot;],
                    countryCode = Request.Cookies[&quot;pref&quot;][&quot;country&quot;],
                    latitude = Convert.ToDouble(Request.Cookies[&quot;pref&quot;][&quot;lat&quot;]),
                    longitude = Convert.ToDouble(Request.Cookies[&quot;pref&quot;][&quot;lng&quot;]),
                };

                return loc;
            }
        }
    }
}</pre>

I also cache the user’s location in a cookie so I can avoid doing a database query for every request. There are a couple of ways you could implement IP address to geo location including some variations of this code – but if you just want something quick and easy this is a good starting point.