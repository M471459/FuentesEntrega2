import { Router } from "express";
import productManager from "../productManager.js";
import { io } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado en Real Time");
    socket.emit("products", products); //enviandole productos al front
  });

  res.render("realTimeProducts");
});

router.post("/realtimeproducts", async (req, res) => {
  await productManager.addProduct(req.body);
  const products = await productManager.getProducts();
  io.emit("products", products);

  res.render("realTimeProducts");
});

router.delete("/realtimeproducts", async (req, res) => {
  const { id } = req.body;
  await productManager.deleteProduct(Number(id));
  const products = await productManager.getProducts();
  io.emit("products", products);
  res.render("realTimeProducts");
});

export default router;
