---
title: Getting Started With MongoDB and NoRM
date: 2010-07-09
layout: post
categories:
- Database
tags:
- c#
- mongodb
---

<p>I just realised - I hate writing SQL. I hate it, I hate it, I hate it. I have also recently noticed a growing trend in SQL alternatives or “nosql” with open source C# drivers. Today I put one and one together and decided to try out one of these – MongoDB using the C# driver NoRM. Why this idea didn't occur to me earlier I will never know.</p>  <h3>What is MongoDB?</h3>  <p><a href="http://www.mongodb.org/" target="_blank"><img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; margin-left: 0px; border-left-width: 0px; margin-right: 0px" title="logo-mongodb" border="0" alt="logo-mongodb" align="right" src="http://lukencode.com/wp-content/uploads/2010/07/logomongodb.png" width="221" height="94" /></a> <a href="http://www.mongodb.org/" target="_blank">MongoDB</a> is one of a growing number of nosql databases. In short these databases are non relational and schema free. I won’t attempt to give a full rundown of the pros and cons of nosql but the stated benefits are generally saleability, performance and simplicity.</p>  <p>MongoDB is a document orientated database storing data on disk as binary json. Some key features include indexing, rich queries, map reduce and horizontal scalability. </p>  <p>The Mongo website sums it all up much better than I do so you should probably just go there:</p>  <blockquote>   <p>MongoDB bridges the gap between key-value stores (which are fast and highly scalable) and traditional RDBMS systems (which provide rich queries and deep functionality).</p>    <p>MongoDB (from &quot;hu<strong>mongo</strong>us&quot;) is a scalable, high-performance, <a href="http://www.mongodb.org/display/DOCS/Source+Code">open source</a>, document-oriented database.</p> </blockquote>  <p>For installation instructions for Mongo I recommend taking a look at the <a href="http://www.mongodb.org/display/DOCS/Quickstart+Windows">Windows Quickstart guide</a>.</p>  <h3>What (or who) is NoRM?</h3>  <p><a href="http://wiki.github.com/atheken/NoRM/" target="_blank"><img style="border-bottom: 0px; border-left: 0px; display: inline; margin-left: 0px; border-top: 0px; margin-right: 0px; border-right: 0px" title="normLogo" border="0" alt="normLogo" align="right" src="http://lukencode.com/wp-content/uploads/2010/07/normLogo.png" width="244" height="99" /></a> <a href="http://wiki.github.com/atheken/NoRM/" target="_blank">NoRM</a> is an open source .Net library for connecting to MongoDB. Its main drawcards for me are:</p>  <ul>   <li>NoRM is strongly typed. It uses plain .net classes when querying and updating the database. </li>    <li>Uses linq for queries </li>    <li>Simple and convention based. NoRM makes it really simple to get persistence up and running as I will soon demonstrate. </li> </ul>  <p>To get NoRM head over to <a title="http://github.com/atheken/NoRM" href="http://github.com/atheken/NoRM">http://github.com/atheken/NoRM</a>.</p>  <h3>Using NoRM in C#</h3>  <p>I’m going to be using NoRM with a pretty standard session pattern. My MongoSession will implement the following ISession interface which uses linq expressions for queries.</p>  
<pre class="prettyprint">public interface ISession : IDisposable
{
    void CommitChanges();
    void Delete&lt;T&gt;(Expression&lt;Func&lt;T, bool&gt;&gt; expression) where T : class, new();
    void Delete&lt;T&gt;(T item) where T : class, new();
    void DeleteAll&lt;T&gt;() where T : class, new();
    T Single&lt;T&gt;(Expression&lt;Func&lt;T, bool&gt;&gt; expression) where T : class, new();
    System.Linq.IQueryable&lt;T&gt; All&lt;T&gt;() where T : class, new();
    void Add&lt;T&gt;(T item) where T : class, new();
    void Add&lt;T&gt;(IEnumerable&lt;T&gt; items) where T : class, new();
    void Update&lt;T&gt;(T item) where T : class, new();
}</pre>

<p>&#160;</p>

<p>The MongoSession class is based off the one found in the <a href="http://mvcstarter.codeplex.com/" target="_blank">mvcstarter project</a> and uses NoRM to implement ISession. The constructor for this class sets up the Mongo connection looking for a web.config connection string entry named “db”. An example connection string is given after the code.</p>

