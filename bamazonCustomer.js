var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

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
    //   console.log("connection ID is: "+connection.threadId);
      bamazonCustomer();
  })

  //*********************** Main Bamazon Function ******************************//
  function bamazonCustomer(){
      const query = "Select * FROM products"
      connection.query(query, function(err, result){
          if (err) throw err;
          //************ Asking user to select the product they would like to buy *****************//
          inquirer.prompt([
              {
                message: "Enter the item ID of the Product you would like to buy",
                name: "item_choices",
                type: "rawlist",
                choices: function(){
                      var itemChoices = [];
                      for(var i=0; i<result.length; i++){
                          itemChoices.push(result[i].product_name);                          
                        }
                        console.log("------------------------------------------------------------------------\n");
                        console.table(result);
                        console.log("------------------------------------------------------------------------\n");
                        return itemChoices;
                    },
              },
              {
                  message: "How many quantity would you like to buy?",
                  type: "input",
                  name:"product_quantity"
              }
          ]).then(function(answer){
              for(var j=0; j<result.length; j++){
                  //************ taking user answer and matching with inventory count ***************//
                  if(answer.item_choices === result[j].product_name){
                      if((answer.product_quantity) <= result[j].stock_quantity){
                            completeOrder();  // if inventory is sufficient then call completeOrder function
                            newOrder();  // Calls the newOrder function to ask user if they want to place new order
                      }
                      else{
                            console.log("Insufficient quantity");      
                            newOrder()                                            
                      }
                      //*********** Function to place a new Order ***********//
                      function newOrder(){
                        inquirer.prompt([
                            {
                                message: "Would you like to place another order (select the number)?",
                                type: "rawlist",
                                name: "newOrder",
                                choices:["Yes", "No"]
                            }
                        ]).then(function(response){
                            if(response.newOrder === "Yes"){
                                bamazonCustomer(); //If the response is Yes then calls the Bamazon function
                            }else{
                                connection.end();
                            }
                        })
                      }
                      //************* Function for completing Order and updating inventory **************//
                      function completeOrder(){
                            var itemQuantity = result[j].stock_quantity;
                            var itemName = result[j].product_name;
                            var userQuantity = parseInt(answer.product_quantity);
                            var itemPrice = result[j].price;
                            connection.query("UPDATE products SET ? WHERE ?",[
                                {
                                    stock_quantity: itemQuantity - userQuantity
                                },
                                {
                                    product_name: itemName
                                }
                            ])
                            console.log("Your Total is: "+ (userQuantity*itemPrice));
                      }
                  }
              }

          })
      })
  }