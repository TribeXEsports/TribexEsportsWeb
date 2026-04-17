async function test() {
  const uid = '2211665828';
  const url = `https://tribexapi-jwnyk62fq-blazetgt-1180s-projects.vercel.app/info?uid=${uid}&region=IND`;
  
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
