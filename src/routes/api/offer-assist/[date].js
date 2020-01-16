import redis from '../../../services/redis';

export async function get(req, res, next) {
  const { date } = req.params;

	console.log("searching date", date);

	let date_offers = await redis.hgetall(`check_in:${date}`)
	let date_sf_ids = Object.keys(date_offers);
	let offer_details = [];
	for (let i=0; i<date_sf_ids.length; i++) {
		let offer_obj = await redis.get(`offer:${date_sf_ids[i]}`)
		let price_incl_surcharge = Number(date_offers[date_sf_ids[i]]);
		offer_details.push(JSON.parse(offer_obj));
		offer_details[offer_details.length - 1].price_incl_surcharge = price_incl_surcharge;
		let capacity = await redis.smembers(`capacity:${date_sf_ids[i]}`)
		offer_details[offer_details.length - 1].capacities = capacity;
	}

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify({
		status: 200,
		message: 'svelte is awesome!',
	  result: offer_details
  }));

}
