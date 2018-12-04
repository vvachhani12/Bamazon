var inquirer = require("inquirer");
const cTable = require('console.table');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
 
    // Your port; if not 3306
    port: 3306,
 
    // Your username
    user: "root",
 
    // Your password
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err){
      if (err) throw err;
      bamazonManager();
  })

  function bamazonManager(){
      inquirer.prompt([
          {
            message: "Select the option from the menu",
            name: "menu",
            type: "rawlist",
            choices:[
                "View Product Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
          }
      ]).then(function(answer){
          console.log(answer.menu);
          var menuChoice = answer.menu;

          switch(menuChoice){
            case "View Product Sale":
                productSale();
                break;
            
            case "View Low Inventory":
                lowInventory();
                break;
            
            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                newProduct();
                break;
          }
        })
        function productSale(){
            var productQuery = "SELECT * FROM products";
            connection.query(productQuery, function(err, res){
                if (err) throw err;

                console.log("\n-----------------------------------------------------------\n");
                console.table(res);
                // console.log("\n-----------------------------------------------------------\n");
                // for(var i=0; i<res.length; i++){
                //     console.log(res[i].item_id+" "+res[i].product_name+" "+res[i].department_name+" "+res[i].price+" "+res[i].stock_quantity);
                //     // prodArray.push(res[i].item_id+" "+res[i].product_name+" "+res[i].department_name+" "+res[i].price+" "+res[i].stock_quantity);
                // }
                console.log("\n-----------------------------------------------------------\n")
                bamazonManager();
            })
        }

        function lowInventory(){
            var lowInv = "SELECT * FROM products WHERE stock_quantity < 6"
            connection.query(lowInv, function(err, res){
                if (err) throw err;
                console.log("\n-----------------------------------------------------------\n")
                console.table(res);
                // for(var i=0; i<res.length; i++){
                //     console.log(res[i].item_id+" "+res[i].product_name+" "+res[i].department_name+" "+res[i].price+" "+res[i].stock_quantity);
                // }
                console.log("\n-----------------------------------------------------------\n");
                bamazonManager();
            })
        }

        function addInventory(){
            inquirer.prompt([
                {
                   name: "addInv",
                   type: "rawlist",
                   message: "Would you like to add to Inventory?",
                   choices:["Yes", "No"]
                }
            ]).then(function(result){
                if(result.addInv === "Yes"){
                    connection.query("SELECT * FROM products", function(err, result){
                        // console.log(result);
                        if(err) throw err;
                        inquirer.prompt([
                            {
                                name: "Inv",
                                type: "list",
                                message: "Choose the product whose inventory you would like to increase",
                                choices: function(){
                                    var itemChoices = [];
                                    for(var i=0; i<result.length; i++){
                                    itemChoices.push(result[i].product_name);                          
                                    }
                                    return (itemChoices);
                                }
                            },
                            {
                                name: "InvResponse",
                                type: "input",
                                message: "Enter the inventory quantity: "
                            }
                        ]).then(function(answer){
                            console.log("\n-----------------------------------------------------------\n")

                            updateInv(answer)
                            console.log("Inventory successfully added");
                            showTable();
                        })

                        function updateInv(answer){
                            for(var j=0; j<result.length; j++){
                                if(answer.Inv === result[j].product_name){
                                    var Inv = answer.Inv;
                                    var InvQuantity = parseInt(answer.InvResponse);
                                    var currentInv = parseInt(result[j].stock_quantity);
                                    var invName = result[j].product_name;
                                    connection.query("UPDATE products SET ? WHERE ?", [
                                        {
                                            stock_quantity: currentInv+InvQuantity
                                        },
                                        {
                                            product_name: invName
                                        }
                                    ]);
                                }
                            }
                        }
                    })
                }else{
                    console.log("\n-----------------------------------------------------------\n");
                    bamazonManager();
                }
            })
        }

        function newProduct(){
            inquirer.prompt([
                {
                    name: "newProd",
                    type: "input",
                    message: "Enter the new product name:"
                },
                {
                    name: "prodDepartment",
                    type: "input",
                    message: "Enter the new product department:"
                },
                {
                    name: "prodPrice",
                    type: "input",
                    message: "Enter the new product price:"
                },
                {
                    name: "prodQuantity",
                    type: "input",
                    message: "Enter the new product quantity:"
                }
            ]).then(function(result){
                // console.log(result);
                addNewProduct(result);
            })
        }

        function addNewProduct(result){
            var newQuery = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ('"+
            result.newProd+"','"+result.prodDepartment+"','"+result.prodPrice+"','"+result.prodQuantity+"')";
            // console.log(newQuery);
            connection.query(newQuery, function(err, response){
                if(err) throw err;
                console.log("\n-----------------------------------------------------------\n")
                console.log("New Product successfully added");
                showTable();
            })
        }

        function showTable(){
            var productQuery = "SELECT * FROM products";
            connection.query(productQuery, function(err, res){
                if (err) throw err;

                console.log("\n-----------------------------------------------------------\n");
                console.table(res);                
                console.log("\n-----------------------------------------------------------\n")
                bamazonManager();

            })
        }
  }