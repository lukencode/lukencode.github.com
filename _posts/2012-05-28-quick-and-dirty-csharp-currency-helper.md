---
title: "Quick and Dirty Currency Formatting in C#"
date: 2012-05-28
layout: post
---

A project I have been working on recently stores amounts of money along with the currency they are in. I was getting sick of the old `amount + currency_code` style of display and decided to see if I could hack together something that looks a bit nicer. Turns out you can use the built in .NET culture info and `string.Format` to format decimals into any currency. 

The code queries the cultures using linq to find a culture matching the given currency code it then uses passes the culture into string.Format and asks it to format as currency ("C"). I wrapped it all up in an extension method and added a default return if the culture is not found. The code seems to work fine but I can't really vouch for its performance or coverage of currencies other than to say "it works on my machine".

<pre>
public static string FormatCurrency(this decimal amount, string currencyCode)
{
	var culture = (from c in CultureInfo.GetCultures(CultureTypes.SpecificCultures)
			let r = new RegionInfo(c.LCID)
			where r != null
			&amp;&amp; r.ISOCurrencySymbol.ToUpper() == currencyCode.ToUpper()
			select c).FirstOrDefault();

	if (culture == null)
		return amount.ToString(&quot;0.00&quot;);

	return string.Format(culture, &quot;{0:C}&quot;, amount);
}
</pre>
    
Here are the results of calling FormatCurrency for a few different currency codes:

<pre>
decimal amount = 100;

amount.FormatCurrency("AUD");  //$100.00
amount.FormatCurrency("GBP");  //£100.00
amount.FormatCurrency("EUR");  //100,00 €
amount.FormatCurrency("VND");  //100,00 ₫
amount.FormatCurrency("IRN");  //₹ 100.00
</pre>
    