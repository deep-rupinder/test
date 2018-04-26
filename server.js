var Hapi = require('hapi');
var Path = require('path');
var mysql  = require('mysql');
var server = new Hapi.Server();

server.connection({ 
  port: 8001 
});

//connecting to database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'user123',
  database : 'db',
  
});

//for including static files i.e css and js
server.register(require('inert'), (err) => {

  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });
   server.start(function(){console.log('server is running');});
});


//test for checking routing
 server.route({
    path: '/aaa',
    method: 'GET',
    handler(req, reply) {
        reply('Welcome to HapiJs!!');
    }
});

//to select all products from gst table
server.route({
    method: 'GET',
    path: '/api/list',
    handler: function (request, reply) {
			var data = {
        "error": 1,
        "products": ""
    };
       connection.query('SELECT * from gst',
       function (error, results, fields) {
       if (error) throw error;
		data["products"]=results;
       reply(data);
    });
  }
});

//temparary database that store products present in cart of customer
server.route({
    method: 'GET',
    path: '/api/list2',
    handler: function (request, reply) {
			var data = {
        "error": 1,
        "products": ""
    };
       connection.query('SELECT * from temp',
       function (error, results, fields) {
       if (error) throw error;
		data["products"]=results;
       reply(data);
    });
  }
});

//reply product corresponding to a particular id
server.route({
    method: 'GET',
    path: '/api/list1',
    handler: function (req, reply) {
	var id = req.query.id;
	//reply.file('aaa');
	var data = {
        "error": 1,
        "product": ""
    };
	console.log(id);
	connection.query('SELECT * from gst WHERE id = ?', id, function (err, rows, fields) {
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["product"] = rows;
				reply(data);
			} else {
				data["product"] = 'No product Found..';
				console.log('Error while performing Query: ' + err);
				reply(data);
			}
		});
	

}});
//reply product corresponding to a particular id(for tempary table)
server.route({
    method: 'GET',
    path: '/api/list22',
    handler: function (req, reply) {
	var id = req.query.id;
	//reply.file('aaa');
	var data = {
        "error": 1,
        "product": ""
    };
	console.log(id);
	connection.query('SELECT * from temp WHERE id = ?', id, function (err, rows, fields) {			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["product"] = rows;
				reply(data);
			} else {
				data["product"] = 'No product Found..';
				
				console.log('Error while performing Query: ' + err);
				reply(data);
			}
		});
	

}});

//delete product from database
server.route({
    method: 'GET',
    path: '/api/delete',
    handler: function (req, reply) {
	var id = req.query.id;
	var data = {
        "error": 1,
        "product": ""
    };
console.log(id);
connection.query("DELETE FROM gst WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error deleting data";
					console.log(err);
					//log.error(err);
				} else {
					data["product"] = 0;
					data["product"] = "Delete product Successfully";
					console.log("Deleted: " + id);
					//log.info("Deleted: " + id);
				}
				reply(data);
			});
	

}});

//delete product from temparary table
server.route({
    method: 'GET',
    path: '/api/delete1',
    handler: function (req, reply) {
	var id = req.query.id;
	var data = {
        "error": 1,
        "product": ""
    };
	console.log(id);
connection.query("DELETE FROM temp WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error deleting data";
					console.log(err);
					//log.error(err);
				} else {
					data["product"] = 0;
					data["product"] = "Delete product Successfully";
					console.log("Deleted: " + id);
					//log.info("Deleted: " + id);
				}
				reply(data);
			});
}});

