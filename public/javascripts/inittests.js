
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
