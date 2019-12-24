const fetch = require("node-fetch");
const Redis = require("ioredis");

var redis = new Redis();

async function crawl() {
	const root = "https://api.luxgroup.com/api/slim/public-offers?includes=booking_type,name,id_salesforce_external,type,location,run_date,end_date,slug,number_of_nights_summary,location_heading,location_subheading,sale_unit,flights_enabled,flight_regions,lowest_price_package.name,lowest_price_package._links,lowest_price_package.sale_unit,lowest_price_package.number_of_nights,lowest_price_package.number_of_days,lowest_price_package.id_salesforce_external,lowest_price_package.offer_id_salesforce_external,lowest_price_package.price,lowest_price_package.value,lowest_price_package.currency_code,lowest_price_package.property.name,lowest_price_package.property.address,lowest_price_package.property.id_salesforce_external,lowest_price_package.property.latitude,lowest_price_package.property.longitude,lowest_price_package.tour.name,lowest_price_package.tour.id,lowest_price_package.tour.id_salesforce_external,lowest_price_package.tour.latitude,lowest_price_package.tour.longitude,lowest_price_package.price_with_flights,lowest_price_package.value_with_flights,lowest_price_package.sale_unit_with_flights,lowest_price_package.room_occupancy&trim=images&region=AU&brand=luxuryescapes";
	const fetched = await fetch(root);
	const offers = await fetched.json();
	for (let i=0; i<offers.result.length; i++) {
		let pkg = offers.result[i].lowest_price_package;
		let property = pkg.property;
		if (!property) {
			continue;
		}
		let sf_id = offers.result[i].id_salesforce_external;
		let pkg_id = pkg.id_salesforce_external;
		redis.set(`offer:${sf_id}`, JSON.stringify(offers.result[i]));
		redis.geoadd("geo_offers", property.longitude, property.latitude, sf_id);
		const day_url = `https://api.luxgroup.com/api/calendar/days?offer_id=${sf_id}&package_id=${pkg_id}&region=AU&number_of_adults=2&number_of_children=0&number_of_infants=0&number_of_packages=1&brand=luxuryescapes`;
		const day_fetched = await fetch(day_url);
		const days = await day_fetched.json();
		console.log(days);
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
	redis.quit();
}

crawl();
