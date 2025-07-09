// src/services/api.js

const BASE_URL = 'https://splitbite.onrender.com'; // Change this to your backend URL if deployed

export async function createBill(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function getAllBills() {
  const res = await fetch(BASE_URL);
  return await res.json();
}
