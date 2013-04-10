

asyncTest(" get / put ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.put(note).then(function() {
		store.get(id).then(function(loaded) {
			ok(loaded.id === note.id);
			start();
		});
	});
	
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

asyncTest(" for each range (contains item)", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date(2013, 1, 2)};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEachRange("date", new Date(2013, 1, 1), new Date(2013, 1, 3), 
				function(key, primaryKey) {
					if (key != null) {
						ok(key != null);					
						ok(primaryKey === id);
						start();
					}
				}
			);
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
			store.forEachRange("date", new Date(2013, 1, 1), new Date(2013, 1, 3), 
				function(key, primaryKey) {
					if (key != null) {
						ok(key != null);					
						ok(primaryKey === id);
						start();
					}
				}
			);
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
				store.forEachRange("intColumn", 0, 3, 
					function(key, primaryKey) {
						if (key != null) {
							ok(key != null);					
							if (primaryKey == id2)
								start();
						}
					}
				);
			});
		});
	});	
	
	expect(2);
});

asyncTest(" for each range (get item)", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date(2013, 1, 2)};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEachRange("date", new Date(2013, 1, 1), new Date(2013, 1, 3), 
				function(key, primaryKey) {
					if (key !== null) {
						store.get(primaryKey).then(function(item) {
							ok(item !== null);
							ok(item.id === id);
							ok(item.title == note.title);
							start();
						});
					}
				}				
			);
		});
	});	
	
	expect(3);
});

asyncTest(" for each range (does NOT contain item)", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date(2012, 1, 2)};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.clear().then(function() {
		store.put(note).then(function() {
			store.forEachRange("date", new Date(2013, 1, 1), new Date(2013, 1, 3), 
				function(key, primaryKey) {
					if (key === null) {
						ok(key === null);
						start();
					}
					else
						ok(key !== null); // this will blow up if data returned
				}
			);
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
