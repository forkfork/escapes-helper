<script context="module">
	export async function preload({ params, query }) {
	  console.log("fetching", `http://127.0.0.1:3000/api/offer-assist/${params.date}?near=${query.near}`);
		const res = await this.fetch(`http://127.0.0.1:3000/api/offer-assist/${params.date}?near=${query.near}`);
		const data = await res.json();

		console.log(query);

		if (res.status === 200) {
			return { d: data, date: params.date };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let d;
	export let date;
  import SvelteCalendar from 'svelte-calendar';
  import dayjs from 'dayjs';
  let formattedSelected;
  let dateChosen;
	//formattedSelected = .date;
  console.log(formattedSelected, date);
  $: if (dateChosen && formattedSelected) { document.location = "/" + formattedSelected };
</script>

<style>
	.content :global(h2) {
		font-size: 1.4em;
		font-weight: 500;
	}

	td {
		border: 1px solid black;
	}
	table {
    border-collapse: collapse;
	}
</style>

<svelte:head>
	<title>Escapes Helper</title>
</svelte:head>

<h1>Escapes Helper</h1>

<SvelteCalendar
	bind:formattedSelected
	bind:dateChosen
	format={date => dayjs(date).format('YYYY-MM-DD')}>
	<button class='custom-button'>
		Change check-in from {date}
	</button>
</SvelteCalendar>

<div class='content'>
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
				{r.price_incl_surcharge}
			</td>
			<td>
				{r.lowest_price_package.number_of_nights}<br>
				Check-in {dayjs(date).format("ddd DD-MM-YYYY")}<br>
				Check-out {dayjs(date).add(r.lowest_price_package.number_of_nights, "day").format("ddd DD-MM-YYYY")}
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
</div>
