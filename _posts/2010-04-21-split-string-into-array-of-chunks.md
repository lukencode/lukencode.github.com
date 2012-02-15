---
title: Split String Into Array of Chunks
date: 2010-04-21
layout: post
categories:
- Code
tags: []
---

Here is a little function I needed to use today for spliting a string into an array of strings of a given length rather than by a particular character. I ran into a situation where the database columns I wanted to insert some text into were split over a number of columns eg "DescriptionLine1", "DescriptionLine2", "DescriptionLine3".

Through the magic of extension methods I can split the string into chunks using this code.

<pre class="prettyprint">
var splitItemDescription = item.Product.Description.SplitIntoChunks(40);
</pre>

Here is the code for the extension method, written in C#.

<pre class="prettyprint">
public static string[] SplitIntoChunks(this string toSplit, int chunkSize)
{
     int stringLength = toSplit.Length;

     int chunksRequired = (int)Math.Ceiling((decimal)stringLength / (decimal)chunkSize);
     var stringArray = new string[chunksRequired];

     int lengthRemaining = stringLength;

     for (int i = 0; i < chunksRequired; i++)
     {
         int lengthToUse = Math.Min(lengthRemaining, chunkSize);
         int startIndex = chunkSize * i;
         stringArray[i] = toSplit.Substring(startIndex, lengthToUse);
            
         lengthRemaining = lengthRemaining - lengthToUse;
     }
            
     return stringArray;
}
</pre>

The method takes into account strings of which the length is not a factor of the chunk size being used by using what is remaing of the string for the last element of the array.