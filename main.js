const apiOpenWeatherKey = '1de78154b55547fa6859a9d6b54352b3'
const cur_city = document.querySelector('#city')
const cur_temp = document.querySelector('#temp')
const cur_condition = document.querySelector('#condition') 
const cur_cond_img = document.querySelector('#current_condition_img')
const cur_windy_img = document.querySelector('#current_windy_img')
const cur_windy = document.querySelector('#current_windy')

async function getWeatherFromCity(cityName) {
    let apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiOpenWeatherKey}`;
    return await fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => console.error(error))
}
async function getWeatherFromCords(lat, lon){
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&windspeed_unit=ms`;
    const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiOpenWeatherKey}`
    return await fetch(apiUrl1)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => console.error(error))
}
async function setCurrentWeather(){
    const temp = document.querySelector('#search')
    const city = temp.value;
    let data = await getWeatherFromCity(city)
    console.log(data);
    updateInterface(data)
}
function updateInterface(data){

  cur_city.innerHTML = data.name
  cur_temp.innerHTML = Math.round(data.main.temp) + '°С'
  cur_cond_img.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`

  cur_windy.innerHTML = data.wind.speed + ' km/h'
  cur_condition.innerHTML = data.weather[0].description

  // const windDirection = data.wind.deg
  // let iconClass = 'wi wi-wind towards-';
  // if (windDirection >= 348.75 || windDirection < 11.25) {
  //   iconClass += 'n';
  // } else if (windDirection >= 11.25 && windDirection < 33.75) {
  //   iconClass += 'nne';
  // } else if (windDirection >= 33.75 && windDirection < 56.25) {
  //   iconClass += 'ne';
  // } else if (windDirection >= 56.25 && windDirection < 78.75) {
  //   iconClass += 'ene';
  // } else if (windDirection >= 78.75 && windDirection < 101.25) {
  //   iconClass += 'e';
  // } else if (windDirection >= 101.25 && windDirection < 123.75) {
  //   iconClass += 'ese';
  // } else if (windDirection >= 123.75 && windDirection < 146.25) {
  //   iconClass += 'se';
  // } else if (windDirection >= 146.25 && windDirection < 168.75) {
  //   iconClass += 'sse';
  // } else if (windDirection >= 168.75 && windDirection < 191.25) {
  //   iconClass += 's';
  // } else if (windDirection >= 191.25 && windDirection < 213.75) {
  //   iconClass += 'ssw';
  // } else if (windDirection >= 213.75 && windDirection < 236.25) {
  //   iconClass += 'sw';
  // } else if (windDirection >= 236.25 && windDirection < 258.75) {
  //   iconClass += 'wsw';
  // } else if (windDirection >= 258.75 && windDirection < 281.25) {
  //   iconClass += 'w';
  // } else if (windDirection >= 281.25 && windDirection < 303.75) {
  //   iconClass += 'wnw';
  // } else if (windDirection >= 303.75 && windDirection < 326.25) {
  //   iconClass += 'nw';
  // } else if (windDirection >= 326.25 && windDirection < 348.75) {
  //   iconClass += 'nnw';
  // }
  // cur_windy_img.className = iconClass;
}