//The MIT License (MIT)
//Copyright (c) 2013 Chad Michel
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Korben;
(function(Korben) {
	
	// Wraps access to an IndexedDB database.
	// You will end accessing a store from this object.
	// db.store("notes");
	Korben.DbWrapper = function(initFunction, dbName) {
	
		this.store = function(storeName) {
			return new Korben.StoreWrapper(initFunction, dbName, storeName);					
		};
	};
	
	// Wraps access to an IndexedDb store.
	// Stores provide access to store related functions,
	// such as put, get, getAll, forEach...
	Korben.StoreWrapper = function(initFunction, dbName, storeName) {
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
		this.execute = function(callback) {

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
		this.put = function(object) {
			
			var def = $.Deferred();
		
			this.execute(function(db) { 
				
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
		this.get = function(id) {

			var def = $.Deferred();
					
			this.execute(function(db) { 
				
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
		this.forEach = function(params) {			

			this.execute(function(db) {
				
				try {
					var tx = db.transaction(storeName, "readwrite");
					var store = tx.objectStore(storeName);
					var req = null;
			
					if (params.index == null || params.index.length == 0)
						req = store.openCursor();
					else {
						index = store.index(params.index);
						req = index.openKeyCursor();
					}
				
					req.onsuccess = function(event) {
						if (event !== null && event.target !== null) {
		                    var cursor = event.target.result;
		                    if (cursor !== null) {
		                        if (params.callback != null)
		                            params.callback(cursor);
		                        cursor.continue();
		                    }
							else {
								if (params.callback != null)
									params.callback(null);
								if (params.last != null)
									params.last();		
							}
		                }
		            };
				
					req.onerror = function(event) {
						params.error(event);
					};
					
				} catch (err) {
					if (params.error != null)
						params.error(err);
				}
			});
		};
		
		// Iterate over all records that are inside of a range.
		this.forEachRange = function(params) {

			//	index, start, stop, callback		

			this.execute(function(db) {

				var tx = db.transaction(storeName, "readwrite");
				var store = tx.objectStore(storeName);
				var req = null;
			
				var bound = IDBKeyRange.bound(params.start, params.stop);	

				index = store.index(params.index);
				req = index.openKeyCursor(bound);
				
				req.onsuccess = function(event) {
					if (event !== null && event.target !== null) {
	                    var cursor = event.target.result;
	                    if (cursor != null) {
	                        if (params.callback !== null)
	                            params.callback(cursor.key, cursor.primaryKey);
	                        cursor.continue();
	                    }
						else
							params.callback(null, null);
	                }
	            };												
			});
		};
		
		// Get All records in a store.
		this.getAll = function(index) {
			
			var def = $.Deferred();
			
			var resultArray = [];			
			
			this.forEach({
				index: index,
				callback: function(cursor) {
						if (cursor != null)
							resultArray.push(cursor.value);
					},
				last: function() {
						def.resolve(resultArray);
					}
			}); 		
			
			return def; // return promise		
		};
		
		// Remove all records from a store.
		this.deleteAll = function() {
		
			var def = $.Deferred();
												
			this.forEach({
				index: null,
				callback: function(cursor) {
					if (cursor === null)
						def.resolve();
					else
						cursor.delete();
					}
			});
			
			return def; // return promise		
		};
		
		// Clear a store.
		this.clear = function() {
		
			var def = $.Deferred();
			
			this.execute(function(db) {

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
		this.count = function() {
			
			var def = $.Deferred();
			
			this.execute(function(db) {
					
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