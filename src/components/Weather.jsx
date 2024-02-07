import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Loader from "../Loader/Loader";


const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const nightImgLinks = [
    {
      name: "moon",
      imgLink: "https://i.postimg.cc/C1CMVVQw/moon.png",
    },
    {
      name: "moon_behind_cloud",
      imgLink: "https://i.postimg.cc/WbzD0hyr/moon-behind-cloud.png",
    },
    {
      name: "rain",
      imgLink: "https://i.postimg.cc/3xHTYq2R/rain.png",
    },
    {
      name: "cloudy",
      imgLink: "https://i.postimg.cc/3xHTYq2R/rain.png",
    },
  ];

  const dayImgLinks = [
    {
      name: "sun",
      imgLink: "https://i.postimg.cc/XNF7w9jT/sun.png",
    },

    {
      name: "sun_behind_cloud",
      imgLink: "https://i.postimg.cc/bwPKKtjS/sun-behind-cloud.png",
    },

    {
      name: "rain",
      imgLink: "https://i.postimg.cc/3xHTYq2R/rain.png",
    },
    {
      name: "cloudy",
      imgLink: "https://i.postimg.cc/3xHTYq2R/rain.png",
    },
  ];

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://apjoy-weather-forecast.p.rapidapi.com/forecast?location=${city}&days=4`,
        {
          method: "GET",
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(weatherData);
  useEffect(() => {
    fetchWeather(); // Fetch weather data on initial render
  }, []);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleButtonClick = () => {
    if (city) {
      fetchWeather();
    } else {
      setError("Please enter a city name.");
    }
  };

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setCurrentTime(new Date());
  }

  const isDay = () => {
    const currentTimeInSeconds = Math.floor(currentTime.getTime() / 1000);
    const sunriseInSeconds = weatherData.city.sunrise;
    const sunsetInSeconds = weatherData.city.sunset;
    return (
      currentTimeInSeconds >= sunriseInSeconds &&
      currentTimeInSeconds <= sunsetInSeconds
    );
  };

  const getImageBasedOnCondition = (condition, isDay) => {
    switch (condition) {
      case "clear sky":
        return isDay
          ? dayImgLinks.find((link) => link.name === "sun").imgLink
          : nightImgLinks.find((link) => link.name === "moon").imgLink;
      case "broken clouds":
      case "scattered clouds":
        return isDay
          ? dayImgLinks.find((link) => link.name === "sun_behind_cloud").imgLink
          : nightImgLinks.find((link) => link.name === "moon_behind_cloud")
              .imgLink;
      case "rain":
        return dayImgLinks.find((link) => link.name === "rain").imgLink; // Use the same rain image for both day and night
      case "overcast clouds":
        return dayImgLinks.find((link) => link.name === "cloudy").imgLink; // Use the same cloudy image for both day and night
      case "few clouds":
        return isDay
          ? dayImgLinks.find((link) => link.name === "sun_behind_cloud").imgLink
          : nightImgLinks.find((link) => link.name === "moon_behind_cloud")
              .imgLink;
      default:
        return dayImgLinks.find((link) => link.name === "sun").imgLink; // Default image if no match is found
    }
  };

  const findCardForCurrentTime = () => {
    const currentTimestamp = Math.floor(currentTime.getTime() / 1000);
    let closestCard = null;
    let smallestDifference = Infinity;

    weatherData.list.forEach((card) => {
      const cardTimestamp = card.dt;
      const difference = Math.abs(currentTimestamp - cardTimestamp);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestCard = card;
      }
    });

    return closestCard;
  };
  return (
    <div className="p-18">
      <Navbar />
      <div className="pt-[20px] bg-custom bg-cover bg-center h-[100%] lg:h-[120vh] flex justify-center">
        <div>
          <div className="bg-white bg-opacity-50 p-8 rounded shadow-lg">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleInputChange}
              className="border rounded p-2 mb-2"
            />
            <button
              onClick={handleButtonClick}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Get Weather
            </button>
            {loading && (
              <div className="top-6 flex justify-center items-center">
                <Loader />
              </div>
            )}
            {/* {error && <div>Error: {error}</div>} */}
            {weatherData && (
              <div className="p-4">
                <h1 className="text-2xl font-bold">{weatherData.city.name}</h1>
                <p className="text-base">
                  <span className="text-base font-semibold">Date:</span>{" "}
                  {new Date(
                    weatherData?.list[0]?.dt * 1000
                  ).toLocaleDateString()}
                </p>
                <p className="text-2xl font-bold">
                  {/* <span className="text-2xl font-semibold">Current Time:</span>{" "} */}
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
                <div className="flex justify-center py-4">
                  {weatherData && (
                    <div className="flex flex-col items-center">
                      <img
                        src={getImageBasedOnCondition(
                          findCardForCurrentTime()?.weather[0]?.description ||
                            "",
                          isDay()
                        )}
                        className="h-[150px] w-[150px]"
                        alt="Current Weather Condition"
                      />
                      <p className="mt-2 text-xl font-bold text-center">
                        {findCardForCurrentTime()?.weather[0]?.description.toUpperCase() ||
                          ""}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4 lg:justify-between px-10 py-2">
                  <p className="text-base font-semibold">
                    Sunrise:{" "}
                    {new Date(
                      weatherData.city.sunrise * 1000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="text-base font-semibold">
                    Sunset:{" "}
                    {new Date(
                      weatherData.city.sunset * 1000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-center">
                  {weatherData.list.map((item, index) => {
                    const isDay =
                      new Date(item.dt * 1000) >=
                        new Date(weatherData.city.sunrise * 1000) &&
                      new Date(item.dt * 1000) <=
                        new Date(weatherData.city.sunset * 1000);
                    const imageUrl = getImageBasedOnCondition(
                      item.weather[0].description,
                      isDay
                    );

                    return (
                      <div key={index} className="flex-shrink-0 mb-6 w-64 ml-4">
                        <div className="bg-white p-2 rounded shadow-lg">
                          <h2 className="text-xl font-bold">
                            {new Date(item.dt * 1000).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
                          </h2>
                          <div className="flex justify-center py-4">
                            <img src={imageUrl} className="p-2 h-[150px]" />
                          </div>
                          <p>Temperature: {item.main.temp}°C</p>
                          <p>Pressure: {item.main.pressure} hPa</p>
                          <p>Humidity: {item.main.humidity}%</p>
                          <p>Cloudiness: {item.clouds.all}%</p>
                          <p>
                            Wind Speed: {(item.wind.speed * 3.6).toFixed(2)}{" "}
                            km/hr
                          </p>
                          <p>Description: {item.weather[0].description}</p>
                          <p>Sea Level Pressure: {item.main.sea_level} hPa</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
