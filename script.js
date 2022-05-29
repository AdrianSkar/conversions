/*tslint:disabled*/

// Shorthand selector:
const $ = document.querySelector.bind(document);

document.addEventListener('DOMContentLoaded', () => {
	$('#currApi').addEventListener('click', evt => getData('IBM', evt));

	let selectIDs = ['#input-base', '#input-target'];

	selectIDs.forEach(value => {
		$(`${value}`).addEventListener('change', evt => getData('convert', evt));
	});
});

function getData(action, evt) {
	console.log('Calling currency api using redirects');
	console.log(action, evt);
	let url = '/api/curr_api';

	fetch(url)
		.then(resp => resp.json())
		.then(content => {
			let main = $('main');
			main.innerHTML += `<h2>Api key: ${content.key}</h2>`;
			console.log(this);

			if (action === 'convert') {
				let [baseCur, targetCur, inputAmt, resultDiv] = [
					$('#input-base'),
					$('#input-target'),
					$('#input-amt'),
					$('#result'),
				];
				console.log(baseCur.value, targetCur.value);
				// Get data from API to convert
				let exURL = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCur.value}&to_currency=${targetCur.value}&apikey=${content.key}`;
				console.log(exURL);
				fetch(exURL)
					.then(response => response.json())
					.then(response => {
						console.log(response);
						console.log(
							response['Realtime Currency Exchange Rate']['5. Exchange Rate']
						);
						let rate =
							response['Realtime Currency Exchange Rate']['5. Exchange Rate'];
						resultDiv.innerHTML += `Input amt: ${
							inputAmt.value
						}, rate: ${rate}, result: ${inputAmt.value * rate}`;
					})
					.catch(err => console.error(err));

				console.log('target', evt.target);
				console.log(action, evt);
			} else {
				let apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${action}&interval=5min&apikey=${content.key}`;
				// Get data from API
				fetch(apiUrl)
					// `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${content.key}`
					// `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${content.key}`
					.then(response => response.json())
					.then(response => console.log(response))
					.catch(err => console.error(err));
			}
		})
		.catch(err => console.error);
}
