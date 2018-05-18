---
title: Caching in ASP.NET Core with LazyCache
date: 2018-04-18
layout: post
---

Caching is a great way to get improve the performance of your application - either enabling high load scenarios or papering over some bad code to make life bearable. I have always favoured a simple "GetOrCreate" style caching API so when I found the open source [LazyCache](https://github.com/alastairtree/LazyCache) by [Alistair Crabtree](https://alastaircrabtree.com/) I was keen to check it out.

LazyCache describes itself as "An easy to use thread safe generics based in memory caching service with a simple developer friendly API for C#" which I would pretty much have to agree with. 

The ASP.NET Core version is currently in beta (though seems to be pretty solid) and can be installed via nuget:

    Install-Package LazyCache.AspNetCore -Version 2.0.0-beta03

Once installed it can be easily made available when configuring services in startup:
    
    services.AddLazyCache();

This will inject IAppCache throughout your application.
            
Here is a simplified example of using LazyCache from the homepage my [Australian tech job board - Austechjobs](https://austechjobs.com.au):

<script src="https://gist.github.com/lukencode/f974c562b2e48c9cbad63aa768ddb4a7.js"></script>
<noscript>
    <pre>
public class HomePageService
{
    public static string HomeModelCacheKey = "HomeModel";
    private static TimeSpan cacheExpiry = new TimeSpan(12, 0, 0); //12 hours

    private readonly PositionsGroupedByTagQuery positionsGroupedByTagQuery;
    private readonly IAppCache cache;

    private SiteSettings SiteSettings => siteSettingsOptions.Value;

    public HomePageService(PositionsGroupedByTagQuery positionsGroupedByTagQuery, IAppCache cache)
    {
        this.positionsGroupedByTagQuery = positionsGroupedByTagQuery;
        this.cache = cache;
    }

    public async Task<HomeModel> GetHomeModel(string tag, bool bustCache = false)
    {
        if (bustCache) ClearHomePageCache();

        var model = await cache.GetOrAddAsync(HomeModelCacheKey, async () =>
        {
            return new HomeModel()
            {
                GroupedLatestListings = await positionsGroupedByTagQuery.Execute(tag)
            };
        }, cacheExpiry);             
        
        return model;
    }

    public void ClearHomePageCache() => cache.Remove(HomeModelCacheKey);
}
    </pre>
</noscript>

IAppCache is the Lazy Cache service being injected into my class. It provides a *GetOrAddAsync* method that accepts:
 - A cache key which in my example is the string "HomeModel".
 - A factory to retrieve the data to be cached in the form of a function Func<ICacheEntry, Task<T>> addItemFactory. The code in my example returns a model after making a database call (the bit I wanted to cache).
 - Options for cache length. I am using a simple sliding timespan of 12 hours.

I find the simplicity of this caching setup very pleasing. It's implementation uses Lazy&lt;T&gt; to ensure the factory method is only executed once. Under the hood by default LazyCache will use IMemoryCache in Microsoft.Extensions.Caching.Memory. This is implementation will only cache data on the machine it is running on. If I was running a more intensive service I would want to extend [LazyCache](https://github.com/alastairtree/LazyCache/wiki/2.0-Extending-LazyCache-with-Redis,-Cassandra-etc) and implement something like redis for distributed caching. The good news is because I am using IAppCache throughout my application I can change the underlying caching provider with relative ease.