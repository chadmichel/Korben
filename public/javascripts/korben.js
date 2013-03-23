
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
		
		// Execute a query, calling this ensures the database has been created.
		self.execute = function(callback) {
			if (db === null) {
				self.promise.then(function() { 
					callback();
				});	
			}
			else {
				callback();
			}					
		};
						
		// Put a object into the store. This does both insert and update.				
		self.put = function(object) {
			
			var def = $.Deferred();
		
			self.execute(function() { 
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
		
		// Get an item from the store. If no item nothing (null) is returned.
		self.get = function(id) {

			var def = $.Deferred();
			
			self.execute(function() { 
				var tx = self.db.transaction(self.storeName, "readwrite");
				var store = tx.objectStore(self.storeName);			
				var req = store.get(id);	
				
				req.onsuccess = function(event) {				
					if (event == null || event.srcElement == null || event.srcElement.result == null)
						def.resolve(null);
					else
						def.resolve(event.srcElement.result);
				};
				req.onerror = function(event) {
					def.resolve(null);
				};
			});
			return def;
		};
		
		self.forEach = function(index, callback) {			

			self.execute(function() {
				
				var tx = self.db.transaction(self.storeName, "readwrite");
				var store = tx.objectStore(self.storeName);
				var req = null;
			
				if (index == null || index.length == 0)
					req = store.openCursor();
				else {
					index = store.index(index);
					req = index.openKeyCursor();
				}
				
				req.onsuccess = function(event) {
					if (event !== null && event.target !== null) {
	                    var cursor = event.target.result;
	                    if (cursor !== null) {
	                        if (callback !== null)
	                            callback(cursor);
	                        cursor.continue();
	                    }
						else
							callback(null);
	                }
	            };
			});
		};
		
		self.getAll = function(index) {
			
			var def = $.Deferred();
			
			var resultArray = [];
			
			self.forEach(index, function(cursor) {
				if (cursor == null)
					def.resolve(resultArray);
				else
					resultArray.push(cursor.value);
			});
			
			return def; // return promise		
		};
		
		self.removeAll = function() {
		
			var def = $.Deferred();
												
			self.forEach(null, function(cursor) {
				if (cursor === null)
					def.resolve();
				else
					cursor.delete();
			});
			
			return def; // return promise		
		};
		
		self.clear = function() {
		
			var def = $.Deferred();
			
			self.execute(function() {

				var tx = self.db.transaction(self.storeName, "readwrite");
				var store = tx.objectStore(self.storeName);			
				var req = store.clear();
				
				req.onsuccess = function(event) {				
					def.resolve(event.target.result);
				};
				req.onerror = function(event) {
					def.reject(event);
				};												
			});		
			
			return def; // return promise		
		}
		
		self.count = function() {
			
			var def = $.Deferred();
			
			self.execute(function() {
					
				var tx = self.db.transaction(self.storeName, "readwrite");
				var store = tx.objectStore(self.storeName);			
				var req = store.count();	
				
				req.onsuccess = function(event) {				
					def.resolve(event.target.result);
				};
				req.onerror = function(event) {
					def.reject(event);
				};									
			});
			
			return def;
		}
	}

	Korben.db = function(initFunction, dbName) {	
		return new Korben.DbWrapper(initFunction, dbName);
	};
	

}) (Korben || (Korben = {}));