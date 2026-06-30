const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'data.json'));
const db = low(adapter);

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
      image: '',
      pros: ['Strong lemon fragrance', 'Cuts grease easily', 'Safe on tile & marble'],
      cons: ['Bottle cap loosens over time'],
      videoUrl: '',
      reviews: [
        { name: 'Priya R.', rating: 5, comment: 'Smells great and works well on tough stains.', date: '2026-05-10' },
        { name: 'Karthik S.', rating: 4, comment: 'Good product, slightly pricey.', date: '2026-05-22' }
      ]
    },
    {
      id: 2,
      name: 'Handwash 250ml',
      category: 'Hygiene',
      price: 89,
      mrp: 89,
      stock: 60,
      description: 'Anti-bacterial handwash',
      image: '',
      pros: ['Kills 99.9% germs', 'Gentle on skin'],
      cons: [],
      videoUrl: '',
      reviews: []
    },
    {
      id: 3,
      name: 'Garbage bags (30pc)',
      category: 'Daily basics',
      price: 99,
      mrp: 99,
      stock: 100,
      description: 'Medium size, leak-proof',
      image: '',
      pros: ['Leak-proof', 'Good thickness'],
      cons: ['Slightly smaller than expected'],
      videoUrl: '',
      reviews: []
    },
    {
      id: 4,
      name: 'Pest spray 400ml',
      category: 'Pest control',
      price: 179,
      mrp: 199,
      stock: 25,
      description: 'All-insect formula',
      image: '',
      pros: ['Works fast', 'Long lasting effect'],
      cons: ['Strong smell for a few hours'],
      videoUrl: '',
      reviews: []
    }
  ],
  banners: [
    {
      id: 1,
      title: 'Weekend Special',
      subtitle: 'Flat 15% off on all cleaning supplies',
      bgColor: '#0F6E56',
      textColor: '#FFFFFF',
      imageUrl: '',
      active: true
    }
  ],
  orders: [],
  customers: [],
  nextProductId: 5,
  nextOrderId: 1,
  nextBannerId: 2,
  nextAddressId: 1
}).write();

module.exports = db;
