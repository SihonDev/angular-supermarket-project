-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: supermarket
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total` int NOT NULL,
  `cart_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `cart_item_product_id` (`product_id`) /*!80000 INVISIBLE */,
  KEY `FK_cart_item_cart_id_idx` (`cart_id`),
  CONSTRAINT `FK_cart_item_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cart_item_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (307,35,1,4,147),(308,37,2,8,147),(309,38,1,3,147),(310,32,2,4,148),(311,35,1,4,149),(312,33,2,4,149),(313,35,1,4,150),(314,35,3,12,151),(315,34,1,2,152),(316,35,2,8,153),(317,35,1,4,154),(318,33,1,2,154);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) NOT NULL,
  `created_date` date DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (147,'223435675','2021-07-16',0),(148,'223435675','2021-07-16',0),(149,'223435675','2021-07-16',0),(150,'223435675','2021-07-16',0),(151,'223435675','2021-07-16',0),(152,'223435675','2021-07-16',0),(153,'223435675','2021-07-16',0),(154,'223435675','2021-07-16',1);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Milk and Eggs'),(2,'Vegetables and Fruits'),(3,'Meat and Fish'),(4,'Wine and Drinks');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `cart_id` int NOT NULL,
  `price` int NOT NULL,
  `city` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `shipe_date` date NOT NULL,
  `order_date` date NOT NULL,
  `credit_card` int NOT NULL,
  `reciept` varchar(999) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_order_user_id_idx` (`user_id`),
  KEY `order_cart_id` (`cart_id`),
  CONSTRAINT `FK_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_order_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (64,223435675,147,0,'Tel-Aviv','gefen street 26','2021-06-22','2021-06-16',5776,'recieptForCart_64_CustomerId_223435675_ShippingDate_22-07-2021.txt'),(65,223435675,148,0,'Tel-Aviv','gefen street 26','2021-07-07','2021-07-01',8788,'recieptForShoppingCart_65_CustomerId_223435675_ShippingDate_27-07-2021.txt');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(255) NOT NULL,
  `categoryId` int NOT NULL,
  `price` int NOT NULL,
  `pictureRoute` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `product_category` (`categoryId`) /*!80000 INVISIBLE */,
  CONSTRAINT `FK_product_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (32,'Sour Cream',1,2,'6b2bf54c-60fd-4fbe-9453-73cb6f76e256.jpg'),(33,'Parmesan & Romano',1,2,'d6e45ed8-9917-4d55-a4b5-7e81eeff60db.jpg'),(34,'Ricotta',1,2,'cd2a89a3-a213-4cac-8719-4dbecfb8316b.jpg'),(35,'Skim Milk',1,4,'b0fb3b70-5fa6-4c2c-9afc-c397441f1a35.jpg'),(36,'Yogurt',1,2,'a47375ef-0033-41fd-abc4-0b2d05e66fd7.jpg'),(37,'Mozzarella',1,4,'e927dcb5-8368-4659-be54-f6b9de835006.jpg'),(38,'Milk',1,3,'399911f2-9ef8-440a-a182-73aabf34ba66.jpg'),(39,'Margarine Bowl',1,4,'d24236b9-636f-4e41-a7c2-0ccaa450e9df.jpg'),(40,'Macchiato Creamer',1,3,'1d2c5153-b9fa-492b-b3ae-16239fe6fa78.jpg'),(41,'Brie',1,2,'59a7b401-ccb6-4dad-a81f-a87bf805313b.jpg'),(42,'Coffee Creamer',1,3,'4744d641-b2a6-4622-8903-485f1c4e5748.jpg'),(43,'Cottage Cheese',1,5,'fe08ac6a-c2b3-446a-89b4-4e033dd030b1.jpg'),(44,'Cream Cheese',1,2,'05006463-6619-4de9-af74-526600d05b6c.jpg'),(45,'Creamer Hazelnut',1,3,'4eea5ef7-887e-4a5b-8353-8b5da5c01505.jpg'),(46,'Crumbled Cheese',1,4,'47378235-6ba4-4a5c-ba69-7eeac15c885d.jpg'),(47,'Egg Substitutes',1,2,'fc2f28d0-e52c-4446-8d28-658e86ecf2d4.jpg'),(48,'Eggs',1,3,'b43932e8-3ed1-4142-8b79-64132e8b98ed.jpg'),(49,'Ghee Butter',1,5,'62436297-2120-4a7a-b309-a997bbd70f26.jpg'),(50,'Havarti',1,2,'033d3893-2a95-47b2-9f84-48678d359065.jpg'),(51,'Large  Eggs',1,4,'99a5c781-0fb7-4d66-906b-1f67fa147eb6.jpg'),(52,'Kale',2,2,'76fc29d2-0df6-44d9-bcad-5215c502de35.jpg'),(53,'Green Beans',2,3,'b0f6981a-077d-4c56-a421-b2be6de602c5.jpg'),(54,'Ginger',2,4,'5c6065a3-5a27-4613-b10d-6bc15ab72a07.jpg'),(55,'Garlic',2,2,'3fd61438-413d-4579-a64f-e0833633fb35.jpg'),(56,'Cucumber',2,3,'35864414-a772-4d35-8765-7f4d90cb5fa4.jpg'),(57,'Cauliflower',2,5,'91c1601d-fec5-46c5-b508-aad38e493745.jpg'),(58,'Carrots',2,3,'20e9a1c8-b2de-42d7-83ce-2ff85d5d0d11.jpg'),(59,'Broccoli',2,4,'5016dbb6-0dd3-4e91-aeb0-1861f2006369.jpg'),(60,'Basil',2,2,'cddb0d8d-e199-4331-8258-a61065cf6a87.jpg'),(61,'Bananas',2,4,'826d60d1-0c50-4ed4-b3ce-12f0ab2ba051.jpg'),(62,'Avocado',2,3,'69e0cf4e-37e2-4bf6-a923-8933de82d774.jpg'),(63,'Zucchini',2,3,'158ca3fa-91e6-46ba-9e89-0a7442b1df29.jpg'),(64,'Watermelon',2,2,'8283ce74-7c2a-4aa2-8ff3-1a0a196d0807.jpg'),(65,'Tomato',2,3,'5b57d789-ac79-4b4d-9bf1-c4aef1d0be07.jpg'),(66,'Red Plum',2,5,'f462a655-4a7b-449c-9f0d-83f8bf2795ea.jpg'),(67,'Red Pepper',2,2,'716b7558-6337-4a4d-8080-00c9ee0e426b.jpg'),(68,'Peach',2,3,'2429d636-b539-493b-a6fe-87322a11bc4b.jpg'),(69,'Melon',2,4,'ad013b99-dfe9-4182-ae4e-1ef4f4ee7286.jpg'),(70,'Mango',2,2,'60cad24c-c040-413c-912f-351ff2532d45.jpg'),(71,'Lemon',2,5,'96ea5df5-a0d2-4690-9781-b39a22e8867b.jpg'),(72,'Whole Chicken',3,5,'f03b434d-e63b-4ec0-b747-6350507ae322.jpg'),(73,'Veal Loin Chops',3,7,'d852f189-5958-476d-9ee2-323e61bc2388.jpg'),(74,'Veal Cutlets',3,6,'6526a1f7-32b5-4846-9709-4c5a392b9d47.jpg'),(75,'Veal Chop',3,8,'be50f924-c60c-490a-8dd6-acda45cdf571.jpg'),(76,'Tilapia Fillet',3,7,'21a31793-621a-4a8f-a9c1-9d9b388fb372.jpg'),(77,'Swordfish',3,9,'17a0d269-d617-4e78-9d1e-e0f1b344994a.jpg'),(78,'Chicken Tenders',3,5,'c064b7d9-082a-4daf-819e-cca531aba2aa.jpg'),(79,'Sirloin Steak',3,8,'61288d9c-4a02-44ac-a1eb-1488d4519e3d.jpg'),(80,'Scallops',3,6,'ae36d15c-e5f7-472c-9119-2404de5e3c02.jpg'),(81,'Beef Steak',3,9,'f977f965-4901-4335-b432-10eb57416924.jpg'),(82,'Chicken Breast',3,7,'95acb747-7acf-4103-8fdb-2d86358e1795.jpg'),(83,'Chicken Drumsticks',3,9,'d4050ea3-0472-4112-9ede-6df505aca555.jpg'),(84,'Chicken Breast',3,8,'de836e9b-66a7-49ba-9a30-f1ea92b4b75c.jpg'),(85,'Chicken Thighs',3,6,'3a15f6cf-c0c1-4184-b6e5-91513aa9eea8.jpg'),(86,'Chicken Wings',3,9,'302cf91f-d27e-4544-b3a9-9554eff4cad9.jpg'),(87,'Beef Dog',3,8,'df6b0b30-2a03-4627-b4f8-33342d8d1b77.jpg'),(88,'Chopped Veal',3,6,'a8fb329b-1c07-4c49-b772-6a18057696b0.jpg'),(89,'Ground Beef',3,7,'192320a5-af83-4438-a0f9-0691e28863eb.jpg'),(90,'Hamburger Patties',3,9,'520ec215-a698-4048-aae6-fbcf42cab915.jpg'),(91,'Salmon Fillet',3,7,'742bad7d-441c-4f52-bc62-cccb27fb085d.jpg'),(92,'Jack Daniels',4,12,'effd9cf9-6b22-49a7-b0e8-c4fcf2002215.jpg'),(93,'Gatorade',4,2,'f65fd1da-e752-4072-9de0-f7edbfe4d36b.jpg'),(94,'Fairvalley',4,10,'86bc3f9a-6ff4-4acd-a515-94347a687681.jpg'),(95,'Corvezzo',4,15,'526a99e9-2fec-45c9-a07d-2a427eba898d.jpg'),(96,'Clynelish',4,13,'4db1f5c7-1969-4e1e-9d5e-11cc61837b29.jpg'),(97,'Christian Drouin',4,12,'18a47fb7-4f7c-4f0d-84cd-47c2834a5695.jpg'),(98,'Campari',4,18,'5ade7d9c-b2ef-4008-8bb5-7d30952a5f0b.jpg'),(99,'Bud Light',4,20,'653393cb-c2b6-4c54-8a30-21b474294100.jpg'),(100,'Buckler',4,17,'d896c8f5-0783-4ebc-809f-92edd020e555.jpg'),(101,'Blue Moon',4,19,'f1581469-baae-4d8a-bbea-caf1cbdd506a.jpg'),(102,'Becks',4,20,'d5dcdbf3-ba4c-4f41-8819-f4227132b5bf.jpg'),(103,'Tozai',4,10,'b0d66f70-9f31-426e-baba-a001823230db.jpg'),(104,'Taylor',4,13,'b5de392c-f226-466d-bab0-25dc4a598c33.jpg'),(105,'Sparkling',4,14,'d06964cc-0b30-419e-a16b-d90315b89167.jpg'),(106,'Snapple',4,3,'3b57367d-6b5f-4b05-8985-b5e1301d1891.jpg'),(107,'Smart Water',4,2,'a54fda68-1af6-4d90-a8ac-44bed482636a.jpg'),(108,'Rose',4,14,'4ceed790-2659-44fe-8727-2e8b2dfdfd33.jpg'),(109,'Powerade Zero',4,4,'0a455fcf-3da3-4634-9d1d-c7bbd9f33f8a.jpg'),(110,'Marie Duffau',4,18,'1bcdcec4-744a-4375-9d2e-bbde308ec11a.jpg'),(111,'Macchu Pisco',4,16,'5e8e58d4-8bae-4cd7-8a11-13c38c181d7f.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(45) NOT NULL,
  `city` varchar(45) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `userType` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=987654322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12345678,'sihon','pakado','sihon@mail.com','145b6b00aa041cf0ace0ae93727864f9',NULL,NULL,'Admin'),(223435675,'mike','tyson','mike@mail.com','145b6b00aa041cf0ace0ae93727864f9','Tel-Aviv','gefen street 26','Client');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-16 13:41:52
