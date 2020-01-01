<script>
  import dayjs from 'dayjs';
	export let date;
	export let d;
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
			Name
		</th>
		<th>
			Price (incl surcharge)
		</th>
		<th>
			Nights
		</th>
		<th style="width: 20em;">
			Location
		</th>
		<th>
			Capacity
		</th>
	</tr>
	{#each d.result as r, i}
	<tr>
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
			{r.location}
		</td>
		<td>
			{@html r.capacities.join("<br>")}
		</td>
	</tr>
	{/each}
</table>
