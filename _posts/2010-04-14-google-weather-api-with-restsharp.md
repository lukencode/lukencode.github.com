---
title: Google Weather API with RestSharp
date: 2010-04-14
layout: post
categories:
- Web Services
tags:
- API
- RestSharp
---

Guest post by <a href="http://github.com/dkarzon">DK</a>!

The <a href="http://www.googleapihelp.com/2009/08/google-weather-api.html">Google Weather API</a> is a grand service for developers to get weather data for any location with ease.

<a href="http://restsharp.org/">RestSharp</a> is a open source .NET REST Client…

Been doing some work getting weather information from Google Weather and I thought I might take the time to explain how I used Restsharp with this API. I started with the xml from the API itself.

<a title="http://www.google.com/ig/api?weather=Brisbane+au" href="http://www.google.com/ig/api?weather=Brisbane+au">http://www.google.com/ig/api?weather=Brisbane+au</a>
<blockquote>
<pre class="prettyprint">&lt;xml_api_reply version="1"&gt;
    &lt;weather&gt;
        &lt;forecast_information&gt;
            &lt;city data="Brisbane, QLD"/&gt;
            &lt;postal_code data="Brisbane au"/&gt;
            &lt;latitude_e6 data=""/&gt;
            &lt;longitude_e6 data=""/&gt;
            &lt;forecast_date data="2010-04-14"/&gt;
            &lt;current_date_time data="2010-04-14 14:00:00 +0000"/&gt;
            &lt;unit_system data="US"/&gt;
        &lt;/forecast_information&gt;
        &lt;current_conditions&gt;
            &lt;condition data="Partly Cloudy"/&gt;
            &lt;temp_f data="72"/&gt;
            &lt;temp_c data="22"/&gt;
            &lt;humidity data="Humidity: 64%"/&gt;
            &lt;icon data="/ig/images/weather/partly_cloudy.gif"/&gt;
            &lt;wind_condition data="Wind: SW at 14 mph"/&gt;
        &lt;/current_conditions&gt;
        &lt;forecast_conditions&gt;
            &lt;day_of_week data="Wed"/&gt;
            &lt;low data="64"/&gt;
            &lt;high data="78"/&gt;
            &lt;icon data="/ig/images/weather/chance_of_rain.gif"/&gt;
            &lt;condition data="Chance of Rain"/&gt;
        &lt;/forecast_conditions&gt;
	  ...
    &lt;/weather&gt;
&lt;/xml_api_reply&gt;</pre>
</blockquote>
Notice the weather element contains multiple forecast_conditions elements without a single container element as well as the other forecast_information and current_conditions elements. At first this was a problem, I spoke to John Sheehan (the creator of RestSharp) about this and he told me it was currently unsupported with RestSharp. So I took a dive into the RestSharp source (mainly the XmlDeserialiser) to try and find a solution to this problem and I came across the support for Derived Lists, therein lies a solution…
<pre class="prettyprint">public class xml_api_reply
{
    public string version { get; set; }
    public Weather weather { get; set; }
}
public class Weather : List&lt;Forecast_Conditions&gt;
{
    public Forecast_Information Forecast_Information { get; set; }
    public Current_Conditions Current_Conditions { get; set; }
}
public class DataElement
{
    public string Data { get; set; }
}
public class Forecast_Information
{
    public DataElement City { get; set; }
    public DataElement Postal_Code { get; set; }
    public DataElement Forecast_Date { get; set; }
    public DataElement Unit_System { get; set; }
}
public class Current_Conditions
{
    public DataElement Condition { get; set; }
    public DataElement Temp_c { get; set; }
    public DataElement Humidity { get; set; }
    public DataElement Icon { get; set; }
    public DataElement Wind_condition { get; set; }
}
public class Forecast_Conditions
{
    public DataElement Day_Of_Week { get; set; }
    public DataElement Condition { get; set; }
    public DataElement Low { get; set; }
    public DataElement High { get; set; }
    public DataElement Icon { get; set; }
}</pre>
These classes are then used by RestSharp to Deserialise the response. xml_api_reply is the root element and under it is weather. The weather class inherits from a List&lt;forecast_conditions&gt; because it can contain multiple elements as well as other properties. The DataElement class was created because of the way the xml has its data ie. &lt;city data="Brisbane, QLD"/&gt;  instead of &lt;city&gt;Brisbane, QLD&lt;/city&gt;.

Now that we have setup the Response classes we can use get to the real code…
<pre class="prettyprint">var client = new RestClient("http://www.google.com/ig/api");
var request = new RestRequest(Method.GET);
request.AddParameter("weather", "Brisbane");

var response = client.Execute&lt;Models.xml_api_reply&gt;(request);</pre>
Pretty easy, and the response is a RestResponse&lt;T&gt; where T is my xml_api_reply class, this object then gives us access to anything we could need from the response including the content itself (response.Content) and the deserialised class (response.Data).

And to find the current temperature:
<pre class="prettyprint">response.Data.weather.Current_Conditions.Temp_c.Data</pre>
Now you know how to use RestSharp the world of Restful services is yours for the taking!

Update: Updated the reponse class to Pascal Case.