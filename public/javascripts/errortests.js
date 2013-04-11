test(" no error if no query ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("bad");

	expect(0);
});

asyncTest(" put - blow up on no store ", function() {

	var id = UUID.generate();
	var note = {id: id, title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("poop");

	store.put(note).fail(function() {
		ok(true);
		start();
	});
	
	expect(1);
});

asyncTest(" put - blow up on no id ", function() {

	var id = UUID.generate();
	var note = {title: "a title", date: new Date()};
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.put(note).fail(function() {
		ok(true);
		start();
	});
	
	expect(1);
});

asyncTest(" get - blow up on no store ", function() {
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("poop");

	store.get("blah").fail(function() {
		ok(true);
		start();
	});
	
	expect(1);
});

asyncTest(" get - no record ", function() {
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("notes");

	store.get("blah").then(function(record) {
		ok(record == null);
		start();
	});
	
	expect(1);
});

asyncTest(" forEach - no store ", function() {
	
	var db = Korben.db(initFunction, "SomeNotes");
	var store = db.store("poop");

	store.forEach("poop", function(err, cursor) {		
		ok(cursor == null);
		start();
	});
	
	expect(1);
});
