const express = require('express');
const router = express.Router();
const db = require('../db/database');

const MAX_ADDRESSES = 5;

function getOrCreateCustomer(phone) {
  let customer = db.get('customers').find({ phone }).value();
  if (!customer) {
    customer = { phone, addresses: [] };
    db.get('customers').push(customer).write();
  }
  return customer;
}

// GET /api/addresses/:phone - get all saved addresses for a phone number
router.get('/:phone', (req, res) => {
  const customer = db.get('customers').find({ phone: req.params.phone }).value();
  res.json(customer ? customer.addresses : []);
});

// POST /api/addresses/:phone - add a new address (max 5)
// Body: { label, fullAddress, isDefault }
router.post('/:phone', (req, res) => {
  const { phone } = req.params;
  const { label, fullAddress, isDefault } = req.body;

  if (!fullAddress) {
    return res.status(400).json({ error: 'fullAddress is required' });
  }

  getOrCreateCustomer(phone);
  const customer = db.get('customers').find({ phone }).value();

  if (customer.addresses.length >= MAX_ADDRESSES) {
    return res.status(400).json({ error: `You can save up to ${MAX_ADDRESSES} addresses only` });
  }

  const id = db.get('nextAddressId').value();
  const newAddress = {
    id,
    label: label || 'Home',
    fullAddress,
    isDefault: !!isDefault || customer.addresses.length === 0 // first address is default automatically
  };

  // If this new one is set default, un-default the others
  if (newAddress.isDefault) {
    customer.addresses.forEach(a => (a.isDefault = false));
  }

  db.get('customers')
    .find({ phone })
    .get('addresses')
    .push(newAddress)
    .write();

  db.set('nextAddressId', id + 1).write();

  res.status(201).json(newAddress);
});

// PUT /api/addresses/:phone/:addressId - edit an address
router.put('/:phone/:addressId', (req, res) => {
  const { phone, addressId } = req.params;
  const id = Number(addressId);
  const customer = db.get('customers').find({ phone }).value();
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const address = customer.addresses.find(a => a.id === id);
  if (!address) return res.status(404).json({ error: 'Address not found' });

  if (req.body.isDefault) {
    customer.addresses.forEach(a => (a.isDefault = a.id === id));
  }

  db.get('customers')
    .find({ phone })
    .get('addresses')
    .find({ id })
    .assign(req.body)
    .write();

  res.json(db.get('customers').find({ phone }).get('addresses').find({ id }).value());
});

// DELETE /api/addresses/:phone/:addressId
router.delete('/:phone/:addressId', (req, res) => {
  const { phone, addressId } = req.params;
  const id = Number(addressId);

  db.get('customers')
    .find({ phone })
    .get('addresses')
    .remove({ id })
    .write();

  res.json({ success: true });
});

module.exports = router;