<pre class="prettyprint">public class MongoSession : ISession
{
    private Mongo _provider;
    public MongoDatabase DB { get { return this._provider.Database; } }

    public MongoSession()
    {
        //this looks for a connection string in your Web.config
        _provider = Mongo.Create(&quot;db&quot;);
    }

    public void CommitChanges()
    {
        //mongo isn't transactional in this way
    }

    public void Delete&lt;T&gt;(System.Linq.Expressions.Expression&lt;Func&lt;T, bool&gt;&gt; expression) where T : class, new()
    {
        var items = All&lt;T&gt;().Where(expression);
        foreach (T item in items)
        {
            Delete(item);
        }
    }

    public void Delete&lt;T&gt;(T item) where T : class, new()
    {
        DB.GetCollection&lt;T&gt;().Delete(item);
    }

    public void DeleteAll&lt;T&gt;() where T : class, new()
    {
        DB.DropCollection(typeof(T).Name);
    }

    public T Single&lt;T&gt;(System.Linq.Expressions.Expression&lt;Func&lt;T, bool&gt;&gt; expression) where T : class, new()
    {
        return All&lt;T&gt;().Where(expression).SingleOrDefault();
    }

    public IQueryable&lt;T&gt; All&lt;T&gt;() where T : class, new()
    {
        return _provider.GetCollection&lt;T&gt;().AsQueryable();
    }

    public void Add&lt;T&gt;(T item) where T : class, new()
    {
        DB.GetCollection&lt;T&gt;().Insert(item);
    }

    public void Add&lt;T&gt;(IEnumerable&lt;T&gt; items) where T : class, new()
    {
        foreach (T item in items)
        {
            Add(item);
        }
    }

    public void Update&lt;T&gt;(T item) where T : class, new()
    {
        DB.GetCollection&lt;T&gt;().UpdateOne(item, item);
    }

    //Helper for using map reduce in mongo
    public T MapReduce&lt;T&gt;(string map, string reduce)
    {
        T result = default(T);
        MapReduce mr = DB.CreateMapReduce();

        MapReduceResponse response =
            mr.Execute(new MapReduceOptions(typeof(T).Name)
            {
                Map = map,
                Reduce = reduce
            });
        IMongoCollection&lt;MapReduceResult&lt;T&gt;&gt; coll = response.GetCollection&lt;MapReduceResult&lt;T&gt;&gt;();
        MapReduceResult&lt;T&gt; r = coll.Find().FirstOrDefault();
        result = r.Value;

        return result;
    }

    public void Dispose()
    {
        _provider.Dispose();
    }
}</pre>

<p>&#160;</p>

<pre class="prettyprint">&lt;connectionStrings&gt;
  &lt;add name=&quot;db&quot; connectionString=&quot;mongodb://localhost/testdb?strict=true&quot;/&gt;
&lt;/connectionStrings&gt;</pre>

<p>&#160;</p>

<p>One of the best things about Mongo and NoRM is that NoRM will store plain and simple .net objects. This means we can define our models completely in code. Because Mongo is schema less we can also add and remove properties without any problems.</p>

<p>I am going to store a simple Trip class for a scheduling application. There are a couple of things to note about this code, first is the [MongoIdentifier] Attribute. Mongo requires collections have a unique identifier. When using NoRM the options you can use are: Guid/UUID, int, or ObjectId. The property must also be named either _id or Id. NoRM will handle generating the identifier when it is required. To keep my example simple I am using an integer. For more complete guidelines check the <a href="http://wiki.github.com/atheken/NoRM/bson-serializer" target="_blank">BSON Serializer page</a>.</p>

<pre class="prettyprint">public class Trip
{
    [MongoIdentifier]
    public int? Id { get; set; }
    public string Name { get; set; }

    public DateTime Start { get; set; }
    public int Duration { get; set; }

    public Trip()
    {
        Start = DateTime.Now;
    }
}</pre>

<p>&#160;</p>

<p>The code to store the Trip class is very simple. The session’s add method will automatically store the object in the database as well as assigning it an Id.</p>

<pre class="prettyprint">var trip = new Trip() 
{ 
    Name = &quot;test trip&quot;,
    Duration = 5,
    Start = DateTime.Now
};

using (var session = new MongoSession())
{
    session.Add(trip);
}</pre>

<p>&#160;</p>

<p>BAM! Here is the object I just saved viewed in the mongo shell. It has been assigned an identifier and stored in a collection called Trip. There was no need to define the structure of the object or to create a collection to store it in, this all happens automatically and is part of what makes coding with Mongo so refreshing.</p>

<p><a href="http://lukencode.com/wp-content/uploads/2010/07/shell.png"><img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="shell" border="0" alt="shell" src="http://lukencode.com/wp-content/uploads/2010/07/shell_thumb.png" width="492" height="250" /></a> </p>

<p>&#160;</p>

<p>Finding the document with code is simple using the linq methods of MongoSession.</p>

<pre class="prettyprint">using (var session = new MongoSession())
{
    var trip = session.Single&lt;Trip&gt;(t =&gt; t.Name == &quot;test trip&quot;);
}</pre>

<p>&#160;</p>

<p>This is obviously a very basic overview of programming with Mongo and NoRM and therefore I have skipped over some of the more advanced features. NoRM’s linq provider is pretty good but on complex queries you may run into some issues. NoRM also has some configuration code you can add to optimise the way your objects are stored. Overall I am finding working without the constraints of a schema and letting your code define your data storage is a great way to program.</p>

<!-- ba9836cf045145f4aa5aaf176e28e63d  -->