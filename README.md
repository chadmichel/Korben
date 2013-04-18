Korben
======
[Source Code] (https://github.com/chadmichel/Korben/blob/master/public/javascripts/korben.js)
 
Library for simplifying access to IndexedDB.

IndexedDB is a power data store that runs within the context of the browser. Many browsers support it: Chrome, FireFox, and IE 10 with hopes that Safari will support it soon. 

IndexedDB allows for a richer applications on the client by enabling the data to be stored on the client. Moving data to the client has 3 primary benefits.
* Better performance than server side calls.
* Off-load work from the server to the client.
* With offline caching (HTML5 feature) you can have a fully disconnected application.

# Why Korben? 
I was trying to use IndexedDB in a very simple application and I found it's API awkward to use. With IndexedDB I felt like it required a lot of setup and teardown ot make the calls I wanted, which were pretty basic.

#Why call it Korben? 
It is the name of my dog, no good reason :)

#Any dependencies?

JQuery, Korben uses JQuery's deferred library. [JQuery Deferred] (http://api.jquery.com/category/deferred-object/)

#Are there any unit tests?

Of course there are (or is it 'is'?). To run the unit tests you will need to have something running that can host the files. I use [node] (http://nodejs.org/) for that. You could host the unit tests in any web server, but it must be a web server. IndexedDB will not work against a file:// based path.

At the time of this writting there are 22 unit tests, all passing. To run them (as I do) fire up node (node app.js). Then navigate to localhost:3000. That will run all the unit tests. 

Unit tests are contained in two JavaScript files. 
* [smoke tests] (https://github.com/chadmichel/Korben/blob/master/public/javascripts/smoketests.js)
* [error tests] (https://github.com/chadmichel/Korben/blob/master/public/javascripts/errortests.js)

Unit tests were written using [QUnit] (http://qunitjs.com/).

#License?
MIT

#How to use?

Korben has a pretty simple API. Things such as putting a record into IndexedDB is very simple. The API often makes use of JQuery's deferred class.

## Put / Get Example

```javascript

	// First we will setup a record to insert.
	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	// Next we must open the database.
	var db = Korben.db(initFunction, "SomeNotes");
	// Then open the store.
	var store = db.store("notes");

	// Once we have a valid store we can put records into the store.
	// put / get return a JQuery deferred object. Call then to wait
	// for the operation to complete.
	store.put(note).then(function() {
		// Get takes a single parameter, the id of the record to find.
		store.get(id).then(function(loaded) {
			// then will be called once record is loaded.
			// If record is not found loaded will be null.
			// You can now use the loaded object...			
		});
	});


```

## What is initFunction in the previous demo? 
How dare you try and sneak that past me!

When creating your database you need to provide a JavaScript object that will be loaded to creaet / initialize the database.

```javascript

// The init object is required to initialize your IndexedDB database.
// Your init object must contain a version property version: 4 below.
// Your init object must also have an update function.
var initFunction = {			
	
	// Schema version of the database.
	version: 4,
	
	// This function will be called when an upgrade of the database is required.
	// You will have to write something like this function for your database.
	// The event passed is an IndexedDB object, on that object you will have to
	// create the object stores you intend to create.
	upgrade: function(event) {
		db = event.target.result;

		if (event.oldVersion < 1) {
			// If we are just getting started lets create a 'notes' store for unit testing.
			var notesStore = db.createObjectStore("notes", { keyPath: "id" });
			notesStore.createIndex("date", "date", { unique: false });
		}	   
		if (event.oldVersion < 2) {
			// Add an integer store for unit testing.
			var intidStore = db.createObjectStore("intid", { keyPath: "id" });			
		}	   

		if (event.oldVersion < 3) {
			// Add a integer range store for unit testing.
			var intRangeStore = db.createObjectStore("intrange", { keyPath: "id" });
			intRangeStore.createIndex("intColumn", "intColumn", { unique: false });
		}	   
	}
}

```

## What if I want to get all records?

Retrieving all records can be done with the store.getAll method.

```javascript

// Create db object.
var db = Korben.db(initFunction, "SomeNotes");
// Open store named "notes"
var store = db.store("notes");

// Call getAll to retrieve all records in the "notes" store.
store.getAll().then(function(loaded) {
	// Loaded is an array with all objects.
});

```

## What if I want to get all inside of a range? 
(iterate over an index)

```javascript

// Create sample item.
var id = UUID.generate();
var note = {id: id, title: "a title", date: new Date(2013, 1, 2)};

// Create database object.
var db = Korben.db(initFunction, "SomeNotes");
// Create store object.
var store = db.store("notes");

// Call clear to reset object store to a blank object store.
store.clear().then(function() {
	// Add sample record.
	store.put(note).then(function() {
		// Call forEachRange to retrieve objects inside of range.
		// callback, will be called for each item inside of range.
		store.forEachRange({
			index: "date", 
			start: new Date(2013, 1, 1), 
			stop: new Date(2013, 1, 3), 
			callback: function(key, primaryKey) {
				// Called for each record inside the range.
				if (key !== null) {
					store.get(primaryKey).then(function(item) {
						ok(item !== null);
						ok(item.id === id);
						ok(item.title == note.title);
						start();
					});
				}
			last: function() {
					// Called after processing all records inside the range.
				}
			}				
		});
	});
});

```	

# Where is the library?

[Source Code] (https://github.com/chadmichel/Korben/blob/master/public/javascripts/korben.js)

# Helpful links about IndexedDB

https://developer.mozilla.org/en-US/docs/IndexedDB
http://www.w3.org/TR/IndexedDB/

