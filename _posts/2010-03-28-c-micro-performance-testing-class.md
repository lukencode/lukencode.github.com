---
title: C# Micro Performance Testing Class
date: 2010-03-28
layout: post
categories:
- Code
tags:
- .net
- performance
---

I often find myself wondering which version of a method would run more efficiently so for my own amusement I built this little class so I could easily test various method's performance. I understand this is no substitute for real profiling but it is handy to do some quick comparisons.
<pre class="prettyprint">public class PerformanceTester
{
    public TimeSpan TotalTime { get; private set; }
    public TimeSpan AverageTime { get; private set; }
    public TimeSpan MinTime { get; private set; }
    public TimeSpan MaxTime { get; private set; }
    public Action Action { get; set; }

    public PerformanceTester(Action action)
    {
        Action = action;
        MaxTime = TimeSpan.MinValue;
        MinTime = TimeSpan.MaxValue;
    }

    /// &lt;summary&gt;
    /// Micro performance testing
    /// &lt;/summary&gt;
    public void MeasureExecTime()
    {
        var sw = Stopwatch.StartNew();
        Action();
        sw.Stop();
        AverageTime = sw.Elapsed;
        TotalTime = sw.Elapsed;
    }

    /// &lt;summary&gt;
    /// Micro performance testing
    /// &lt;/summary&gt;
    /// &lt;param name="iterations"&gt;the number of times to perform action&lt;/param&gt;
    /// &lt;returns&gt;&lt;/returns&gt;
    public void MeasureExecTime(int iterations)
    {
        Action(); // warm up
        var sw = Stopwatch.StartNew();
        for (int i = 0; i &lt; iterations; i++)
        {
            Action();
        }
        sw.Stop();
        AverageTime = new TimeSpan(sw.Elapsed.Ticks/iterations);
        TotalTime = sw.Elapsed;
    }

    /// &lt;summary&gt;
    /// Micro performance testing, also measures
    /// max and min execution times
    /// &lt;/summary&gt;
    /// &lt;param name="iterations"&gt;the number of times to perform action&lt;/param&gt;
    public void MeasureExecTimeWithMetrics(int iterations)
    {
        TimeSpan total = new TimeSpan(0);

        Action(); // warm up
        for (int i = 0; i &lt; iterations; i++)
        {
            var sw = Stopwatch.StartNew();

            Action();

            sw.Stop();
            TimeSpan thisIteration = sw.Elapsed;
            total += thisIteration;

            if (thisIteration &gt; MaxTime) MaxTime = thisIteration;
            if (thisIteration &lt; MinTime) MinTime = thisIteration;
        }

        TotalTime = total;
        AverageTime = new TimeSpan(total.Ticks/iterations);
    }
}</pre>
Here is how you can use it.
<pre class="prettyprint">//usage
var tester = new PerformanceTester(() =&gt; SomeMethod());
tester.MeasureExecTimeWithMetrics(1000);
Console.Writeline(string.Format("Executed in {0} milliseconds", tester.AverageTime.TotalMilliseconds));</pre>