//update product information
server.route({
    method: 'GET',
    path: '/api/update',
    handler: function (req, reply) {
    var id = req.query.id;
    var code = req.query.code;
	var price = req.query.price;
    var gst = req.query.gst;
    var name = req.query.name;
    var data = {
        "error": 1,
        "product": ""
    };
    if (!!id && !!name && !!code&&!!gst && !!price) {
	
			connection.query("UPDATE gst SET name = ?, code = ?, price = ?,gst= ? WHERE id=?",[name, code, price,gst,id], function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error Updating data";
					console.log(err);
				} else {
					data["error"] = 0;
					data["product"] = "Updated product Successfully";
					console.log("Updated: " + [id, name, code, price,gst]);
				}
				reply(data);
			});
		   } else {
        data["product"] = "Please provide all required data (i.e : id, name, desc, price)";
        reply(data);
    }
	}});
	
	//update quantity in temporary table if user change quantity
	server.route({
    method: 'GET',
    path: '/api/update1',
    handler: function (req, reply) {
    var id = req.query.id;
    var qty = req.query.qty; 
    console.log(qty);
    var data = {
        "error": 1,
        "product": ""
    };
    if (!!id&&!!qty) {
			connection.query("UPDATE temp SET qty= ? WHERE id=?",[qty,id], function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error Updating data";
					console.log(err);
				} else {
					data["error"] = 0;
					data["product"] = "Updated product Successfully";
					
			
				}
				reply(data);
			});
		   } else {
        data["product"] = "Please provide all required data (i.e : id, name, desc, price)";
        reply(data);
    }
	}});
	
	//add a new product to database
	server.route({
    method: 'GET',
    path: '/api/insert',
    handler: function (req, reply) {
    
    var code = req.query.code;
	var price = req.query.price;
    var gst = req.query.gst;
   var name = req.query.name;

	console.log(name);
	console.log(price);
	console.log(gst);
	console.log(code);
	//console.log(description);
    var data = {
        "error": 1,
        "product": ""
    };
    if (!!name && !!code&&!!gst && !!price) {
			connection.query("INSERT INTO gst SET name = ?, code = ?, price = ?,gst=?",[name, code, price,gst], function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error Updating data";
					console.log(err);
				} else {
					data["error"] = 0;
					data["product"] = "Updated Book Successfully";
					console.log("Updated: " + [ name, code, price]);
				}
				reply(data);
			});
		   } else {
        data["product"] = "Please provide all required data (i.e : id, name, desc, price)";
        reply(data);
    }
	}});
	
	//to search a product
	server.route({
    method: 'GET',
    path: '/api/search',
    handler: function (req, reply) {
    var code = req.query.code;
   var name = req.query.name;
	var qty=req.query.qty;
	console.log(name);
	console.log(code);
	console.log(qty);
	//console.log(description);
    var data = {
        "error": 1,
        "product": ""
    };
    if (!!name) {
	console.log("from name");
			connection.query("select * from gst where name = ?",[name], function (err, rows, fields) {
				if (!!err) {
					//data["product"] = "Error finding product data";
					console.log(err);
				} 
				else {
					//data["error"] = 0;
					data["product"] = rows;
					connection.query("INSERT INTO temp SET id =? ,qty=?,name=?,price=?,gst=?,code=?",[data.product[0].id,qty,data.product[0].name,data.product[0].price,data.product[0].gst,data.product[0].code]);
					console.log("Updated: " + [ name, code]);
				
				}
				reply(data);
			});
		   } 
		   else if(!!code)
		   {	console.log("from code");
			   
			   connection.query("select * from gst where code = ?",[code], function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error finding product data";
					console.log(err);
				}
				else {
					data["error"] = 0;
					
					data["product"] = rows;
					connection.query("INSERT INTO temp SET id =? ,qty=?,name=?,price=?,gst=?,code=?",[data.product[0].id,qty,data.product[0].name,data.product[0].price,data.product[0].gst,data.product[0].code]);
					console.log("inserted: " + [data.product[0].name ]);
			
				}
				reply(data);
			});
		   }
			   
		   else {
        data["product"] = "Please provide all required data (i.e : id, name, desc, price)";
        reply(data);
    }
	}});
	//render main page
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply.file('./public/index.html');

    }
});

//to generate total bill
server.route({
    method: 'GET',
    path: '/api/calc',
    handler: function(request, reply) {
	  var data = {
        "error": 1,
        "product": ""
    };
	
     connection.query("select (sum(price*qty)+sum(price*qty*gst/100)) as val from temp", function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error finding product data";
					console.log(err);
				} 
				
					
				else {
					data["error"] = 0;
					
					data["product"] = rows;
					connection.query("truncate table temp");
					console.log(data.product[0])
					
			
				}
				reply(data);

    })
}});


//to render billing page
server.route({
    method: 'GET',
    path: '/bill',
    handler: function(request, reply) {
		console.log("inside index2");
        reply.file('./public/index2.html');

    }
});