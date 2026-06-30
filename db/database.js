// Simple file-based database using lowdb.
// Good for learning + small stores. Data is saved to db/data.json.
// When you're ready to scale, swap this file for a real database
// (PostgreSQL, MySQL, or MongoDB) without changing your routes much.

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'data.json'));
const db = low(adapter);

// Set up default structure if the database file is empty
db.defaults({
  products: [
    {
      id: 1,
      name: 'Floor cleaner 1L',
      category: 'Cleaning',
      price: 149,
      mrp: 175,
      stock: 40,
      description: 'Lemon fresh floor cleaner, 1 litre bottle',
      image: ''
    },
    {
      id: 2,
      name: 'Handwash 250ml',
      category: 'Hygiene',
      price: 89,
      mrp: 89,
      stock: 60,
      description: 'Anti-bacterial handwash',
      image: ''
    },
    {
      id: 3,
      name: 'Garbage bags (30pc)',
      category: 'Daily basics',
      price: 99,
      mrp: 99,
      stock: 100,
      description: 'Medium size, leak-proof',
      image: ''
    },
    {
      id: 4,
      name: 'Pest spray 400ml',
      category: 'Pest control',
      price: 179,
      mrp: 199,
      stock: 25,
      description: 'All-insect formula',
      image: ''
    }
  ],
  orders: [],
  nextProductId: 5,
  nextOrderId: 1
}).write();

module.exports = db;
