import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

const cors = require("cors");

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/lists", async (req, res) => {
  const { owner, items } = req.body;
  try {
    const newList = await prisma.toDoList.create({
      data: { owner, items },
    });
    res.status(201).json(newList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create list" });
  }
});

app.get("/lists", async (req, res) => {
  try {
    const lists = await prisma.toDoList.findMany();
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch lists" });
  }
});

app.delete("/lists/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    await prisma.toDoList.delete({
      where: { id: listId },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete list" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
