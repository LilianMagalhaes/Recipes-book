
    let api_key = '568628788222f8da10914685f8dfbdac';
let url = 'http://api.openweathermap.org/data/2.5/weather?q=Montreal,ca&lang=fr&&mode=html&units=metric&appid=' + api_key;
      fetch(url)
      .then(reponse => reponse.text())
      .then(text =>{
        console.log(text);
        document.getElementById('weather').innerHTML = text;
      });


function clock() {
    let clock = document.getElementById('time');
    clock.textContent = new Date().toString();
}
setInterval(clock, 1000);