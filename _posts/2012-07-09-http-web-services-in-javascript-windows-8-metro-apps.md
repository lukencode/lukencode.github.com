---
title: "Http Web Services in Javascript Windows 8 Metro Apps" 
layout: post
published: false
---
I have been doing some Windows 8 development recently and decided to work with html, css and javascript rather than  c# and xaml. I am mainly a .net guy and was a little worried about working with javascript for a few things including consuming rest web services. I've written a few posts on web services for .net, android and windows phone and as it turns out Windows 8 javascript is easier than all of them.

###A Basic Web Request

The best way to call your web services is using the WinJS.xhr function. This function is basically a wrapper for the lower level XMLHttpRequest object. The function takes an options object with a number of optional properties. A basic xhr get request looks like this:

    WinJS.xhr({
               type: "get",
               url: "www.example.com"
            });
            
You can make a post request by changing the type to "post".
          
###Using Promises
            
WinJS.xhr wraps the request in something called a promise. Promises in WinJS is an abstraction to help out with asynchronous requests. In short a promise is like a schedule or work to be done on a value that has yet to be computed, in the case of web services we are waiting on the response from the server. Using promises you can chain calls to the then and done methods. These methods will fire after the promise has been completed. You can chain multiple then methods together or just use done to wait until the end. 

    WinJS.xhr({
                type: "post",
                url: url,
            }).done(function (result) {
            	console.log(result.responseText)
            });
            
In the previous example the done function has a parameter "result". This is the data returned from the webservice, you can also access a number of other properties such as result.status. You can also provide an error function as the second parameter to the done and then functions.

###Setting Request Parameters

Most web services will require you to provide paramters. These might be query string params for get requests, form values for post or setting specific headers. To set query string or form parameters you can set the data property on the xhr options objects. To get the parameters in the right format I use a little helper function called formatParams. This function takes a javascript object and converts each property into a key/value parameter.

    var params = {
                key: "1234"
            };

	//get request
    WinJS.xhr({
                type: "get",
                url: "www.example.com",
                data: formatParams(params)
            });
            
	//post request
    WinJS.xhr({
                type: "post",
                url: "www.example.com",
                data: formatParams(params),
                headers: { "Content-type": "application/x-www-form-urlencoded" }
            });
            
    function formatParams(params) {
        var queryStr = "";

        for (var propertyName in params) {
            var val = params[propertyName];
            queryStr += propertyName + "=" + encodeURI(val) + "&";
        }

        return queryStr.slice(0, -1);
    }

For the post request I set the content type header to x-www-form-urlencoded. You can set any other headers you need using this same format.

###Consuming JSON

Assuming your web service returns json the biggest advantage javascript has it it handles it natively. There is no need for building a matching class or messing about with dictionaries it just works. All you need to do is call JSON.parse on your response text.

    WinJS.xhr({
                type: "post",
                url: url,
            }).done(function (result) {
            	var json = JSON.parse(result.responseText);
            });
