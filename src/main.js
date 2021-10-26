require('dotenv').config();
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

(async function run() {
  console.log('Running report...');

  const city = 'Philadelphia, PA';
  const countryCode = 'US';

  const locationEndpoint = `http://dataservice.accuweather.com/locations/v1/cities/${countryCode}/search`;
  const locationRequest = await fetch(`${locationEndpoint}?q=${encodeURIComponent(city)}&apikey=${process.env.ACCUWEATHER_API_KEY}`);
  const locationData = await locationRequest.json();
  const locationKey = locationData[0].Key;

  const forecastEndpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}`;
  const forecastRequest = await fetch(`${forecastEndpoint}?apikey=${process.env.ACCUWEATHER_API_KEY}`);
  const forecastData = await forecastRequest.json();

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.DAILY_REPORT_FROM,
    to: process.env.DAILY_REPORT_TO,
    subject: 'Daily Report',
    text: `
Daily Report

Weather
- Forecast: ${forecastData.Headline.Text}
- Temp Min: ${forecastData.DailyForecasts[0].Temperature.Minimum.Value}° ${forecastData.DailyForecasts[0].Temperature.Minimum.Unit}
- Temp Max: ${forecastData.DailyForecasts[0].Temperature.Maximum.Value}° ${forecastData.DailyForecasts[0].Temperature.Maximum.Unit}
    `,
    html: `
      <h1>Daily Report</h1>
      <h2>Weather</h2>
      <p>Forecast: ${forecastData.Headline.Text}</p>
      <p>Temp Min: ${forecastData.DailyForecasts[0].Temperature.Minimum.Value}° ${forecastData.DailyForecasts[0].Temperature.Minimum.Unit}</p>
      <p>Temp Max: ${forecastData.DailyForecasts[0].Temperature.Maximum.Value}° ${forecastData.DailyForecasts[0].Temperature.Maximum.Unit}</p>
    `,
  });

})();