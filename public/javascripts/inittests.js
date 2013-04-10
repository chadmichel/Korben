var initFunction = {			
	
	version: 4,
	
	upgrade: function(event) {
		db = event.target.result;

		if (event.oldVersion < 1) {
			var notesStore = db.createObjectStore("notes", { keyPath: "id" });
			notesStore.createIndex("date", "date", { unique: false });
		}	   
		if (event.oldVersion < 2) {
			var intidStore = db.createObjectStore("intid", { keyPath: "id" });			
		}	   

		if (event.oldVersion < 3) {
			var intRangeStore = db.createObjectStore("intrange", { keyPath: "id" });
			intRangeStore.createIndex("intColumn", "intColumn", { unique: false });
		}	   
	}
}
