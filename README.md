Korben
======
[Source] (public/javascripts/korben.js)
 
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
* [smoke tests] (public/javascripts/smoketests.js)
* [error tests] (public/javascripts/errortests.js)

Unit tests were written using [QUnit] (http://qunitjs.com/).

#How to use?

Korben has a pretty simple API. Things such as putting a record into IndexedDB is very simple. The API often makes use of JQuery's deferred class.


# Where is the library?

[Source] (public/javascripts/korben.js)

