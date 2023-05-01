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
  update5DaysInterface(data)
}
async function get5DaysForecastFromCity(city){
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiOpenWeatherKey}&units=metric`
  return await fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.error(error))
}
var forecast = {}
function update5DaysInterface(data){
  console.log(data);
  const iconFrequencyByDate = {};
  const descriptionFrequenceByDate = {};
  data.list.forEach(obj => {
    // извлекаем дату из свойства dt_txt, игнорируя время
    const date = obj.dt_txt.split(' ')[0];
  
    // проверяем, есть ли уже объект для этой даты в нашем объекте iconFrequencyByDate
    if (!(date in iconFrequencyByDate)) {
      // если нет, создаем его
      iconFrequencyByDate[date] = {};
    }
    if (!(date in descriptionFrequenceByDate)) {
      // если нет, создаем его
      descriptionFrequenceByDate[date] = {};
    }
  
    // извлекаем иконку из свойства icon в первом объекте в массиве weather
    const icon = obj.weather[0].icon;
    const main = obj.weather[0].main;
  
    // проверяем, есть ли уже запись для этой иконки в объекте для данной даты
    if (!(icon in iconFrequencyByDate[date])) {
      // если нет, создаем ее и инициализируем значением 1
      iconFrequencyByDate[date][icon] = 1;
    } else {
      // если есть, увеличиваем количество повторений на 1
      iconFrequencyByDate[date][icon]++;
    }
    if (!(main in descriptionFrequenceByDate[date])) {
      descriptionFrequenceByDate[date][main] = 1;
    } else {
      descriptionFrequenceByDate[date][main]++;
    }
  })
  forecast = {}
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    const time = item.dt_txt.split(' ')[1];
    if (!forecast[date]) {
      forecast[date] = { temperatures: [], hourly: [], icon: {}, description: {} };
    }
    forecast[date].temperatures.push(item.main.temp);
    forecast[date].hourly.push({ time, temperature: item.main.temp, icon: item.weather[0].icon, feels_like: item.main.feels_like, wind: item.wind.speed, description: item.weather[0].description });
    forecast[date].icon = Object.keys(iconFrequencyByDate[date]).reduce((a, b) => iconFrequencyByDate[date][a] > iconFrequencyByDate[date][b] ? a : b)
    forecast[date].description = Object.keys(descriptionFrequenceByDate[date]).reduce((a, b) => descriptionFrequenceByDate[date][a] > descriptionFrequenceByDate[date][b] ? a : b)
  });
  blocks = document.querySelectorAll('#day_card')
  console.log(forecast)
  let i = 0;
  Object.keys(forecast).forEach(date => {
    if(i > 4) return;
    const temperatures = forecast[date].temperatures;
    blocks[i].querySelector('b').innerHTML = Math.round((temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length)) + ' °C';
    blocks[i].querySelector('h3').innerHTML = new Date(date).toLocaleDateString('en-US', {weekday: 'long'})
    blocks[i].querySelector('img').src = `http://openweathermap.org/img/wn/${forecast[date].icon}.png`;
    blocks[i].querySelector('#descript').innerHTML = forecast[date].description
    blocks[i].querySelector('#date').innerHTML = date
    if(i == 1)
    {
      blocks[i].querySelectorAll('#day_card').forEach(card => card.className = '')
      blocks[i].classList.add('selected')
      setHourly5DayForecast(forecast[date].hourly);
    } 
    i++;
  });
}
function setHourly5DayForecast(hourly){
      let hours_row = five_days_hourly_table.rows[0]
      let icons_row = five_days_hourly_table.rows[1]
      let cond_row = five_days_hourly_table.rows[2]
      let temp_row = five_days_hourly_table.rows[3]
      let real_temp_row = five_days_hourly_table.rows[4]
      let wind_row = five_days_hourly_table.rows[5]
      for (let index = 0; index <= 5; index++) {
        const element = hourly[index];
        console.log(element);
        hours_row.cells[index+1].innerHTML = element.time
        icons_row.cells[index+1].querySelector('img').src = `http://openweathermap.org/img/wn/${element.icon}.png`
        cond_row.cells[index+1].innerHTML = element.description
        temp_row.cells[index+1].innerHTML = Math.round(element.temperature) + ' °C'
        real_temp_row.cells[index+1].innerHTML = Math.round(element.feels_like) + ' °C'
        wind_row.cells[index+1].innerHTML = element.wind
      }
}

function setWeather(){
  if(five_days_block.style.display == 'none') showToday()
  else show5Days()
}
function showToday(){
  five_days_block.style.display = 'none'
  today.style.display = 'block'
  setTodayWeather()
}
function show5Days(){
  five_days_block.style.display = 'block'
  today.style.display = 'none'
  set5DayForecast()
}

five_days.querySelectorAll('#day_card').forEach(card => {
  card.addEventListener('click', () => {
    five_days.querySelectorAll('#day_card').forEach(card => card.className = '')
    card.classList.add('selected')
    setHourly5DayForecast(forecast[card.querySelector('#date').innerHTML].hourly)
  });
});

setTodayWeather('London')