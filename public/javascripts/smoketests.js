

asyncTest(" get / put ", function() {

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
			ok(loaded.id === note.id);
			start();
		});
	});
	
	// One assertion above (ok)
	expect(1);
});

asyncTest(" get / put (int id)", function() {

	var id = 1;
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.get(id).then(function(loaded) {
				ok(loaded.id === note.id);
				start();
			});
		});
	});
	
	expect(1);
});

asyncTest(" get no record ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.get(id).then(function(loaded) {
		ok(loaded === null);
		start();
	});
	
	expect(1);
});

asyncTest(" update record ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.put(note).then(function() {		
		store.get(id).then(function(loaded) {
			loaded.title = "poop";
			store.put(loaded).then(function() {					
				store.get(id).then(function(loaded2) {
					ok(loaded2.title === "poop");
					start();
				});	
			});
		});
	});
	
	expect(1);
});

asyncTest(" getAll ", function() {

	//
	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.put(note).then(function() {
		store.getAll().then(function(loaded) {
			ok(loaded.length > 0);
			start();
		});
	});
	
	expect(1);
});

asyncTest(" getAll no data", function() {

	// Create db object.
	var db = Korben.db(initFunction, "SomeNotes");
	// Open store named "notes"
	var store = db.store("notes");

	// Call getAll to retrieve all records in the "notes" store.
	store.getAll().then(function(loaded) {
		// loaded will be an array of all records in "notes" store.
		// If no records it should be an empty array.
		ok(loaded != null);
		start();
	});
	
	expect(1);
});

asyncTest(" getAll by Index ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.put(note).then(function() {
		store.getAll("date").then(function(loaded) {
			ok(loaded.length > 0);
			start();
		});
	});
	
	expect(1);
});

asyncTest(" forEach ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEach({
				callback: function(cursor) {
					if (cursor != null) 
						ok(cursor.value.id == id);
					else
						start();
				}
			});
		});
	});
	
	expect(1);
});

asyncTest(" forEach using last", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	// clear the store
	store.clear().then(function() {
		// add a single item to store for testing purposes.
		store.put(note).then(function() {
			// iterate over all items in the store (1 item)
			store.forEach({
				// callback will be called for all items.
				// and with a null when we have reached then end.
				callback: function(cursor) {
					if (cursor != null) 
						ok(cursor.value.id == id);					
				},
				// last will be called after last item has been processed.
				last: function() {
					start();
				}
			});
		});
	});
	
	expect(1);
});

asyncTest(" for each range (contains item)", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date(2013, 1, 2)};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEachRange({
				index: "date", 
				start: new Date(2013, 1, 1), 
				stop: new Date(2013, 1, 3), 
				callback: function(key, primaryKey) {
					if (key != null) {
						ok(key != null);					
						ok(primaryKey === id);
						start();
					}
				}
			});
		});
	});	
	
	expect(2);
});

asyncTest(" for each range (contains item)", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date(2013, 1, 2)};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEachRange({
				index: "date", 
				start: new Date(2013, 1, 1), 
				stop: new Date(2013, 1, 3), 
				callback: function(key, primaryKey) {
					if (key != null) {
						ok(key != null);					
						ok(primaryKey === id);
						start();
					}
				}
			});
		});
	});	
	
	expect(2);
});


asyncTest(" for each range int (contains muiltiple items)", function() {

	var id = UUID.generate();
	var intRange = {id: id, title: "a title", intColumn: 1};
	
	var id2 = UUID.generate();
	var intRange2 = {id: id2, title: "a title", intColumn: 2};
		
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("intrange");

	store.clear().then(function() {
		store.put(intRange).then(function() {
			store.put(intRange2).then(function() {
				store.forEachRange({
					index: "intColumn", 
					start: 0, 
					stop: 3, 
					callback: function(key, primaryKey) {
						if (key != null) {
							ok(key != null);					
							if (primaryKey == id2)
								start();
						}
					}
				});
			});
		});
	});	
	
	expect(2);
});

asyncTest(" for each range int (contains muiltiple items)", function() {

	var id = UUID.generate();
	var intRange = {id: id, title: "a title", intColumn: 1};
	
	var id2 = UUID.generate();
	var intRange2 = {id: id2, title: "a title", intColumn: 2};
		
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("intrange");

	store.clear().then(function() {
		store.put(intRange).then(function() {
			store.put(intRange2).then(function() {
				store.forEachRange({
					index: "intColumn", 
					start: 0, 
					stop: 3, 
					callback: function(key, primaryKey) {
						if (key != null) {
							ok(key != null);					
							if (primaryKey == id2)
								start();
						}
					}
				});
			});
		});
	});	
	
	expect(2);
});

asyncTest(" for each range (no end)", function() {

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
				},
				last: function() {
						// Called after processing all records inside the range.					
				}				
			});
		});
	});	
	
	expect(3);
});

asyncTest(" for each range int (no start)", function() {

	var id = UUID.generate();
	var intRange = {id: id, title: "a title", intColumn: 1};
	
	var id2 = UUID.generate();
	var intRange2 = {id: id2, title: "a title", intColumn: 2};
		
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("intrange");

	store.clear().then(function() {
		store.put(intRange).then(function() {
			store.put(intRange2).then(function() {
				store.forEachRange({
					index: "intColumn", 
					stop: 3, 
					callback: function(key, primaryKey) {
						if (key != null) {
							ok(key != null);					
							if (primaryKey == id2)
								start();
						}
					}
				});
			});
		});
	});	
	
	expect(2);
});

asyncTest(" for each range (does NOT contain item)", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date(2012, 1, 2)};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEachRange({
				index: "date", 
				start: new Date(2013, 1, 1), 
				stop: new Date(2013, 1, 3), 
				callback: function(key, primaryKey) {
					if (key === null) {
						ok(key === null);
						start();
					}
					else
						ok(key !== null); // this will blow up if data returned
				}
			});
		});
	});	
	
	expect(1);
});

asyncTest(" count 1 ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.deleteAll().then(function() {
		store.put(note).then(function() {
			store.count().then(function(count) {
				ok(count === 1);
				start();
			});
		});
	});
	
	expect(1);
});

asyncTest(" count 2 ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	var id2 = UUID.generate();
	var note2 = {id: id2, title: "a title", date: new Date()};
		
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.deleteAll().then(function() {
		store.put(note).then(function() {
			store.put(note2).then(function() {
				store.count().then(function(count) {
					ok(count === 2);
					start();
				});	
			});
		});
	});
	
	expect(1);
});

asyncTest(" clear ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.count().then(function(count) {
				ok(count === 1);
				start();
			});
		});
	});
	
	expect(1);
});

asyncTest(" delete ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.put(note).then(function() {
		// delete takes a single parameter, the key of the item to delete.
		store.delete(id).then(function() {
			store.get(id).then(function(loaded) {
				ok(loaded == null);
				start();
			});
		});
	});
	
	// One assertion above (ok)
	expect(1);
});

asyncTest(" delete no record", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	// delete takes a single parameter, the key of the item to delete.
	store.delete(id).then(function() {
		start();
	});
	
	// One assertion above (ok)
	expect(0);
});

asyncTest(" delete null ", function() {

	var id = null;
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	// delete takes a single parameter, the key of the item to delete.
	store.delete(id).fail(function() {
		start();
	});
	
	// One assertion above (ok)
	expect(0);
});