async function test() {
  const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.86&current_weather=true'));
  const wrapper = await res.json();
  const data = JSON.parse(wrapper.contents);
  console.log(data.current_weather);
}
test();
