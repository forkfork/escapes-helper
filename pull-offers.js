const fetch = require("node-fetch");
const Redis = require("ioredis");
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

var redis = new Redis();

async function fetch_active_offers() {
	// Queries the U.S. given names dataset for the state of Texas.

	const query = `
SELECT
DISTINCT schedule.fk_offer_salesforce_id
FROM
\`bigquery-162623\`.offer_service_public.schedule
INNER JOIN \`bigquery-162623\`.offer_service_public.offer ON
schedule.fk_offer_salesforce_id = offer.id_salesforce_external
INNER JOIN \`bigquery-162623\`.offer_service_public.package ON
schedule.fk_offer_salesforce_id = package.fk_offer_salesforce_id
WHERE
brand = 'luxuryescapes'
AND region IN ('world', 'AU')
AND START < current_timestamp()
AND current_timestamp() < schedule.end
AND schedule.type = 'online_purchase'
AND offer.status = 'content-approved'
AND package.status = 'content-approved';
`;

	// For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
	const options = {
		query: query,
		// Location must match that of the dataset(s) referenced in the query.
		location: 'US',
	};

	// Run the query as a job
	const [job] = await bigquery.createQueryJob(options);
	console.log(`Job ${job.id} started.`);

	// Wait for the query to finish
	const [rows] = await job.getQueryResults();

	// Print the results
	console.log('Rows:');
	let ids = [];
	await redis.del("active_offers");
	for (let i=0; i<rows.length; i++) {
		await redis.sadd("active_offers", rows[i].fk_offer_salesforce_id);
	}
	console.log("written " + rows.length + " offers to active_offers");
}

async function day_crawl(sf_id, pkg_id, number_of_nights) {
	// set redis keys as
	// HSET check_in:2019-12-25 0060I00000eMx0lQAC 1299 0060I00000eNR2yQAG 1799
	// surcharge + package price for the lowest price package for a particular day
	const day_url = `https://api.luxgroup.com/api/calendar/days?offer_id=${sf_id}&package_id=${pkg_id}&region=AU&number_of_nights=${number_of_nights}&number_of_adults=2&number_of_children=0&number_of_infants=0&number_of_packages=1&brand=luxuryescapes`;
	const day_fetched = await fetch(day_url);
	const days = await day_fetched.json();
	if (!days.result) {
		return;
	}
	const day_prices = days.result.prices;
	for (let n=0; n<day_prices.length; n++) {
		let month_prices = day_prices[n].months;
		for (let j=0; j<month_prices.length; j++) {
			let days_data = month_prices[j].days;
			for (let k=0; k<days_data.length; k++) {
				let check_in = days_data[k].check_in;
				let surcharge = days_data[k].surcharge;
				let price = days_data[k].accommodation && days_data[k].accommodation.amounts.price;
				if (price != null) {
					console.log(`check_in:${check_in}`, sf_id, surcharge + price);
					redis.hset(`check_in:${check_in}`, sf_id, surcharge + price);
				}
			}
		}
	}
}

async function capacity_crawl(sf_id, property_id, room_type_id) {
	const room_url = `https://api.luxgroup.com/api/properties/${property_id}/room-types/${room_type_id}`
	const room_fetched = await fetch(room_url);
	const room = await room_fetched.json();
	let capacities = room.result.capacities;
	for (let j=0; j<capacities.length; j++) {
		await redis.sadd(`capacity:${sf_id}`, `${capacities[j].adults}A, ${capacities[j].children}C, ${capacities[j].infants}I`);
		console.log(`capacity:${sf_id}`, `${capacities[j].adults},${capacities[j].children},${capacities[j].infants}`);
	}
}

function shrink_offer(offer) {
	return {
	  name: offer.name,
		id_salesforce_external: offer.id_salesforce_external,
		slug: offer.slug,
		location: offer.location,
		locations: offer.locations,
		holiday_types: offer.holiday_types,
		lowest_price_package: {
		  id_salesforce_external: offer.lowest_price_package.id_salesforce_external,
		  number_of_nights: offer.lowest_price_package.number_of_nights,
			fk_property_id: offer.lowest_price_package.fk_property_id,
			fk_room_type_id: offer.lowest_price_package.fk_room_type_id,
      property: {
			  longitude: offer.lowest_price_package.property.longitude,
			  latitude: offer.lowest_price_package.property.latitude
			}
		}
	};
}
async function offer_crawl(sf_id) {
  const offer_url =  `https://api.luxgroup.com/api/public-offers/${sf_id}`;
	console.log(offer_url);
	const fetched = await fetch(offer_url);
	const offer = await fetched.json();
	return offer.result;
}

async function crawl() {
	await redis.select("1");
	await redis.flushdb();
	await fetch_active_offers();
	let offers = await redis.smembers("active_offers");
	console.log("offers is", offers);
	for (let i=0; i<offers.length; i++) {
	  let offer = await offer_crawl(offers[i]);
		if (!offer) {
			continue;
		}
		let pkg = offer.lowest_price_package;
		if (!pkg) {
			continue;
		}
		let property = pkg.property;
		if (!property) {
			continue;
		}
		offer = shrink_offer(offer);
		console.log("fetched", offers[i]);
		let sf_id = offers[i];
		let pkg_id = pkg.id_salesforce_external;
		redis.set(`offer:${sf_id}`, JSON.stringify(offer));
		redis.geoadd("geo_offers", property.longitude, property.latitude, sf_id);
		await day_crawl(sf_id, pkg_id, 8);
		await day_crawl(sf_id, pkg_id, 7);
		await day_crawl(sf_id, pkg_id, 5);
		await day_crawl(sf_id, pkg_id, 3);
		await day_crawl(sf_id, pkg_id, 2);
		await capacity_crawl(sf_id, pkg.fk_property_id, pkg.fk_room_type_id);
	}
	console.log("swapping dbs 0 and 1 in redis");
	await redis.swapdb("0", "1");
	console.log("DONE!");
	redis.quit();
}

crawl();
