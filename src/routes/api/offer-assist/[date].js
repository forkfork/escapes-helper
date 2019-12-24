import redis from '../../../services/redis';

export async function get(req, res, next) {
  const { date } = req.params;

	let date_offers = await redis.hgetall(`check_in:${date}`)
	let date_sf_ids = Object.keys(date_offers);
	let offer_details = [];
	for (let i=0; i<date_sf_ids.length; i++) {
		offer_details.push(JSON.parse(await redis.get(`offer:${date_sf_ids[i]}`)));
		offer_details[i].price_incl_surcharge = date_offers[date_sf_ids[i]];
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
