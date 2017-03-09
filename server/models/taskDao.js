var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');
 
  function TaskDao(documentDBClient, databaseId, collectionId) {
   this.client = documentDBClient;
   this.databaseId = databaseId;
   this.collectionId = collectionId;

   this.database = null;
   this.collection = null;
 }


 TaskDao.prototype = {
     init: function (callback) {
         var self = this;

         docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
             if (err) {
                 callback(err);
             } else {
                 self.database = db;
                 docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                     if (err) {
                         callback(err);

                     } else {
                         self.collection = coll;
                     }
                 });
             }
         });
     },
 
     find: function (querySpec, callback) {
         var self = this;

         self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
             if (err) {
				 console.log('Find dao error')
                 callback(err);

             } else {
				 console.log('entered........ task DAO find');
				 console.log(results);
                 callback(null, results);
             }
         });
     },

     addItem: function (item, callback) {
         var self = this;
   
         console.log('entered........ task DAO Add');
  
         self.client.createDocument(self.collection._self, item, function (err, doc) {
             if (err) {
                 callback(err, null);

             } else {
                 callback(null, doc);
             }
         });
     },
	 
	 editItem: function (doc, item, uId, callback) {
        var self = this;
   
        console.log('entered........ task DAO edit');
  
	    //var eDateKey = item.eventDate.replace(/ /g, '_'); 
		var eDateKey = item.eventDate; 
        console.log(eDateKey);
		
		if(doc.DocumentBody.ApplicationSpecificData[eDateKey] != undefined) {	  
			  var eventsArr = doc.DocumentBody.ApplicationSpecificData[eDateKey].events;
			  console.log(eventsArr); 
			  console.log(uId);
				
				  for(var i=0; i<eventsArr.length; i++){   //to add editing object to specific index
					  var eObj = eventsArr[i];
				  	  if(eObj.eventId === uId) {
						  console.log('matched in if ........');
  						  eventsArr.splice(i,1, item);
						  break;
					  }
				  }
				  
				  var eventIndexArr = doc.DocumentBody.ApplicationSpecificData['EventIndex'];
				  for(var i=0; i<eventIndexArr.length; i++){   //to add editing object to specific index
					  var eObj = eventIndexArr[i];
				  	  if(eObj.ID === uId) {
						  console.log('matched in eventIndex if ........');
						  var tempObj = {Date:item.eventDate, ID:item.eventId}
  						  eventIndexArr.splice(i,1, tempObj);
						  break;
					  }
				  }
			  doc.DocumentBody.ApplicationSpecificData[eDateKey].events = eventsArr; 
			  doc.DocumentBody.ApplicationSpecificData['EventIndex'] = eventIndexArr; 
			 
             self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, replaced);
                }
              }); 
		} else {
			callback(null, doc);
		}	  
     },
			 
	 updateItem: function (doc, newItem, callback) {
         var self = this;
            
				 console.log('entered update DAO....');
				 console.log(newItem);
				 var pcategory = newItem.pcategory;
				 doc.DocumentBody.ApplicationSpecificData[pcategory].push(newItem);
				
				 self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                     if (err) {
                         callback(err);

                     } else {
                         callback(null, replaced);
                     }
                 });  
             
     },
	 
	 deleteItem: function(doc, date, uId, callback) {
		 var self = this;
		 
				//var eDateKey = date.replace(/ /g, '_'); 
				var eDateKey = date; 
				console.log(eDateKey);
			    if(doc.DocumentBody.ApplicationSpecificData[eDateKey] != undefined) { 
				  var eventsArr = doc.DocumentBody.ApplicationSpecificData[eDateKey].events;
				 
				  for(var i=0; i<eventsArr.length; i++){
					  var eObj = eventsArr[i];
				  	  if(eObj.eventId === uId) {
						 eventsArr.splice(i, 1);
						 break;
					  }
				  }
				  doc.DocumentBody.ApplicationSpecificData[eDateKey].events = eventsArr;
				  
				  var eventIndexArr = doc.DocumentBody.ApplicationSpecificData['EventIndex'];
				  for(var i=0; i<eventIndexArr.length; i++){
					  var eObj = eventIndexArr[i];
				  	  if(eObj.ID === uId) {
						 eventIndexArr.splice(i, 1);
						 break;
					  }
				  }
				  doc.DocumentBody.ApplicationSpecificData['EventIndex'] = eventIndexArr;
				 
				  var eventsArrLen = doc.DocumentBody.ApplicationSpecificData[eDateKey].events.length;
				  if(eventsArrLen == 0) {
				    delete doc.DocumentBody.ApplicationSpecificData[eDateKey];
				  }
			    } 
		         self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                     if (err) {
                         callback(err);

                     } else {
                         callback(null, replaced);
                     }
                 });
    			 
     }       
     

 /*    getItem: function (itemId, callback) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.id = @id',
             parameters: [{
                 name: '@id',
                 value: itemId
             }]
         };

         self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
             if (err) {
                 callback(err);

             } else {
                 callback(null, results[0]);
             }
         });
     }    */
 
 }
  module.exports = TaskDao;
