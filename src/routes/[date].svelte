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
  import OfferTable from '../components/OfferTable.svelte';
  import SvelteCalendar from 'svelte-calendar';
  import dayjs from 'dayjs';
	export let d;
	export let date;
  let formattedSelected;
  let dateChosen;
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
	start={new Date()}
	end={new Date(2022,1,1)}
	bind:formattedSelected
	bind:dateChosen
	format={date => dayjs(date).format('YYYY-MM-DD')}>
	<button class='custom-button'>
		Change check-in from {date}
	</button>
</SvelteCalendar>

<OfferTable {date} {d}>
</OfferTable>
