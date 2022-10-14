/*tslint:disabled*/

// currencies data
import CURRENCIES from './sample/data.js';


// Shorthand selector:
const $ = document.querySelector.bind(document);

document.addEventListener('DOMContentLoaded', () => {
	$('#currApi').addEventListener('click', evt => getData('IBM', evt));

	let selectIDs = ['#input-base', '#input-target'];

	$('#convert-btn').addEventListener('click', evt => getData('convert', evt));

	// Populate select options with ./sample/data.js (only physical for now)
	let physical = CURRENCIES['physical'],
		baseFrag = new DocumentFragment(),
		targetFrag = new DocumentFragment();

	physical.forEach(currency => {
		let opt = document.createElement('option');
		opt.setAttribute('value', currency['curr_code']);
		opt.textContent = currency['curr_code'];

		baseFrag.appendChild(opt);
		targetFrag.appendChild(opt.cloneNode(true));
	});
	$('#input-base').appendChild(baseFrag);
	$('#input-target').appendChild(targetFrag);
	//-----------------------------------------------------------

});

function getData(action, evt) {
	// prevent default action
	evt.preventDefault();

	console.log('Calling currency api using redirects');
	console.log(action, evt);

	let url = '/api/curr_api';

	fetch(url)
		.then(resp => resp.json())
		.then(content => {
			if (action === 'convert') {
				// User wants to convert
				let [baseCur, targetCur, inputAmt, resultDiv] = [
					$('#input-base'),
					$('#input-target'),
					$('#input-amt'),
					$('#result'),
				];

				// Get data from exchange API to convert
				// let exURL = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCur.value}&to_currency=${targetCur.value}&apikey=${content.key}`;
				let exURL = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${baseCur.value}&to_symbol=${targetCur.value}&outputsize=full&apikey=${content.key}`;
				// console.log(exURL);

				fetch(exURL)
					.then(response => response.json())
					.then(data => {
						// console.log(data);
						// Get the object holding the latest rates data
						let historical = data['Time Series FX (Daily)'];

						// Find latest date available
						let latestDate = '2022-10-01';
						for (const date in historical) {
							if (date > latestDate) {
								latestDate = date;
							}
						}
						// Select closing price/rate value from latest available object
						let rate = historical[latestDate]['4. close'];
						console.log(
							`The latest data we have available is from ${latestDate} at rate ${rate}`
						);

						resultDiv.innerHTML = `Result: ${(inputAmt.value * rate).toFixed(
							2
						)} (rate: ${rate})`;
					})
					.catch(err => console.error(err));
			} else {
				// User wants to get data
				let apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${action}&interval=5min&apikey=${content.key}`;
				// Get data from API
				fetch(apiUrl)
					// `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${content.key}`
					.then(response => response.json())
					.then(response => console.log(response))
					.catch(err => console.error(err));
			}
		})
		.catch(err => console.error);
}
