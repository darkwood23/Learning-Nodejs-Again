#!/usr/bin/env node

console.log(
  'This script populates some test books, authors, genres, and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = await import("mongoose");
const Category = await import("./models/categories.js");
const Item = await import("./models/items.js");

const categories = [];
const items = [];

mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function itemCreate(index, name, categories, stock, description, price) {
  const item = new Item({
    name: name,
    categories: categories,
    stock: stock,
    description: description,
    image: "hello.png",
    price: price,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function categoryCreate(index, title, description) {
  const category = new Category({
    title: title,
    description: description,
  });
  await category.save();
  categories[index] = category;
  console.log(`Added category ${title}`);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(0, "Mouse", [categories[0]], 10, "Helps you game.", 30),
    itemCreate(1, "Laptop", [categories[2]], 2, "A way to connect.", 1200),
    itemCreate(
      2,
      "Pendrive",
      [categories[1]],
      16,
      "A way to store your files and take them anywhere",
      120
    ),
  ]);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "Computer Accessories", "Accessories for your computer"),
    categoryCreate(
      1,
      "Storage Devices",
      "Storage Devices such as pendrives and ssd for your electronic devices"
    ),
    categoryCreate(2, "Computers", "Electronic Devices that help you connect"),
  ]);
}
