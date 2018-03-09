 const express = require("express");
 const bodyParser = require("body-parser");
 const fetch = require('node-fetch');

 const server = express();
 const PORT = 3030;
 const CURRENT_PRICE = "https://api.coindesk.com/v1/bpi/currentprice.json";
 const PREVIOUS_PRICE = "https://api.coindesk.com/v1/bpi/historical/close.json";
 
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

   server.get('/previous', (req, res) => {
			 fetch(PREVIOUS_PRICE)
			   .then(res => res.json())
				 .then(previous => {
					  res.status(200)
						res.send(previous)
          })
				 .catch(err => {
						 res.status(422)
						 res.send(`There was an error getting previous bitcoin price: ${err}`)
          })
			})
   
   server.get('/compare', (req, res) => {
     currentPrice()
		  .then(price => {
		  previousPrice(price).then(prices => {
					res.status(200);
					res.send(prices);
				});
			})
			.catch(err => {
					res.status(422);
					res.send({error: 'compare failed'});
        });
		});

		function currentPrice() {
		  return new Promise((resolve, reject) => {
					fetch(CURRENT_PRICE)
					.then(res => res.json())
					.then(res => res.bpi.USD.rate_float)
					.then(price => {
							resolve(price);
					})
					.catch(err => {
							reject(err);
					});
			});
	}
    function previousPrice(current) {
		   return new Promise((resolve, reject) => {
       fetch(PREVIOUS_PRICE)
			 .then(res => res.json())
			 .then(res => res.bpi)
       .then(bpi => {
					 const yesterdayPrice = Object.values(bpi)[0];
           const response = {
					    comparison: getComparison(current, yesterdayPrice),
							current: `$${current} USD`,
							yesterdayBitcoinPrice: `$${yesterdayPrice} USD`
						};
						resolve(response);
					 })
			     .catch(err => {
							 reject(err);
						});
				});
		 }

     function getComparison(current, yesterday) {
			 if (current > yesterday) 
				 return `Bitcoin price has increased by $${current - yesterday} USD`;
			  if (current < yesterday)
           return `Bitcoin price has decreased by $${yesterday - current} USD`;
				if (current === yesterday)
					return `Bitcoin price has not changed.`;
		}

  server.listen(PORT, (err) => {
      if (err) {
         console.log(`There was an error: ${err}`);
       } else {
         console.log(`Server is listening on port ${PORT}`);
        }
      });

