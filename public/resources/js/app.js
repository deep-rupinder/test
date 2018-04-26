var app = angular.module('products', []);
app.controller('productCTRL', function ($scope, $http) {
    $scope.loader = {
        loading: false
    }; 
    $scope.showCreateForm = function () {
        $scope.clearForm();
        $('#modal-product-title').text('ADD NEW PRODUCT');
        $('#btn-update-product').hide();
        $('#btn-create-product').show();

    };
	  $scope.showCreateForm1 = function () {
        $scope.clearForm();
        $('#modal-product-title').text('SEARCH PRODUCT');
        $('#btn-update-product').hide();
        $('#btn-create-product').show();

    };
//to clear values from form
    $scope.clearForm = function () {
        $scope.id = "";
        $scope.name = "";
        $scope.description = "";
        $scope.price = "";
        $scope.modalstatustext = "";
    };
	
	  $scope.clearForm1 = function () {
        $scope.name = "";
        $scope.description = "";
        $scope.price = "";
        $scope.modalstatustext = "";
    };
	
	
    $scope.hideFormFields = function () {
        $('#form-dinminder').hide();
    };  
	
	
    $scope.showFormFields = function () {
        $('#form-dinminder').show();
    };
	
	
	//to show all products
    $scope.getAll = function () {
        $scope.loader.loading = true;
        $http.get("api/list")
            .success(function (response) {
                if (response.error === 2) {
					$scope.statustext = "There are currently no products available!";
					$scope.loader.loading = false;
				} else {
					$scope.names = response.products;
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "There was an error fetching data, please check database connection!";
            });
    };
	
	
	//to show products in customer cart
	 $scope.getAll1 = function () { 
        $scope.loader.loading = true; 
        $http.get("api/list2")
            .success(function (response) {
                if (response.error === 2) {
					$scope.statustext = "There are currently no products available!";
					$scope.loader.loading = false;
				} else {
					$scope.names = response.products;
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "There was an error fetching data, please check database connection!";
            });
    };
	
//to generate total bill	
  $scope.calc = function () {		
        $http.get('api/calc') 
            .success(function (data, status, headers, config) {
				$scope.val=data.product[0].val;
				     $scope.getAll1();
				
            })
            .error(function (data, status, headers, config) {    
            });
    };  
	
	//to go to bill page
	 $scope.bill = function () {		
        $http.get('/bill') 
            .success(function (data, status, headers, config) {
				     $scope.getAll1();
				
            })
            .error(function (data, status, headers, config) {    
            });
    };
	
	 $scope.back = function () {		
        $http.get('/') 
            .success(function (data, status, headers, config) {
				     $scope.getAll1();
				
            })
            .error(function (data, status, headers, config) {    
            });
    };
	
	// to select a particular product
    $scope.readOne = function (id) {
        $scope.clearForm();
        $scope.hideFormFields();
        $('#modal-product-title').text("Edit PRODUCT");
        $('#btn-update-product').show();
        $('#btn-create-product').hide(); 
        $scope.loader.loading = true;
        $http.get('api/list1?id=' + id)
            .success(function (data, status, headers, config) {
                $scope.showFormFields();
                $scope.id = data.product[0].id;
                $scope.name = data.product[0].name;
				$scope.code = data.product[0].code;
                $scope.gst = data.product[0].gst;
                $scope.price = data.product[0].price;
                $('#myModal').modal('show');
                $scope.loader.loading = false;
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "There was an error fetching data for"+id;
            });
    };
	
	
	//to alter quantity that was selected before
	$scope.readOne1 = function (id) {
        $scope.clearForm();
        $scope.hideFormFields();
        $('#modal-product-title').text("Edit QUANTITY");
        $('#btn-update-product').show();
        $('#btn-create-product').hide(); 
        $scope.loader.loading = true;
        $http.get('api/list22?id=' + id)
            .success(function (data, status, headers, config) {
                $scope.showFormFields();
                $scope.id = data.product[0].id;
                $scope.name = data.product[0].name;
				$scope.code = data.product[0].code;
                $scope.gst = data.product[0].gst;
                $scope.qty = data.product[0].qty;
                $('#myModal').modal('show');
                $scope.loader.loading = false;
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "There was an error fetching data for"+id;
            });
    };

    //to insert product to database
    $scope.createProduct = function () {
        $scope.loader.loading = true;
         $http.get("/api/insert?name="+$scope.name+"&code="+ $scope.code+"&price="+$scope.price+"&gst="+$scope.gst)
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };
	
	//to insert product from user's cart to tempary database
	$scope.createProduct1 = function () {
        $scope.loader.loading = true;
         $http.get("/api/search?name="+$scope.name+"&code="+ $scope.code+"&qty="+$scope.qty)
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll1();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };
	
	// to update product infomation
    $scope.updateProduct = function () {    
        $scope.loader.loading = true;
        $http.get("/api/update?id="+$scope.id+"&name="+$scope.name+"&code="+ $scope.code+"&price="+$scope.price+"&gst="+$scope.gst)   
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };
	
	 $scope.updateProduct1 = function () {     
        $scope.loader.loading = true;
        $http.get("/api/update1?id="+$scope.id+"&qty="+$scope.qty)
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll1();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };

    //to delete product from main database
    $scope.deleteProduct = function (id) {
        $scope.loader.loading = true;
        $http.get('/api/delete?id='+id) 
            .success(function (data, status, headers, config) {
                $('#confirm' + id).modal('hide');
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Unable to delete data!";
                $scope.getAll();
            });
    };
	
	//to go to billing page
	
	
	//to delete product from user cart
	 $scope.deleteProduct1 = function (id) {
        $scope.loader.loading = true;
        $http.get('/api/delete1?id='+id)   
            .success(function (data, status, headers, config) {
                $('#confirm' + id).modal('hide');
                $scope.getAll1();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Unable to delete data!";
                $scope.getAll1();
            });
    };

});