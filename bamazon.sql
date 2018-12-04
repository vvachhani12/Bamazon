CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(255),
    department_name VARCHAR(255),
    price DECIMAL(65,2),
    stock_quantity INT(65),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Xbox","Electronics",350,10);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("iPhone 6","Electronics",250,50);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("iPhone 8","Electronics",650,100);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Addidas Yeezey","Footwear",550,20);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Levis Jeans","Apparel",50,80);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("TV Stand","Furniture",350,10);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Bose Wireless Headphones","Electronics",350,15);

