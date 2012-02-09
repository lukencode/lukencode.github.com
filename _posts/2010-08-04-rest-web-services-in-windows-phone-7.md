---
title: Rest Web Services In Windows Phone 7
date: 2010-08-04
layout: post
categories:
- Mobile
- Web Services
tags:
- RestSharp
- wp7dev
---

<p>I’ve been messing around with some Window Phone 7 development lately and thought I would share how I have been calling web services with RestSharp (I’ve written a little about RestSharp previously using the <a href="http://lukencode.com/2010/04/14/google-weather-api-with-restsharp/" target="_blank">google weather api</a>). </p>  <p><a href="http://restsharp.org" target="_blank"><img style="border-bottom: 0px; border-left: 0px; display: inline; margin-left: 0px; border-top: 0px; margin-right: 0px; border-right: 0px" title="restsharp" border="0" alt="restsharp" align="right" src="http://lukencode.com/wp-content/uploads/2010/08/restsharp.png" width="240" height="57" /></a> For those who don’t know <a href="http://restsharp.org" target="_blank">RestSharp</a> is a REST client for .NET which has recently added silverlight and Windows Phone 7 support. RestSharp has some really great features to simplify calling web services including:</p>  <ul>   <li>Automatic XML and JSON deserialization </li>    <li>Fuzzy name matching ('product_id' in XML/JSON will match property named 'ProductId') </li>    <li>Automatic detection of type of content returned </li>    <li>GET, POST, PUT, HEAD, OPTIONS, DELETE supported </li> </ul>  <p>Windows Phone 7 basically enforces (with good reason) async web requests – luckily RestSharp has our back on that front. I’m going to use some example code from the Google Reader app I’ve been playing around with – <a href="http://lukencode.com/2010/07/29/windows-phone-7-google-reader-app-gread-work-in-progress/" target="_blank">GREAD</a>. Here is a simple example of asynchronously calling a web service using RestSharp to authenticate with with google accounts:</p>  <pre class="prettyprint">var client = new RestClient(&quot;https://www.google.com&quot;);

var request = new RestRequest(&quot;accounts/ClientLogin&quot;, Method.POST);
request.AddParameter(&quot;service&quot;, &quot;reader&quot;, ParameterType.GetOrPost);
request.AddParameter(&quot;accountType&quot;, &quot;GOOGLE&quot;, ParameterType.GetOrPost);
request.AddParameter(&quot;source&quot;, _source, ParameterType.GetOrPost);
request.AddParameter(&quot;Email&quot;, _username, ParameterType.GetOrPost);
request.AddParameter(&quot;Passwd&quot;, _password, ParameterType.GetOrPost);

client.ExecuteAsync(request, (response) =&gt;
{
    var auth = ParseAuthToken(response.Content);
});</pre>

<p>RestSharp will automatically build the request with the parameters it is given. These can be get/post, cookies or http headers. The ExecuteAsync method takes the request to make and an action to execute when finished.</p>

<p>I come from a web development background living the good life making synchronous requests. Developing in Silverlight requires a bit of an adjustment with a big focus on event driven asynchronous programming. The pattern I am using I’ve tried to avoid all the plumbing involved in hooking up and firing off event handlers. Here is the basic pattern I use for api calls, in this instance I am grabbing all the feed items for the given label:</p>

<pre class="prettyprint">public void GetLabelFeed(string label, Action&lt;Model.Feed&gt; success, Action&lt;string&gt; failure)
{
    string resource = &quot;reader/api/0/stream/contents/user/-/label/&quot; + label;

    var request = GetBaseRequest();
    request.Resource = resource;
    request.Method = Method.GET;
    request.AddParameter(&quot;n&quot;, 20); //number to return

    _client.ExecuteAsync&lt;Model.Feed&gt;(request, (response) =&gt;
    {
        if (response.ResponseStatus == ResponseStatus.Error)
        {
            failure(response.ErrorMessage);
        }
        else
        {
            success(response.Data);
        }
    });
}</pre>

<p>I pass two callbacks to the method, one for success and one for failure. In this example I am using RestSharp’s auto deserialzation into the class Model.Feed by calling ExecuteAsync&lt;Model.Feed&gt;(). Depending on the status of the request either failure or success action is called.</p>

<p>To use these methods in my wp7 application I use inline delegates to handle the events. One thing to be aware of is the code on these callbacks will run in the background thread and you wont see anything change on the UI. To fix this make sure the data binding code is executed in the UI thread using the dispatcher. I use a DispatcherHelper class borrowed from the <a href="http://mvvmlight.codeplex.com/" target="_blank">MVVM Light Toolkit</a>. </p>

<pre class="prettyprint">        
protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
{
	api.GetLabelFeed(
    	feedId,
    	(items) =&gt; DispatcherHelper.SafeDispatch(() =&gt;
    	{
        	this.DataContext = items;
        	progressBar.Visibility = System.Windows.Visibility.Collapsed;
    	}),
    	(error) =&gt; DispatcherHelper.SafeDispatch(() =&gt;
    	{
        	MessageBox.Show(error);
        	progressBar.Visibility = System.Windows.Visibility.Collapsed;
    	}));

    	base.OnNavigatedTo(e);
}</pre>

<p>I found this structure has kept my code reasonable clean and has handled all cases in the simple web requests I have made but since I’m new to Silverlight I’m sure it could be better.</p>