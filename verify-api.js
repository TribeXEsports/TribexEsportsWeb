const http = require('http');

http.get('http://localhost:3000/api/public/roster', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('API RESPONSE LENGTH:', Array.isArray(json) ? json.length : 'NOT AN ARRAY');
      if (Array.isArray(json) && json.length > 0) {
        console.log('FIRST MEMBER:', json[0].name);
      } else {
        console.log('RAW RESPONSE:', data);
      }
    } catch (e) {
      console.log('FAILED TO PARSE JSON:', e.message);
      console.log('RAW DATA:', data);
    }
  });
}).on('error', (err) => {
  console.log('HTTP GET ERROR:', err.message);
});
