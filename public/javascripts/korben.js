
var Korben;
(function(Korben) {
	
	// Wraps access to an IndexedDB database.
	Korben.DbWrapper = function(initFunction, dbName) {
		var self = this;
		self.initFunction = initFunction;
		self.dbName = dbName;
		
		self.store = function(storeName) {
			return new Korben.StoreWrapper(self.initFunction, self.dbName, storeName);					
		};
	};
	
	// Wraps access to an IndexedDb store.
	Korben.StoreWrapper = function(initFunction, dbName, storeName) {
		var self = this;	
		self.db = null;	
		self.dbName = dbName;
		self.storeName = storeName;
		self.promise = $.Deferred();
		
		var request = window.indexedDB.open(dbName, 1);      
		var db = null;
            
		request.onupgradeneeded = function(event) {
			initFunction(event);	   
		};
        
		request.onerror = function(event) {
			// Do something with request.errorCode!
			self.promise.reject(event);
		};
		request.onsuccess = function(event) {
			// Do something with request.result!
			self.db = event.target.result;
			self.promise.resolve();            
		};
						
		self.put = function(object) {
			
			var def = $.Deferred();
		
			self.promise.then(function() { 
				var tx = self.db.transaction(self.storeName, "readwrite");
				var store = tx.objectStore(self.storeName);
				var req = store.put(object);
							
				req.onsuccess = function(event) {
					def.resolve();
				};
				req.onerror = function(event) {
					def.reject(event);
				};
			});
			return def;
		};
		
		self.get = function(id) {

			var def = $.Deferred();
			
			self.promise.then(function() { 
				var tx = self.db.transaction(self.storeName, "readwrite");
				var store = tx.objectStore(self.storeName);
				var req = store.get(id);
					
				req.onsuccess = function(event) {				
					def.resolve(event.srcElement.result);
				};
				req.onerror = function(event) {
					def.reject(event);
				};
			});
			return def;
		};
	}

	Korben.db = function(initFunction, dbName) {	
		return new Korben.DbWrapper(initFunction, dbName);
	};
	

}) (Korben || (Korben = {}));