---
title: Windows Phone 7 Charts
date: 2010-12-09
layout: post
categories:
- Code
- Mobile
tags:
- chart
- graph
- wp7
- wp7dev
---

<p>One of the big features of my <a href="http://lukencode.com/2010/11/28/phonealytics-google-analytics-client-for-windows-phone-7/" target="_blank">Windows Phone 7 Google Analytics Client – Phonealytics</a> is the nice (I think) looking graphs. After briefly considering porting an existing Silverlight solution to wp7 I stumbled upon <a href="http://wpf.amcharts.com/quick" target="_blank">Quick Charts</a> by amCharts. Quick Charts is a lightweight and more importantly free chart control for Windows phone 7. It’s a bit light on options but very easy to get working and looks good. </p>  <p>The xaml for a line chart is pretty straightforward. You can see I am using the phone’s inbuilt styles partially because it looks awesome and partially because I am a terrible designer. The things to note here are setting the CategoryValueMemberPath to the name of the property in your model you want the graph to use as the label and in the LineGraph section setting the ValueMemberPath to the property you want to chart. The title property of the LineGraph renders on a small legend. One tip I have is setting IsEnabled to false when the graph is loading (or just in general) I got an exception tapping the graph before any data has been bound.</p>  
<pre class="prettyprint">
&lt;amcharts_windows_quickcharts:serialchart isenabled=&quot;False&quot; datasource=&quot;{Binding GraphData}&quot; x:name=&quot;chtMain&quot; 
categoryvaluememberpath=&quot;Label&quot; verticalalignment=&quot;Top&quot;&gt;
    
    &lt;amcharts_windows_quickcharts:serialchart.foreground&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneForegroundColor}&quot; /&gt;
    &lt;/amcharts_windows_quickcharts:serialchart.foreground&gt;
    
    &lt;amcharts_windows_quickcharts:serialchart.borderbrush&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneBorderColor}&quot; /&gt;
    &lt;/amcharts_windows_quickcharts:serialchart.borderbrush&gt;
    
    &lt;amcharts_windows_quickcharts:serialchart.axisforeground&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneForegroundColor}&quot; /&gt;
    &lt;/amcharts_windows_quickcharts:serialchart.axisforeground&gt;
    
    &lt;amcharts_windows_quickcharts:serialchart.background&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneBackgroundColor}&quot; /&gt;
    &lt;/amcharts_windows_quickcharts:serialchart.background&gt; 
    
    &lt;amcharts_windows_quickcharts:serialchart.graphs&gt;
        &lt;amcharts_windows_quickcharts:linegraph title=&quot;Visits&quot; valuememberpath=&quot;Value&quot; strokethickness=&quot;5&quot;&gt;
            &lt;amcharts_windows_quickcharts:linegraph.brush&gt;
                &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; /&gt;                                        
            &lt;/amcharts_windows_quickcharts:linegraph.brush&gt;
        &lt;/amcharts_windows_quickcharts:linegraph&gt;
    &lt;/amcharts_windows_quickcharts:serialchart.graphs&gt;    
    
&lt;/amcharts_windows_quickcharts:serialchart&gt;
</pre>

<p>I use an ObservableCollection of the super simple ChartDataPoint class below, with just the top properties I set on the chart xaml above.</p>

<pre class="prettyprint">public class ChartDataPoint
{
    public string Label { get; set; }
    public double Value { get; set; }
}</pre>

<p>Here is a screen of the resulting graph with a dark / blue theme.</p>

<p><img style="margin: ; display: block; float: none" src="http://lukencode.com/wp-content/uploads/2010/11/profile.png" /></p>

<p>Quick charts also allows for some pretty delicious pie charts. Here is one I prepared earlier:</p>

<pre class="prettyprint">
&lt;amcharts_windows_quickcharts:piechart margin=&quot;0&quot; isenabled=&quot;False&quot; titlememberpath=&quot;Label&quot; 
valuememberpath=&quot;Value&quot; datasource=&quot;{Binding PieData}&quot;&gt;
    &lt;amcharts_windows_quickcharts:piechart.brushes&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; /&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; opacity=&quot;0.8&quot; /&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; opacity=&quot;0.6&quot; /&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; opacity=&quot;0.4&quot; /&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; opacity=&quot;0.2&quot; /&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneAccentColor}&quot; opacity=&quot;0.1&quot; /&gt;
    &lt;/amcharts_windows_quickcharts:piechart.brushes&gt;
    &lt;amcharts_windows_quickcharts:piechart.foreground&gt;
        &lt;solidcolorbrush color=&quot;{StaticResource PhoneForegroundColor}&quot; /&gt;
    &lt;/amcharts_windows_quickcharts:piechart.foreground&gt;
&lt;/amcharts_windows_quickcharts:piechart&gt;
</pre>

<p>Again I am using the default phone colours, this time I set a few brushes with different opacities. These will be used depending on the number of slices in your pie. Speaking of pie, here is what it looks like.</p>

<p><img style="margin: ; display: block; float: none" src="http://lukencode.com/wp-content/uploads/2010/11/pie.png" /></p>