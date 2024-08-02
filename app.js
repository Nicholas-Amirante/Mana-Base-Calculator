const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for the home page
app.get('/', (req, res) => {
  res.render('index', { body: 'index' });
});

// Modify the render function for the results template
app.post('/calculate', (req, res) => {
  // Input validation
  const tLands = parseInt(req.body.tLands);
  const wPips = parseInt(req.body.wPips);
  const uPips = parseInt(req.body.uPips);
  const bPips = parseInt(req.body.bPips);
  const rPips = parseInt(req.body.rPips);
  const gPips = parseInt(req.body.gPips);

  // Check if any of the inputs are NaN (not a number)
  if (isNaN(tLands) || isNaN(wPips) || isNaN(uPips) || isNaN(bPips) || isNaN(rPips) || isNaN(gPips)) {
    return res.status(400).send('Invalid input. Please enter valid numbers for all fields.');
  }

  // Calculate the total pips
  const tPips = wPips + uPips + bPips + rPips + gPips;

  // Check if the total pips is 0
  if (tPips === 0) {
    return res.status(400).send('Invalid input. Total pips cannot be 0.');
  }

  // Calculate the ratios
  const wRatio = wPips / tPips;
  const uRatio = uPips / tPips;
  const bRatio = bPips / tPips;
  const rRatio = rPips / tPips;
  const gRatio = gPips / tPips;

  // Calculate the rounded results
  let wResults = Math.round(tLands * wRatio);
  let uResults = Math.round(tLands * uRatio);
  let bResults = Math.round(tLands * bRatio);
  let rResults = Math.round(tLands * rRatio);
  let gResults = Math.round(tLands * gRatio);

  // Calculate the sum of results
  let sumResults = wResults + uResults + bResults + rResults + gResults;

  // Calculate the remainder
  let remainder = tLands - sumResults;

  // Find the lowest non-zero result
  const minResult = Math.min(
    wResults || Infinity,
    uResults || Infinity,
    bResults || Infinity,
    rResults || Infinity,
    gResults || Infinity
  );

  // Add the remainder to the lowest non-zero result
  if (minResult !== Infinity && remainder > 0) {
    if (minResult === wResults) {
      wResults += remainder;
    } else if (minResult === uResults) {
      uResults += remainder;
    } else if (minResult === bResults) {
      bResults += remainder;
    } else if (minResult === rResults) {
      rResults += remainder;
    } else if (minResult === gResults) {
      gResults += remainder;
    }
  }

  // Exclude results that are equal to 0
  const filteredResults = {
    wResults: wResults !== 0 ? `${wResults} white` : undefined,
    uResults: uResults !== 0 ? `${uResults} blue` : undefined,
    bResults: bResults !== 0 ? `${bResults} black` : undefined,
    rResults: rResults !== 0 ? `${rResults} red` : undefined,
    gResults: gResults !== 0 ? `${gResults} green` : undefined,
  };

  res.render('results', {
    ...filteredResults,
    body: 'results'
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});