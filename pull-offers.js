const fetch = require("node-fetch");
const Redis = require("ioredis");

var redis = new Redis();
redis.select("1");
redis.flushdb();

async function day_crawl(sf_id, pkg_id) {
	// set redis keys as
	// HSET check_in:2019-12-25 0060I00000eMx0lQAC 1299 0060I00000eNR2yQAG 1799
	// surcharge + package price for the lowest price package for a particular day
	const day_url = `https://api.luxgroup.com/api/calendar/days?offer_id=${sf_id}&package_id=${pkg_id}&region=AU&number_of_adults=2&number_of_children=0&number_of_infants=0&number_of_packages=1&brand=luxuryescapes`;
	const day_fetched = await fetch(day_url);
	const days = await day_fetched.json();
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


const offers = ['0060I00000WKJNWQA5','0060I00000Y1U9jQAF','0060I00000Y2ef1QAB','0060I00000ZnIkUQAV','0060I00000ai4kZQAQ','0060I00000bPJrfQAG','0060I00000bgL0MQAU','0060I00000biHTLQA2','0060I00000cIH0YQAW','0060I00000cIKnpQAG','0060I00000cIeLBQA0','0060I00000cIlWpQAK','0060I00000cJ9wAQAS','0060I00000cJ9wZQAS','0060I00000cJMmDQAW','0060I00000cJSK7QAO','0060I00000cJrr5QAC','0060I00000cKLErQAO','0060I00000cKUMuQAO','0060I00000cKbf3QAC','0060I00000cL2XQQA0','0060I00000cLLBYQA4','0060I00000cpJazQAE','0060I00000cpJhbQAE','0060I00000cpMS6QAM','0060I00000cpnY7QAI','0060I00000cpqLCQAY','0060I00000cpsE1QAI','0060I00000cqAT2QAM','0060I00000cqS5vQAE','0060I00000cqbtVQAQ','0060I00000cqp8PQAQ','0060I00000cqpHHQAY','0060I00000crJTyQAM','0060I00000cs500QAA','0060I00000cs50AQAQ','0060I00000cs50KQAQ','0060I00000cs50eQAA','0060I00000cs51mQAA','0060I00000csBUOQA2','0060I00000csBW5QAM','0060I00000csDooQAE','0060I00000csP4UQAU','0060I00000csU3hQAE','0060I00000csclxQAA','0060I00000ct2RYQAY','0060I00000ct66kQAA','0060I00000ct9PiQAI','0060I00000ctM8rQAE','0060I00000d0Pj6QAE','0060I00000d0glYQAQ','0060I00000dZPjfQAG','0060I00000dZwGqQAK','0060I00000dZwKEQA0','0060I00000da2DhQAI','0060I00000da4rHQAQ','0060I00000daGFJQA2','0060I00000daLNpQAM','0060I00000daZ3OQAU','0060I00000daaA8QAI','0060I00000damvUQAQ','0060I00000danLTQAY','0060I00000dapdxQAA','0060I00000dazVOQAY','0060I00000db5dwQAA','0060I00000dbGJpQAM','0060I00000dbh5tQAA','0060I00000dbiWdQAI','0060I00000dbmRnQAI','0060I00000dbtNYQAY','0060I00000dc6mGQAQ','0060I00000dc8KxQAI','0060I00000dcVZ7QAM','0060I00000dcWbvQAE','0060I00000dcWl3QAE','0060I00000dcmaqQAA','0060I00000dcuwXQAQ','0060I00000dd7A3QAI','0060I00000ddQZZQA2','0060I00000ddUJ1QAM','0060I00000ddUNDQA2','0060I00000eK67eQAC','0060I00000eKIGEQA4','0060I00000eKVOFQA4','0060I00000eKcs9QAC','0060I00000eL1CdQAK','0060I00000eLCPjQAO','0060I00000eLFM1QAO','0060I00000eLFgNQAW','0060I00000eLHKcQAO','0060I00000eLIgnQAG','0060I00000eLJSPQA4','0060I00000eLKEiQAO','0060I00000eLKLoQAO','0060I00000eLMHqQAO','0060I00000eLMdrQAG','0060I00000eLd4TQAS','0060I00000eLeQpQAK','0060I00000eMSkuQAG','0060I00000eMTY1QAO','0060I00000eMU5cQAG','0060I00000eMWDlQAO','0060I00000eMY1pQAG','0060I00000eMbE8QAK','0060I00000eMbHqQAK','0060I00000eMi8jQAC','0060I00000eMjUqQAK','0060I00000eMmoaQAC','0060I00000eMsEIQA0','0060I00000eMsXGQA0','0060I00000eMx0lQAC','0060I00000eN8zKQAS','0060I00000eNCD9QAO','0060I00000eNPnZQAW','0060I00000eNR2yQAG','0062y000002LdE1AAK','0062y000002LdUJAA0','0062y000002LdUnAAK','0062y000002LdXXAA0','0062y000002LdZTAA0','0062y000002LdZdAAK','0062y000002LdnLAAS','0062y000002LdsLAAS','0062y000002Le1DAAS','0062y000002LeHVAA0','0062y000002LeLhAAK','0062y000002LeMBAA0','0062y000002LeOWAA0','0062y000002LeSJAA0','0062y000002LeZPAA0','0062y000002LeaNAAS','0062y000002LeotAAC','0062y000002LetZAAS','0062y000002LeumAAC','0062y000002LeyPAAS','0062y000002LezSAAS','0062y000002Lf3PAAS','0062y000002Lf5QAAS','0062y000002LfBsAAK','0062y000002LfCgAAK','0062y000002LfNZAA0','0062y000002LfThAAK','0062y000002Lfe1AAC','0062y000002LfoGAAS','0062y000002LfqbAAC','0062y000002Lg6eAAC','0062y000002LgQjAAK','0062y000002LgZMAA0','0062y000002LgcQAAS','0062y000002LgftAAC','0062y000002Lgr7AAC','0062y000002LgrvAAC','0062y000002Lgs0AAC','0062y000002Lgs5AAC','0062y000002LguGAAS','0062y000002LgwlAAC','0062y000002LgwqAAC','0062y000002LhaCAAS','0062y000002LhbyAAC','0062y000002LhpHAAS','0062y000002LhrSAAS','0062y000002LhsuAAC','0062y000002LhveAAC','0062y000002Lhy9AAC','0062y000002LhyOAAS','0062y000002LhyTAAS','0062y000002LhyYAAS','0062y000002Li9kAAC','0062y000002LiINAA0','0062y000002LipRAAS','0062y000002Lj2fAAC','0062y000002Lj2pAAC','0062y000002LjPFAA0','0062y000002LjPUAA0','0062y000002LjWkAAK','0062y000002LjYHAA0','0062y000002LjhiAAC','0062y000002LjyZAAS','0062y000002Lk0pAAC','0062y000002Lk1xAAC','0062y000002LlCdAAK'];

async function crawl() {
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
		await day_crawl(sf_id, pkg_id);
		await capacity_crawl(sf_id, pkg.fk_property_id, pkg.fk_room_type_id);
	}
	redis.quit();
}

crawl();
