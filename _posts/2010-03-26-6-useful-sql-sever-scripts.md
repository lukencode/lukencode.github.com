---
title: 6 Useful SQL Server Scripts
date: 2010-03-26T19:10:49.0000000+10:00
layout: post
categories:
- Database
tags:
- sql
---

This is a post we had on the short lived blog.tboda.com with input from DK and <a href="http://benjii.me">Benjii</a>. People seemed to find it useful so I thought I’d give it second chance at life (plus one extra script).

<h3>Database Backup</h3>

This script is used to do regular backups of a given database when running as a scheduled sql job. It appends the date to each backup to prevent conflicts.

<pre class="prettyprint">DECLARE @currentday varchar(10)
set @currentday = datepart(day,getdate())
IF LEN(@currentday) = 1
BEGIN
	SET @currentday = '0' + @currentday
END
DECLARE @currentmonth varchar(10)
SET @currentmonth = datepart(month,getdate())
IF LEN(@currentmonth) = 1
BEGIN
	SET @currentmonth = '0' + @currentmonth
END
DECLARE @currentyear varchar(10)
SET @currentyear = datepart(year,getdate())
DECLARE @fileName varchar(100)
SET @fileName = 'c:\Backups\Database\myDatabase_' + @currentyear
+ '_'	 + @currentmonth  + '_' + @currentday  + '.bak'
BACKUP DATABASE myDatabase TO DISK = @fileName WITH NOFORMAT, INIT,
NAME = N'myDatabase -Full Database Backup', SKIP, NOREWIND, NOUNLOAD,  STATS = 10
GO</pre>

<h3>Clear all Records</h3>

This script basically 'resets' your database by removing all records from every table whilst keeping constraints intact and resetting identities.

<pre class="prettyprint">--Disable Constraints &amp; Triggers
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'
EXEC sp_MSforeachtable 'ALTER TABLE ? DISABLE TRIGGER ALL'
--Perform delete operation on all table for cleanup
EXEC sp_MSforeachtable 'DELETE ?'
--Enable Constraints &amp; Triggers again
EXEC sp_MSforeachtable 'ALTER TABLE ? CHECK CONSTRAINT ALL'
EXEC sp_MSforeachtable 'ALTER TABLE ? ENABLE TRIGGER ALL'
--Reset Identity on tables with identity column
EXEC sp_MSforeachtable 'IF OBJECTPROPERTY(OBJECT_ID(''?''), ''TableHasIdentity'') = 1
BEGIN DBCC CHECKIDENT (''?'',RESEED,0) END'</pre>

<h3>Distance between points</h3>

Taking 2 sets of longitude/latitude points this function will calculate the distance between them and return it as a real.

<pre class="prettyprint">

CREATE FUNCTION [dbo].[DistanceBetween] (@Lat1 as real,
@Long1 as real, @Lat2 as real, @Long2 as real)
RETURNS real
AS
BEGIN
DECLARE @dLat1InRad as float(53);
SET @dLat1InRad = @Lat1 * (PI()/180.0);
DECLARE @dLong1InRad as float(53);
SET @dLong1InRad = @Long1 * (PI()/180.0);
DECLARE @dLat2InRad as float(53);
SET @dLat2InRad = @Lat2 * (PI()/180.0);
DECLARE @dLong2InRad as float(53);
SET @dLong2InRad = @Long2 * (PI()/180.0);
DECLARE @dLongitude as float(53);
SET @dLongitude = @dLong2InRad - @dLong1InRad;
DECLARE @dLatitude as float(53);
SET @dLatitude = @dLat2InRad - @dLat1InRad;
-- Intermediate result a.
DECLARE @a as float(53);
SET @a = SQUARE (SIN (@dLatitude / 2.0)) + COS (@dLat1InRad)
* COS (@dLat2InRad)
* SQUARE(SIN (@dLongitude / 2.0));
-- Intermediate result c (great circle distance in Radians).
DECLARE @c as real;
SET @c = 2.0 * ATN2 (SQRT (@a), SQRT (1.0 - @a));
DECLARE @kEarthRadius as real;
-- SET kEarthRadius = 3956.0 miles
SET @kEarthRadius = 6376.5; -- kms
DECLARE @dDistance as real;
SET @dDistance = @kEarthRadius * @c;
RETURN (@dDistance);
END

</pre>

<h3>Get Table Size</h3>

This is a SQL Server 2005 stored procedure that returns a table with details on the storage spaced used by all tables in the database.

<pre class="prettyprint">CREATE PROCEDURE [dbo].[GetDBTableSize]
AS
BEGIN
SET NOCOUNT ON;
DECLARE @cmdstr varchar(100)
--Create Temporary Table
CREATE TABLE #TempTable
(
        [Table_Name] varchar(50),
	Row_Count int,
	Table_Size varchar(50),
	Data_Space_Used varchar(50),
	Index_Space_Used varchar(50),
	Unused_Space varchar(50)
)
--Create Stored Procedure String
SELECT @cmdstr = 'sp_msforeachtable ''sp_spaceused "?"'''
--Populate Tempoary Table
INSERT INTO #TempTable EXEC(@cmdstr)
--Determine sorting method
SELECT * FROM #TempTable ORDER BY Table_Name
--Delete Temporay Table
DROP TABLE #TempTable
END</pre>
<h3>Clear Transaction Logs</h3>
A small script to clear the transaction logs of a given database. During development these can get pretty excessive.
<pre class="prettyprint">BACKUP log [myDatabase] with truncate_only
go
DBCC SHRINKDATABASE ([myDatabase], 10, TRUNCATEONLY)
go</pre>
This will stop the transaction logs from growing too large.

It is also a good idea to do regular backups of these logs (which shrinks them anyway)

<pre class="prettyprint">BACKUP
LOG [myDatabase] TO DISK = N'C:\Backups\myDatabase_log.trn' WITH
NOFORMAT, NOINIT, NAME = N'myDatabase_log', SKIP, REWIND, NOUNLOAD,
STATS = 10</pre>

<h3>Number of Tables in Database</h3>

Working on a rather monolithic finance system the other day I wanted to check out just how many un necessary tables they had. Here is how via <a href="http://www.sqlservercurry.com/2008/06/count-number-of-tables-in-sql-server.html">sqlservercurry</a>.

<pre class="prettyprint">USE YOURDBNAME
SELECT COUNT(*) from information_schema.tables
WHERE table_type = 'base table'</pre>