---
title: Calling Web Services in Android using HttpClient
date: 2010-04-27T21:02:21.0000000+10:00
layout: post
categories:
- Mobile
tags:
- java
- web services
---

I’ve decided recently to branch out from mainly web development into the mobile app space – starting with Google’s Android (because I own a Android phone). One of the first things I wanted to do was start calling webservices, specifically Google Analytics.

Now I am pretty new to Android and Java in general but I feel I’ve come up with a nice simple way to make requests to web services and APIs (and plain html pages if you want). The class uses the org.apache.http library which is included in Android.

This is the code for the class.

<pre class="prettyprint">
public class RestClient {

    private ArrayList &lt;NameValuePair&gt; params;
    private ArrayList &lt;NameValuePair&gt; headers;

    private String url;

    private int responseCode;
    private String message;

    private String response;

    public String getResponse() {
        return response;
    }

    public String getErrorMessage() {
        return message;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public RestClient(String url)
    {
        this.url = url;
        params = new ArrayList&lt;NameValuePair&gt;();
        headers = new ArrayList&lt;NameValuePair&gt;();
    }

    public void AddParam(String name, String value)
    {
        params.add(new BasicNameValuePair(name, value));
    }

    public void AddHeader(String name, String value)
    {
        headers.add(new BasicNameValuePair(name, value));
    }

    public void Execute(RequestMethod method) throws Exception
    {
        switch(method) {
            case GET:
            {
                //add parameters
                String combinedParams = "";
                if(!params.isEmpty()){
                    combinedParams += "?";
                    for(NameValuePair p : params)
                    {
                        String paramString = p.getName() + "=" + URLEncoder.encode(p.getValue(),”UTF-8″);
                        if(combinedParams.length() &gt; 1)
                        {
                            combinedParams  +=  "&amp;" + paramString;
                        }
                        else
                        {
                            combinedParams += paramString;
                        }
                    }
                }

                HttpGet request = new HttpGet(url + combinedParams);

                //add headers
                for(NameValuePair h : headers)
                {
                    request.addHeader(h.getName(), h.getValue());
                }

                executeRequest(request, url);
                break;
            }
            case POST:
            {
                HttpPost request = new HttpPost(url);

                //add headers
                for(NameValuePair h : headers)
                {
                    request.addHeader(h.getName(), h.getValue());
                }

                if(!params.isEmpty()){
                    request.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
                }

                executeRequest(request, url);
                break;
            }
        }
    }

    private void executeRequest(HttpUriRequest request, String url)
    {
        HttpClient client = new DefaultHttpClient();

        HttpResponse httpResponse;

        try {
            httpResponse = client.execute(request);
            responseCode = httpResponse.getStatusLine().getStatusCode();
            message = httpResponse.getStatusLine().getReasonPhrase();

            HttpEntity entity = httpResponse.getEntity();

            if (entity != null) {

                InputStream instream = entity.getContent();
                response = convertStreamToString(instream);

                // Closing the input stream will trigger connection release
                instream.close();
            }

        } catch (ClientProtocolException e)  {
            client.getConnectionManager().shutdown();
            e.printStackTrace();
        } catch (IOException e) {
            client.getConnectionManager().shutdown();
            e.printStackTrace();
        }
    }

    private static String convertStreamToString(InputStream is) {

        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();

        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }
}</pre>

Here is an example of how I use the class to call the Google Analytics API. I use the AddParam methods to add query string / post values and the AddHeader method to add headers to the request. RequestMethod is a simple enum with GET and POST values.

<pre class="prettyprint">RestClient client = new RestClient(LOGIN_URL);
client.AddParam("accountType", "GOOGLE");
client.AddParam("source", "tboda-widgalytics-0.1");
client.AddParam("Email", _username);
client.AddParam("Passwd", _password);
client.AddParam("service", "analytics");
client.AddHeader("GData-Version", "2");

try {
    client.Execute(RequestMethod.POST);
} catch (Exception e) {
    e.printStackTrace();
}

String response = client.getResponse();</pre>

The class also exposes the Http response code and message which are important when using some Restful APIs. I know could definitely improve/extend on this code and would love to hear from those more experienced in Java and Android than myself.

<div>
<script src="http://pollfu.com/public/js/embed.v1.js" data-id="8"> </script>
</div>