document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('currApi').addEventListener('click', getData);
});

function getData(ev) {
	console.log('Calling currency api using redirects');
	let url = '/api/curr_api';
	fetch(url)
		.then(resp => resp.json())
		.then(content => {
			let main = document.querySelector('main');
			main.innerHTML = `<h2>${content.msg}</h2>`;
		})
		.catch(err => console.error);
}
