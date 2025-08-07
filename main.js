const startInput = document.getElementById("startInput");
const startBtn = document.getElementById("startBtn");
let firstMenu = document.querySelector(".firstMenu");
let loading = document.querySelector(".loading");
let divBtnInp = document.getElementById("divBtnInp");
let circle = document.querySelector(".circle");
let parent = document.querySelector(".parent");
let flex1 = document.querySelector(".flex1");
let divNewBlocks = document.querySelectorAll(".div1New, .div2New, .div3New, .div4New, .div5New");
let now = document.querySelector(".now");
let double2 = document.querySelector(".double2");
let now1 = document.querySelector(".now1")

let savedForecastData = null;


startBtn.addEventListener("click", function() {
    let city = startInput.value.trim();
    const apiKey = "d78d70bbc3dc76ed3d2841de71a91f6b";

    if(city === "") {
        alert("Please enter a city");
        return;
    }

    startBtn.disabled = true;

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    async function getWeather() {
        try {
            firstMenu.classList.add("hide");

            await new Promise(resolve => {
                firstMenu.addEventListener("animationend", function handleAnim() {
                    firstMenu.classList.add("none");
                    loading.classList.add("flex");
                    loading.classList.add("load");
                    double2.style.display = "flex"
                    now1.classList.remove("none")
                    now1.style.display = "flex"
                    firstMenu.removeEventListener("animationend", handleAnim);
                    resolve();
                });
            });
            

            let res = await fetch(url);
            let data = await res.json();

            const cityName = data.name;
            const countryName = data.sys.country;
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const feelsLike = data.main.feels_like;


            now.innerHTML = `<p class= "ananas">${cityName}, ${countryName}</p> <p class="kaban">${Math.round(temp)}°C</p> <p class="description">${description}</p> <p class="feelsLike">Feels like ${Math.round(feelsLike)}°C</p>`;
 

            let forecastRes = await fetch(forecastURL);
            let forecastData = await forecastRes.json();
            savedForecastData = forecastData;

            const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

            dailyForecast.forEach((item, i) => {
                const dateObj = new Date(item.dt * 1000);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const date = `${day}.${month}`;
                const temp = item.main.temp;
                const desc = item.weather[0].description;
                const icon = item.weather[0].icon;
                const fellsLike = item.main.feels_like;
                const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                const block = document.querySelector(`.div${i + 1}New`);
                if (block) {
                    block.innerHTML = `<p>${date}</p> <img src="${iconUrl}" alt="${desc}" width="50"></img> <p>${desc}</p> <p>${Math.round(temp)}°</p> <p style="color: gray;">${Math.round(fellsLike)}°</p>`;
                }
            });

            document.querySelectorAll('.div1New, .div2New, .div3New, .div4New, .div5New').forEach((dayBlock, dayIdx) => {
                dayBlock.addEventListener('click', () => {
                    let selectedDate = dayBlock.dataset.date;

                    let forecastsForDay = forecastData.list.filter(item =>
                        item.dt_txt.startsWith(selectedDate)
                    );

                    for (let i = 1; i <= 8; i++) {
                        const hourBlock = document.querySelector(`.div1${i}New`);
                        if (hourBlock) {
                            hourBlock.innerHTML = "";
                            hourBlock.classList.remove("show-block");
                            hourBlock.classList.add("hide-block");
                        }
                    }

                    for (let i = 0; i < 8; i++) {
                        const block = document.querySelector(`.div1${i + 1}New`);
                        if (block) {
                            if (forecastsForDay[i]) {
                                const item = forecastsForDay[i];
                                const time = item.dt_txt.split(" ")[1].slice(0, 2);
                                const temp = Math.round(item.main.temp);
                                const description = item.weather[0].description;
                                const icon = item.weather[0].icon;
                                setTimeout(() => {
                                    block.innerHTML = `
                                        <p>${time}:00</p>
                                        <p>${temp}°C</p>
                                        <p>${description}</p>
                                        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
                                    `;
                                    block.classList.remove("hide-block");
                                    block.classList.add("show-block");
                                }, 50 * i);
                            }
                        }
                    }

                    const dateObj = new Date(selectedDate);
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const dayName = days[dateObj.getDay()];
                    const formatted = `${dayName}`;
                    const infoBlock = document.querySelector('.div117New');
                    if (infoBlock) infoBlock.innerHTML = formatted;
                });
            });

            loading.classList.add("disappearance");

            loading.addEventListener("animationend", function handleDisappear() {
                loading.classList.remove("load");
                loading.classList.remove("flex");
                loading.classList.add("none");
                loading.removeEventListener("animationend", handleDisappear);
            });

            setTimeout(() => {
                flex1.style.display = "flex";
                const blocks = parent.querySelectorAll("div");

                blocks.forEach((block) => {
                    block.classList.remove("show-block");
                    block.classList.add("hide-block");
                });

                setTimeout(() => {
                    blocks.forEach((block, i) => {
                        setTimeout(() => {
                            block.classList.remove("hide-block");
                            block.classList.add("show-block");
                        }, 20 * i);
                    });
                }, 100);
            }, 1000);

            dailyForecast.forEach((item, i) => {
                const dateStr = item.dt_txt.split(" ")[0];
                const block = document.querySelector(`.div${i + 1}New`);
                if (block) {
                    block.dataset.date = dateStr;
                }
            });


            startBtn.disabled = false;

        } catch (error) {
            console.error("Error:", error);
            alert("Unable to retrieve weather data. Please check the city name or try again later.");
            setTimeout(() => {
                firstMenu.classList.remove("none");
                firstMenu.classList.remove("hide");
                firstMenu.classList.remove("toShow");
                loading.classList.remove("disappearance");
                loading.classList.remove("load");
                loading.classList.remove("flex");
                loading.classList.add("none");
                divBtnInp.classList.remove("none");
                double2.style.display = "none"
                startBtn.disabled = false;
            }, 1);
        }
    }

    getWeather();
});

divNewBlocks.forEach(block => {
    block.addEventListener("click", function() {
        divNewBlocks.forEach(b => b.classList.remove("selectEl"));
        block.classList.add("selectEl");
    });
});