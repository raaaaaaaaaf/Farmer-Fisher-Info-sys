import React from "react";
import "./forecast.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Forecast = ({ data }) => {
  const day = new Date().getDay();
  const forecastday = WEEK_DAYS.slice(day, WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, day)
  );

  return (
    <>
      <label className="title">Daily</label>
      <Accordion allowZeroExpanded>
        {data.list.splice(0, 7).map((item, index) => (
          <AccordionItem key={index}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  <img
                    alt="weather"
                    className="icon-small"
                    src={`/icons/${item.weather[0].icon}.png`}
                  />
                  <label className="day">{forecastday[index]}</label>
                  <label className="description">
                    {item.weather[0].description}
                  </label>
                  <label className="min-max">
                    {Math.round(item.main.temp_min)}°C /{" "}
                    {Math.round(item.main.temp_max)}°C
                  </label>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="daily-details-grid">
                <div className="daily-details-grid-item">
                  <label className="label">Pressure:</label>
                  <label className="value">{item.main.pressure} hPa</label>
                </div>
                <div className="daily-details-grid-item">
                  <label className="label">Humidity:</label>
                  <label className="value">{item.main.humidity}%</label>
                </div>
                <div className="daily-details-grid-item">
                  <label className="label">Clouds:</label>
                  <label className="value">{item.clouds.all}%</label>
                </div>
                <div className="daily-details-grid-item">
                  <label className="label">Wind speed:</label>
                  <label className="value">{item.wind.speed} m/s</label>
                </div>
                <div className="daily-details-grid-item">
                  <label className="label">Sea level:</label>
                  <label className="value">{item.main.sea_level} m</label>
                </div>
                <div className="daily-details-grid-item">
                  <label className="label">Feels like:</label>
                  <label className="value">
                    {Math.round(item.main.feels_like)}°C
                  </label>
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default Forecast;
