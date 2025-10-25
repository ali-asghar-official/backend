// Attempts to fetch product detail via HTTP from the running server
// Adjust ID if needed
const id = process.argv[2] || '68ad6a9d3a025e6d9def88dc';
const url = `http://localhost:5000/product/detail?id=${id}`;

(async () => {
  try {
    console.log('Fetching', url);
    const res = await fetch(url, { method: 'GET' });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (err) {
    console.error('Fetch error:', err.message || err);
  }
})();
