
var Korben;
(function(Korben) {
	
	// Wraps access to an IndexedDB database.
	// You will end accessing a store from this object.
	// db.store("notes");
	Korben.DbWrapper = function(initFunction, dbName) {
		var self = this;
		self.initFunction = initFunction;
		self.dbName = dbName;
		
		self.store = function(storeName) {
			return new Korben.StoreWrapper(self.initFunction, self.dbName, storeName);					
		};
	};
	
	// Wraps access to an IndexedDb store.
	// Stores provide access to store related functions,
	// such as put, get, getAll, forEach...
	Korben.StoreWrapper = function(initFunction, dbName, storeName) {
		var self = this;	
		var db = null;	
		var promise = $.Deferred();
		var init = initFunction;
		
		var request = window.indexedDB.open(dbName, init.version);      
		var db = null;
            
		request.onupgradeneeded = function(event) {
			init.upgrade(event);	   
		};
        
		request.onerror = function(event) {
			// Do something with request.errorCode!
			promise.reject(event);
		};
		request.onsuccess = function(event) {
			// Do something with request.result!
			db = event.target.result;
			promise.resolve();            
		};
		
		// Execute a query, calling this ensures the database has been created.
		self.execute = function(callback) {		
			if (db === null) {
				promise.then(function() { 
					callback(db);
				});	
			}
			else {
				callback(db);
			}						
		};
						
		// Put a object into the store. This does both insert and update.				
		self.put = function(object) {
			
			var def = $.Deferred();
		
			self.execute(function(db) { 
				
				try {
					var tx = db.transaction(storeName, "readwrite");
					var store = tx.objectStore(storeName);
					var req = store.put(object);
							
					req.onsuccess = function(event) {
						def.resolve();
					};
					req.onerror = function(event) {
						def.reject(event);
					};
				}	
				catch(err) {
					def.reject(err);
				}	
			});
			return def;
		};
		
		// Get an item from the store. If no item nothing (null) is returned.
		self.get = function(id) {

			var def = $.Deferred();
					
			self.execute(function(db) { 
				
				try {				
				
					if (id != null) {

						var tx = db.transaction(storeName, "readwrite");
						var store = tx.objectStore(storeName);								
						var req = store.get(id);	
				
						req.onsuccess = function(event) {				
							if (req.result != null)
								def.resolve(req.result);
							else
								def.resolve(null);
						};
						req.onerror = function(event) {
							def.resolve(null);
						};
					} else {
						setTimeout(function() {
							def.resolve(null);
						}, 0);					
					}	
				} catch (err) {
					def.reject(err);
				}
				
			});
			
			return def;
		};
		
		// Iterate over all records 
		self.forEach = function(index, callback) {			

			self.execute(function(db) {
				
				var tx = db.transaction(storeName, "readwrite");
				var store = tx.objectStore(storeName);
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
		
		// Iterate over all records that are inside of a range.
		self.forEachRange = function(index, start, stop, callback) {

			self.execute(function(db) {

				var tx = db.transaction(storeName, "readwrite");
				var store = tx.objectStore(storeName);
				var req = null;
			
				var bound = IDBKeyRange.bound(start, stop);	

				index = store.index(index);
				req = index.openKeyCursor(bound);
				
				req.onsuccess = function(event) {
					if (event !== null && event.target !== null) {
	                    var cursor = event.target.result;
	                    if (cursor != null) {
	                        if (callback !== null)
	                            callback(cursor.key, cursor.primaryKey);
	                        cursor.continue();
	                    }
						else
							callback(null, null);
	                }
	            };												
			});
		};
		
		// Get All records in a store.
		self.getAll = function(index) {
			
			var def = $.Deferred();
			
			var resultArray = [];
			
			self.forEach(index, function(cursor) {
				if (cursor === null)
					def.resolve(resultArray);
				else
					resultArray.push(cursor.value);
			});
			
			return def; // return promise		
		};
		
		// Remove all records from a store.
		self.deleteAll = function() {
		
			var def = $.Deferred();
												
			self.forEach(null, function(cursor) {
				if (cursor === null)
					def.resolve();
				else
					cursor.delete();
			});
			
			return def; // return promise		
		};
		
		// Clear a store.
		self.clear = function() {
		
			var def = $.Deferred();
			
			self.execute(function(db) {

				var tx = db.transaction(storeName, "readwrite");
				var store = tx.objectStore(storeName);			
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
		
		// Return number of records in a store.
		self.count = function() {
			
			var def = $.Deferred();
			
			self.execute(function(db) {
					
				var tx = db.transaction(storeName, "readwrite");
				var store = tx.objectStore(storeName);			
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

    // Return a database context.
	Korben.db = function(initFunction, dbName) {	
		return new Korben.DbWrapper(initFunction, dbName);
	};
	

}) (Korben || (Korben = {}));