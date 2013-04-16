Korben
======

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

JQuery, Korben uses JQuery's deferred library.

#How to use?

Korben has a pretty simple API. Things such as putting a record into IndexedDB is very simple. The API often makes use of JQuery's deferred class.


# Where is the library?

