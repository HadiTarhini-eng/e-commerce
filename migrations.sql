ALTER TABLE orders 
ADD COLUMN Date VARCHAR(255);

ALTER TABLE orders 
CHANGE COLUMN status statusID int

CREATE TABLE lookup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

ALTER TABLE orderhistory
CHANGE COLUMN status statusID int

ALTER TABLE orders 
add COLUMN  totalPriceWithDel int

ALTER TABLE orders 
add COLUMN  deliveryCost int

alter table productData 
change column poductID productID int

ALTER TABLE orders
DROP COLUMN LastName;

ALTER TABLE orders 
change COLUMN fisrtName name VARCHAR(255);

ALTER TABLE orders 
ADD COLUMN city VARCHAR(255);

ALTER TABLE orders 
ADD COLUMN address VARCHAR(500);

ALTER TABLE orders
ADD COLUMN gift BOOLEAN DEFAULT FALSE;

ALTER TABLE orders
ADD COLUMN note varchar(1000);

ALTER TABLE orders
ADD COLUMN email varchar(255);
