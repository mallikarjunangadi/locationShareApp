 var azure = require('azure');
 var DocumentDBClient = require('documentdb').DocumentClient;
 var notificationHubService = azure.createNotificationHubService('sosnotification', 'Endpoint=sb://sosnotificationnamespace.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=7iss0kyJDs+3otw+eovAQ2NkcAp6Nc6s6aaGDPjcF8M=');
 var async = require('async');
 var fs = require('fs');

 function TaskList(taskDao) {
   this.taskDao = taskDao;
 }

 module.exports = TaskList;
 
 TaskList.prototype = {
     showTasks: function (req, res) {
		 var category = req.body.category;
	     var organisationId = req.body.OrgId;
         var self = this;
         console.log('entered show Tasks');
         var querySpec = {
             query: "SELECT * FROM root r where r.DocumentHeader.DocumentType = 'codewhiteitems' AND r.DocumentHeader.OrganizationId = '"+organisationId+"'"
         };
		 
         self.taskDao.find(querySpec, function (err, results) {
             if (err) {
                res.send({"result": "failure"})
                console.log(err);
             }
			 console.log(results);
			 if(results.length!=0){
				 console.log('entered inside if in tasklist');
                 res.send({"Data" : results[0].DocumentBody.ApplicationSpecificData[category]});
			 } else {
				 console.log('entered inside else in tasklist');
				 res.send({});
			 } 
         });
     },

     addTask: function (req, res) {
         var self = this;
         var item = req.body;
		 
		 console.log('entered Complete task', item);
		 
      //   var data = fs.readFileSync('../server/DocumentDBEvents.json');
     
        var data = '{ "DocumentHeader": { "DocumentType": "codewhiteitems", "Author": "Shrey/Gautham", "OrganizationId": "codewhite", '+
		       ' "Datetime": "23523556", "DocumentId": "codewhite", "version": "1" }, ' +
        	   '"DocumentBody": { "ApplicationSpecificData": {"apparels":[], "books":[], "jobs":[], "journals":[], "legal_services":[], "jobs":[], "news":[], "security_services":[], "surgical_equipments":[] } } }'
     
         var newdoc = JSON.parse(data); 
		 
         self.taskDao.addItem(newdoc, function (err, doc) {
             if (err) {
                res.send({"result": "failure"})
                console.log(err);
             }
			 
			 self.taskDao.updateItem(doc, item, function (err, replaced) {                                               
                 if (err) {
                     res.send({"result": "failure"})
                     console.log(err);
                 } else {
				 res.send({"result": "done"}); //"failure"
                  //   res.send(replaced.DocumentBody.ApplicationSpecificData);
                 }
              });
			 
         });
		
     },

     completeTask: function (req, res) {
         var self = this;
		 var item = req.body
		 var organisationId = req.body.OrgId;
		 
		 console.log('entered Complete task', item);
		 
		 var querySpec = {
            query: "SELECT * FROM root r where r.DocumentHeader.DocumentType = 'codewhiteitems' AND r.DocumentHeader.OrganizationId = '"+organisationId+"'"
         };
		 
         self.taskDao.find(querySpec, function (err, results) {
             if (err) {
                 res.send({"result": "failure"})
                  console.log(err);
             }
			 console.log(results[0]);
             if(results.length!=0) {
              self.taskDao.updateItem(results[0], item, function (err, replaced) {                                               
                 if (err) {
                     res.send({"result": "failure"})
                     console.log(err);
                 } else {
					 
					 var data = { "title": "New Notification", "message": "newsfeed from Code White: ", "image": "icon", "channels": "", "docID": "", "additionalData": "" };
                     console.log('template is' + JSON.stringify(data));
                                                  
                     notificationHubService.send(null, data, function (error) {
                       if (!error) {
                         console.warn("Notification successful");
                       }
                     });

                     var template = {
                          alert: 'This is my toast message for iOS!', info: "hey"
                     }

                     notificationHubService.apns.send(null, template, function (error) {
                       if (!error) {
                          console.warn("Notification successful");
                       }
                     });

                     res.send({"result": "done"}); //"failure"
                 }
              });
			 } else {  //if no document exists then create new document
				self.addTask(req, res);
			 } 
         });  
    }
	/*,
	
	editTask: function(req, res){
		console.log("entered edit tasklist"); 
		var self = this;
		var editObj = req.body.myObj;
		var previousObjId = req.body.uId;
		var organisationId = req.body.OrgId;
		
		var item = JSON.parse(editObj);
		console.log(item);
		console.log(previousObjId);
		
		var querySpec = {
             query: "SELECT * FROM root r where r.DocumentHeader.DocumentType = 'codewhiteitems' AND r.DocumentHeader.OrganizationId = '"+organisationId+"'"
         };
		 
        self.taskDao.find(querySpec, function (err, results) {
           if (err) {
             res.send({"result": "failure"})
             console.log(err);
           }
	
		    self.taskDao.editItem(results[0], item, previousObjId, function (err, replaced) {
              if (err) {
                  res.send({"result": "failure"})
                  console.log(err);
              } else {
			     //res.send(replaced.DocumentBody.ApplicationSpecificData);
				 res.send({"result": "done"}); //"failure"
              }				
		    })
	 
	    })	
	},
	
	deleteTask: function(req, res){
		var self = this;
		console.log('enterd delete taskList.. ');
		var eDate = req.body.eDate;
		var eId = req.body.eId;
		var organisationId = req.body.OrgId;
		console.log(eDate);
		console.log(eId);
		
		var querySpec = {
             query: "SELECT * FROM root r where r.DocumentHeader.DocumentType = 'codewhiteitems' AND r.DocumentHeader.OrganizationId = '"+organisationId+"'"
         };

         self.taskDao.find(querySpec, function (err, results) {
             if (err) {
			     res.send({"result": "failure"})
                 console.log(err);
             } else {
			
	        	 self.taskDao.deleteItem(results[0], eDate, eId, function (err, replaced) {
				   if (err) {
				     res.send({"result": "failure"})
                     console.log(err);
                   } else {
                     //res.send(replaced.DocumentBody.ApplicationSpecificData);
					 res.send({"result": "done"}); //"failure"
				   }					
			     })
		  
		     }
		 })	
	}
 */
 };