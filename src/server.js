const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const server = express();
const PORT = 3030;

const CURRENT_PRICE = "https://api.coindesk.com/v1/bpi/currentprice.json";
//server.use(bodyParser.json());

server.get('/current', (req, res) => {
	fetch(CURRENT_PRICE)
	  .then(res => res.json())
		.then(current => {
			res.status(200)
			res.send(current)
     })
		.catch(err => {
				res.status(422)
				res.send(`There was an error getting current bitcoin price: ${err}`)
			})
	})


server.listen(PORT, (err) => {
		if (err) {
		   console.log(`There was an error: ${err}`);
     }

		 else {
		   console.log(`Server is listening on port ${PORT}`);
			}
		});

