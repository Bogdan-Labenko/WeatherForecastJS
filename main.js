const apiOpenWeatherKey = '1de78154b55547fa6859a9d6b54352b3'
// const cur_city = document.querySelector('#current_date')
// const cur_sunrise = document.querySelector('#sunrise')
// const cur_sunset = document.querySelector('#sunset')
// const day_duration = document.querySelector('#day_duration')

//TODAY
async function getTodayWeatherFromCity(cityName) {
    let apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiOpenWeatherKey}`;
    const current = await fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => console.error(error))
    
    let apiUrl1 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiOpenWeatherKey}&units=metric`
    const hourly = await fetch(apiUrl1)
      .then(response => response.json())
      .then(data => {
        return data;
      })
    let apiUrl2 = `https://api.openweathermap.org/data/2.5/find?lat=${current.coord.lat}&lon=${current.coord.lon}&cnt=5&appid=${apiOpenWeatherKey}&units=metric`
    const nearby = await fetch(apiUrl2)
      .then(response => response.json())
      .then(data => {
        data.list.shift()
        data.count--
        return data;
      })
    return { current, hourly, nearby }
}
async function getWeatherFromCords(lat, lon){
    // const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&windspeed_unit=ms`;
    const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiOpenWeatherKey}`
    return await fetch(apiUrl1)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => console.error(error))
}
async function setTodayWeather(){
    const temp = document.querySelector('#search')
    const city = temp.value;
    let data = await getTodayWeatherFromCity(city)
    updateTodayInterface(data)
}
function updateTodayInterface(data){
  const current = data.current
  const hourly = data.hourly
  const nearby = data.nearby
  
  current_date.innerHTML = new Date(current.dt * 1000).toDateString()
  let sunrise_time = new Date(current.sys.sunrise * 1000).toLocaleTimeString()
  let sunset_time = new Date(current.sys.sunset * 1000).toLocaleTimeString() 
  
  //Current
  sunrise.innerHTML = 'Sunrise: ' + sunrise_time
  sunset.innerHTML = 'Sunset: ' + sunset_time
  day_duration.innerHTML = 'Duration: ' + new Date((current.sys.sunset - current.sys.sunrise) * 1000).toLocaleTimeString()
  today_cur_temp.innerHTML = Math.round(current.main.temp) + '°C'
  today_cur_real_temp.innerHTML = 'Real feel: ' + Math.round(current.main.feels_like) + '°C'
  cur_cond_img.src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
  cur_cond.innerHTML = current.weather[0].description

  //Hourly
  let hours_row = today_hourly_table.rows[0]
  let icons_row = today_hourly_table.rows[1]
  let cond_row = today_hourly_table.rows[2]
  let temp_row = today_hourly_table.rows[3]
  let real_temp_row = today_hourly_table.rows[4]
  let wind_row = today_hourly_table.rows[5]
  for (let index = 0; index <= 5; index++) {
    const element = hourly.list[index];
    let time = new Date(element.dt).toLocaleTimeString()
    hours_row.cells[index+1].innerHTML = element.dt_txt.slice(-8)
    icons_row.cells[index+1].querySelector('img').src = `http://openweathermap.org/img/wn/${element.weather[0].icon}.png`
    cond_row.cells[index+1].innerHTML = element.weather[0].description
    temp_row.cells[index+1].innerHTML = Math.round(element.main.temp) + ' °C'
    real_temp_row.cells[index+1].innerHTML = Math.round(element.main.feels_like) + ' °C'
    wind_row.cells[index+1].innerHTML = element.wind.speed
  }
  //Nearby
  let places = document.querySelectorAll('#today_nearby_places #nearby_place')
  for (let index = 0; index < places.length; index++) {
    const element = places[index];
    element.innerHTML = `<span>${nearby.list[index].name}</span>
    <img src="http://openweathermap.org/img/wn/${nearby.list[index].weather[0].icon}.png" alt="">
    <span>${Math.round(nearby.list[index].main.temp)}°C</span>`
  }
}
//5 Days forecast
async function set5DayForecast(){
  const temp = document.querySelector('#search')
  const city = temp.value;
  let data = await get5DaysForecastFromCity(city)
  console.log(data);
  update5DaysInterface(data)
}
async function get5DaysForecastFromCity(city){
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiOpenWeatherKey}}`
  return await fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => console.error(error))
}
function update5DaysInterface(data){
  
}
function showToday(){
  setTodayWeather()
  five_days_block.style.display = 'none'
  today.style.display = 'block'
}
function show5Days(){
  set5DayForecast()
  five_days_block.style.display = 'block'
  today.style.display = 'none'
}

setTodayWeather('London')