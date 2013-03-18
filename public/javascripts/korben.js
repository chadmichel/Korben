
var Korben;
(function(Korben) {

	// Wraps access to an IndexedDB database.
	Korben.DbWrapper = function(db) {
		var self = this;
		self.db = db;
		
		self.store = function(storeName) {
			return new Korben.StoreWrapper(db, storeName);					
		};
	};
	
	// Wraps access to an IndexedDb store.
	Korben.StoreWrapper = function(db, storeName) {
		var self = this;		
		self.db = db;
		self.storeName = storeName;
				
		self.put = function(object) {
			
			var def = $.Deferred();
		
			var tx = self.db.transaction(self.storeName, "readwrite");
			var store = tx.objectStore(self.storeName);
			var req = store.put(object);
							
			req.onsuccess = function(event) {
				def.resolve();
			};
			req.onerror = function(event) {
				def.reject(event);
			};
		
			return def;
		};
		
		self.get = function(id) {

			var def = $.Deferred();
			
			var tx = db.transaction(self.storeName, "readwrite");
			var store = tx.objectStore(self.storeName);
			var req = store.get(id);
					
			req.onsuccess = function(event) {				
				def.resolve(event.srcElement.result);
			};
			req.onerror = function(event) {
				def.reject(event);
			};

			return def;
		};
	}

	Korben.db = function(initFunction, dbName) {
	
		var def = $.Deferred();
		
		var request = window.indexedDB.open(dbName, 1);      
		var db = null;
            
		request.onupgradeneeded = function(event) {
			initFunction(event);	   
		};
        
		request.onerror = function(event) {
			// Do something with request.errorCode!
			def.reject(event);
		};
		request.onsuccess = function(event) {
			// Do something with request.result!
			db = event.target.result;
			var store = new Korben.DbWrapper(db);
			def.resolve(store);            
		};
		
		return def;
	};
	

}) (Korben || (Korben = {}));