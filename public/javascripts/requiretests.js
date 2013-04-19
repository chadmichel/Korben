requirejs.config({

	baseUrl: 'javascripts',

	paths: {
		libs: '../libs'
	}
	
});

require(
	// define what modules we want to load
	["korben", "libs/jquery", "inittests", "guid"], 
	// bind loaded modules to paramters in function
	function(Korben, $, inittests, guid) {

		Korben.check(function(err) { 
			alert(err); 
		});
	
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
	}
);