<script>
  import dayjs from 'dayjs';
	export let date;
	export let d;
	export let priceRange;
	export let adults;
	export let children;
	export let infants;
	export let location;
</script>

<style>

	td {
		border: 1px solid black;
	}
	table {
    border-collapse: collapse;
		margin-top: 10px;
	}
</style>

<table>
	<tr>
		<th style="width: 20em;">
			Hotel
		</th>
		<th style="width: 20em;">
			Name
		</th>
		<th>
			Price (incl surcharge)
		</th>
		<th>
			Nights
		</th>
		<th>
			Capacity
		</th>
	</tr>
	{#each d.result as r, i}
		{#if 
			(
			!priceRange || priceRange == "empty" ||
				(priceRange == "500" && r.price_incl_surcharge < 500) ||
				(priceRange == "1000" && r.price_incl_surcharge >= 500 && r.price_incl_surcharge < 1000) || 
				(priceRange == "2000" && r.price_incl_surcharge >= 1000 && r.price_incl_surcharge < 2000) || 
				(priceRange == "3000" && r.price_incl_surcharge >= 2000 && r.price_incl_surcharge < 3000) || 
				(priceRange == "4000" && r.price_incl_surcharge >= 3000 && r.price_incl_surcharge < 4000) || 
				(priceRange == "5000" && r.price_incl_surcharge >= 4000 && r.price_incl_surcharge < 5000) || 
				(priceRange == "expensive") 
			) &&
				(
				( adults == "empty" || r.capacities.join("").indexOf(adults) != -1) &&
				( children == "empty" || r.capacities.join("").indexOf(children) != -1) &&
				( infants == "empty" || r.capacities.join("").indexOf(infants) != -1)
				) &&
				(location == "empty" || ((r.locations)||[]).indexOf(location) != -1)
			}
			<tr>
				<td>
					{r.location}
				</td>
				<td>
					<a href="https://luxuryescapes.com/au/offer/{r.slug}/{r.id_salesforce_external}">
						{r.name}
					</a><br>
					{r.id_salesforce_external}
				</td>
				<td>
					A${r.price_incl_surcharge} ({(r.price_incl_surcharge / r.lowest_price_package.number_of_nights).toFixed(0)}/night)
				</td>
				<td>
					{r.lowest_price_package.number_of_nights}🌒, ✓ {dayjs(date).format("ddd DD-MM-YYYY")}, ✈️  {dayjs(date).add(r.lowest_price_package.number_of_nights, "day").format("ddd DD-MM-YYYY")}
				</td>
				<td>
					{@html r.capacities.join("<br>")}
				</td>
			</tr>
		{/if}
	{/each}
</table>
