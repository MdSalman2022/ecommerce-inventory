const express = require("express");
const cors = require("cors");

const { Parser } = require("json2csv");

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("inventory portal server is running");
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client
      .db("inventory-app")
      .collection("productsCollection");
    const customersCollection = client
      .db("inventory-app")
      .collection("customersCollection");
    const ordersCollection = client
      .db("inventory-app")
      .collection("ordersCollection");

    app.get("/api/get-customers", async (req, res) => {
      try {
        const customers = await customersCollection.find().toArray();

        res.send(customers);
      } catch (error) {
        console.error("Error retrieving customers:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    app.get("/api/get-products", async (req, res) => {
      try {
        const products = await productsCollection.find().toArray();

        res.send(products);
      } catch (error) {
        console.error("Error retrieving products:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    //export data in csv format
    app.get("/api/customer-export", async (req, res) => {
      try {
        const data = await customersCollection.find().toArray();
        const flattenedData = data.map((item) => ({
          _id: item._id,
          customer_name: item.customer_details.name,
          customer_phone: item.customer_details.phone,
          customer_location: item.customer_details.location,
          customer_address: item.customer_details.address,
          purchase_total: item.purchase.total,
          orders_processing: item.orders.processing,
          orders_ready: item.orders.ready,
          orders_completed: item.orders.completed,
          orders_returned: item.orders.returned,
        }));
        const filename = "customer_list.csv";

        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(flattenedData);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );

        res.send(csvData);
      } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/api/product-export", async (req, res) => {
      try {
        const data = await productsCollection.find().toArray();
        const flattenedData = data.map((item) => ({
          _id: item._id,
          image: item.image,
          name: item.name,
          description: item.description,
          brand: item.brand,
          supplier: item.supplier,
          store: item.store,
          liftPrice: item.liftPrice,
          salePrice: item.salePrice,
          availableQty: item.availableQty,
          qty: item.qty,
          stockDate: item.stockDate,
        }));
        const filename = "customer_list.csv";

        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(flattenedData);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );

        res.send(csvData);
      } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Backend API route for customer search
    app.get("/api/search-customer", async (req, res) => {
      try {
        const { name, phonenumber } = req.query;
        let searchQuery;

        if (phonenumber) {
          // Search by phone number
          searchQuery = { "customer_details.phone": phonenumber };
        } else if (name) {
          // Search by name (partial match)
          searchQuery = {
            "customer_details.name": { $regex: name, $options: "i" },
          };
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Invalid search query" });
        }

        const pipeline = [
          {
            $match: searchQuery,
          },
          {
            $limit: 50, // Limit the number of search results
          },
        ];

        const customers = await customersCollection
          .aggregate(pipeline)
          .toArray();

        if (customers.length > 0) {
          res.json({ success: true, customers });
        } else {
          res.json({ success: false, message: "No customers found" });
        }
      } catch (error) {
        console.error("Error searching for customers:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    //get orders

    app.get("/api/get-orders", async (req, res) => {
      try {
        const orders = await ordersCollection.find().toArray();

        res.send(orders);
      } catch (error) {
        console.error("Error retrieving orders:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // All post api

    app.post("/api/add-customer", async (req, res) => {
      try {
        const { image, name, phone, district, address, link } = req.body;

        const customer = {
          customer_details: {
            name,
            image,
            phone,
            location: district,
            address,
            link,
          },
          purchase: {
            total: 0,
            last_purchase: null,
          },
          orders: {
            processing: 0,
            ready: 0,
            completed: 0,
            returned: 0,
          },
        };

        const result = await customersCollection.insertOne(customer);

        res.json({
          success: true,
          message: "Customer added successfully",
          result,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // For add product

    app.post("/api/add-product", async (req, res) => {
      try {
        const {
          image,
          name,
          description,
          brand,
          supplier,
          country,
          store,
          liftPrice,
          salePrice,
          qty,
        } = req.body;

        const stockDate = new Date().toISOString();

        const product = {
          image,
          name,
          description,
          brand,
          supplier,
          country,
          store,
          liftPrice,
          salePrice,
          availableQty: qty,
          qty,
          stockDate,
        };

        const result = await productsCollection.insertOne(product);

        res.json({
          success: true,
          message: "Product added successfully",
          result,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // order collection
    app.post("/api/post-order", async (req, res) => {
      try {
        const {
          image,
          name,
          phone,
          address,
          district,
          product,
          quantity,
          courier,
          deliveryCharge,
          discount,
          total,
          advance,
          cash,
          instruction,
        } = req.body;

        const order = {
          image,
          name,
          phone,
          address,
          district,
          product,
          quantity,
          courier,
          deliveryCharge,
          discount,
          total,
          advance,
          cash,
          instruction,
          orderStatus: "processing",
          timestamp: new Date().toISOString(),
        };

        const result = await ordersCollection.insertOne(order);

        res.json({
          success: true,
          message: "Order added successfully",
          result,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    //All put api
    app.put("/api/put-edit-customer/:id", async (req, res) => {
      try {
        const customerId = req.params.id;
        const { image, name, phone, location, address, link } = req.body;

        const result = await customersCollection.updateOne(
          { _id: new ObjectId(customerId) },
          {
            $set: {
              "customer_details.name": name,
              "customer_details.image": image,
              "customer_details.phone": phone,
              "customer_details.location": location,
              "customer_details.address": address,
              "customer_details.link": link,
            },
          }
        );

        if (result.matchedCount === 1) {
          res.json({ success: true, message: "Customer updated successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        }
      } catch (error) {
        console.error("Error updating customer:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    app.put("/api/put-edit-product/:id", async (req, res) => {
      try {
        const customerId = req.params.id;
        const {
          image,
          name,
          description,
          brand,
          supplier,
          store,
          liftPrice,
          salePrice,
          availableQty,
          qty,
        } = req.body;

        const result = await productsCollection.updateOne(
          { _id: new ObjectId(customerId) },
          {
            $set: {
              image,
              name,
              description,
              brand,
              supplier,
              store,
              liftPrice,
              salePrice,
              availableQty,
              qty,
            },
          }
        );

        if (result.matchedCount === 1) {
          res.json({ success: true, message: "Customer updated successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        }
      } catch (error) {
        console.error("Error updating customer:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    app.put("/api/put-edit-order/:id", async (req, res) => {
      try {
        const customerId = req.params.id;
        const {
          image,
          name,
          description,
          brand,
          supplier,
          store,
          liftPrice,
          salePrice,
          availableQty,
          qty,
        } = req.body;

        const result = await productsCollection.updateOne(
          { _id: new ObjectId(customerId) },
          {
            $set: {
              image,
              name,
              description,
              brand,
              supplier,
              store,
              liftPrice,
              salePrice,
              availableQty,
              qty,
            },
          }
        );

        if (result.matchedCount === 1) {
          res.json({ success: true, message: "Customer updated successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        }
      } catch (error) {
        console.error("Error updating customer:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    app.put("/api/put-update-order-status/:id", async (req, res) => {
      try {
        const orderId = req.params.id;
        const { orderStatus } = req.body;

        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              orderStatus,
            },
          }
        );

        if (result.matchedCount === 1) {
          res.json({ success: true, message: "order updated successfully" });
        } else {
          res.status(404).json({ success: false, message: "order not found" });
        }
      } catch (error) {
        console.error("Error updating order:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    //All delete api
    app.delete("/api/delete-customer/:id", async (req, res) => {
      try {
        const customerId = req.params.id;

        const result = await customersCollection.deleteOne({
          _id: new ObjectId(customerId),
        });

        if (result.deletedCount === 1) {
          res.json({ success: true, message: "Customer deleted successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    app.delete("/api/delete-product/:id", async (req, res) => {
      try {
        const productId = req.params.id;

        const result = await productsCollection.deleteOne({
          _id: new ObjectId(productId),
        });

        if (result.deletedCount === 1) {
          res.json({ success: true, message: "Customer deleted successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
    app.delete("/api/delete-order/:id", async (req, res) => {
      try {
        const productId = req.params.id;

        const result = await ordersCollection.deleteOne({
          _id: new ObjectId(productId),
        });

        if (result.deletedCount === 1) {
          res.json({ success: true, message: "order deleted successfully" });
        } else {
          res.status(404).json({ success: false, message: "order not found" });
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.log);

app.listen(port, () => console.log(`inventory is running on ${port}`));
