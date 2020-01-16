<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`http://127.0.0.1:3000/api/offer-assist/${params.date}`);
    const data = await res.json();

   if (res.status === 200) {
      return { d: data, date: params.date };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>


<script>
  import OfferTable from '../components/OfferTable.svelte';
  import { onMount } from 'svelte';
  import SvelteCalendar from 'svelte-calendar';
  import dayjs from 'dayjs';
  export let d;
  export let date;
  export let priceRange = "empty";
  export let adults = "empty";
  export let children = "empty";
  export let infants = "empty";
  export let location = "empty";
  export let holiday_type = "empty";
  let formattedSelected;
  let dateChosen;
  async function refetch(newDate) {
    const res = await fetch(`/api/offer-assist/${newDate}`);
    const data = await res.json();

   if (res.status === 200) {
      d = data;
      date = newDate;
    } else {
      this.error(res.status, data.message);
    }
  }
  export let locations = [
      "Asia",
      "Europe",
      "Australia",
      "Bali",
      "Indonesia",
      "Italy",
      "New South Wales",
      "Queensland",
      "South Pacific",
      "France",
      "Greece",
      "Ireland",
      "Malaysia",
      "Maldives",
      "Thailand",
      "ACT",
      "Bhutan",
      "Caribbean",
      "Dubai",
      "Egypt",
      "Fiji",
      "Germany",
      "Gold Coast",
      "Japan",
      "Khao Lak",
      "Middle East",
      "Nepal",
      "New Zealand",
		  "Philippines",
      "Phuket",
      "Rest of the world",
      "Russia",
      "Singapore",
      "Slovenia",
      "South Africa",
      "South Australia",
      "Spain",
      "Sri Lanka",
      "Tasmania",
      "Turkey",
      "USA",
      "United Kingdom",
      "Vanuatu",
      "Vietnam"];
  export let holiday_types = [
			"Adults-only",
			"All-inclusive",
			"Boutique",
			"City break",
			"Cruises",
			"Family friendly",
			"Group",
			"Homes & Villas",
			"Honeymoon",
			"Party vibe",
			"Relaxed",
			"Romantic",
			"Short Stay",
			"Spa break",
			"Sun & Beach",
			"Sustainable Travel",
			"Tours",
			"Tours and cruises",
			"Tours by Luxury Escapes",
			"Villa"];
  $: if (dateChosen && formattedSelected) { refetch(formattedSelected) };
  
</script>

<style>
  .logo {
    width: 20%;
  }
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
  .custom-button {
    display: inline-block;
    background: rgb(0, 120, 255);
    color: #eee;
    border: 1px solid rgb(0, 100, 255);
    text-align: center;
    padding: 15px 30px;
    cursor: pointer;
    border-radius: 2px;
  }
  .custom-input {
    display: inline-block;
    background: rgb(0, 255, 120);
    color: #000;
    border: 1px solid rgb(0, 255, 100);
    text-align: center;
    padding: 15px 30px;
    cursor: pointer;
    border-radius: 2px;
  }
</style>

<svelte:head>
  <title>Search Buddy</title>
</svelte:head>

<h1>
<img class="logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAuMSAyMi42MiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOmN1cnJlbnRDb2xvcn08L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMiI+PGcgaWQ9IkxheWVyXzEtMiI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIuMzMgMjB2Mi40MkgwVi4xNmgyLjU1VjIwek0zMi40NyAxMy4yOWMwIDUuOC0zLjUgOS4zLTkuMzMgOS4zcy05LjQtMy41LTkuNC05LjNWLjE2aDIuNTV2MTMuMTNjMCA0LjMzIDIuNjEgNi44NSA2Ljg1IDYuODVzNi43OS0yLjUyIDYuNzktNi44NVYuMTZoMi41NXpNNTQuNjQgMjIuNDZoLTMuMDZsLTYuNzktOS4zMy02LjcyIDkuMzNoLTNMNDMuMjcgMTEgMzUuNjUuMTZoM2w2LjE1IDguNkw1MSAuMTZoM2wtNy41OCAxMC43ek03Ni4yMSAxMy4yOWMwIDUuOC0zLjUgOS4zLTkuMzMgOS4zcy05LjQtMy41LTkuNC05LjNWLjE2SDYwdjEzLjEzYzAgNC4zMyAyLjYxIDYuODUgNi44NSA2Ljg1czYuNzktMi41MiA2Ljc5LTYuODVWLjE2aDIuNTV6TTkxLjQ3IDE1LjM2Yy0uNDggMC0xIC4wNi0xLjUuMDZIODR2N2gtMi41Vi4xNkg5MGM1LjU4IDAgOC43OSAyLjc0IDguNzkgNy40OSAwIDMuNy0xLjc4IDYuMTgtNSA3LjIzTDk5IDIyLjQ2aC0yLjl6TTkwIDEzYzQgMCA2LjM0LTEuNzggNi4zNC01LjI2Uzk0IDIuNjEgOTAgMi42MWgtNlYxM3pNMTExLjE5IDIyLjQ2aC0yLjUydi03LjU1TDEwMCAuMTZoMi42NGw3LjIzIDExLjYzTDExNy4wNS4xNmgyLjYxbC04LjQ3IDE0LjY2ek0xMjUuNTYgMy41NHY2aDEwLjl2My4zOGgtMTAuOXY2LjE1aDEyLjU1djMuMzhIMTIxLjhWLjE2aDE1LjkzdjMuMzh6TTE1Ni44OCAyLjI5bC0xLjU2IDMuMzFhMTMuMzQgMTMuMzQgMCAwMC02LjUzLTIuMDdjLTIuMiAwLTMuNjMuODMtMy42MyAyLjMzIDAgNC44OCAxMiAyLjI2IDEyIDEwLjI5IDAgNC0zLjUgNi40NC04LjQxIDYuNDRhMTMuNzIgMTMuNzIgMCAwMS05LjExLTMuNTRsMS42My0zLjI1YTExLjc1IDExLjc1IDAgMDA3LjU1IDMuMjVjMi42MSAwIDQuMTctMSA0LjE3LTIuNzEgMC01LTEyLTIuMi0xMi0xMC4xMyAwLTMuODIgMy4yOC02LjIxIDguMTItNi4yMWExNC41MyAxNC41MyAwIDAxNy43NyAyLjI5ek0xNzkgMy41bC0yLjIgMi43NGE4LjcxIDguNzEgMCAwMC02LjIxLTIuODQgNy44NSA3Ljg1IDAgMTAwIDE1LjcxIDkuMjIgOS4yMiAwIDAwNi4yMS0yLjY0TDE3OSAxOWExMi42NiAxMi42NiAwIDAxLTguNjMgMy42NiAxMS4zMSAxMS4zMSAwIDAxLTExLjYtMTEuMzRjMC02LjM0IDUuMTMtMTEuMjEgMTEuNzItMTEuMjFBMTIuMzEgMTIuMzEgMCAwMTE3OSAzLjV6TTE4NC44NSAxNy40M2wtMi4xMyA1aC0zLjkyTDE4OC42NC4xNmgzLjg1bDkuNzUgMjIuM2gtNGwtMi4xMy01em01LjYxLTEzLjI1bC00LjIxIDkuOTFoOC40MXpNMjEzLjE0LjE2YzUuNjEgMCA4LjgzIDIuNzcgOC44MyA3LjYyIDAgNS0zLjIyIDgtOC44MyA4SDIwOHY2LjcyaC0zLjc2Vi4xNnpNMjA4IDEyLjM2aDVjMy40NCAwIDUuMzgtMS40NyA1LjM4LTQuNDlzLTEuOTYtNC4zMy01LjM4LTQuMzNoLTV6TTIyOC41IDMuNTR2NmgxMC45djMuMzhoLTEwLjl2Ni4xNWgxMi41NXYzLjM4aC0xNi4zMVYuMTZoMTUuOTN2My4zOHpNMjU5LjgyIDIuMjlsLTEuNTYgMy4zMWExMy4zNCAxMy4zNCAwIDAwLTYuNTMtMi4wN2MtMi4yIDAtMy42My44My0zLjYzIDIuMzMgMCA0Ljg4IDEyIDIuMjYgMTIgMTAuMjkgMCA0LTMuNSA2LjQ0LTguNDEgNi40NGExMy43MiAxMy43MiAwIDAxLTkuMTEtMy41NGwxLjYzLTMuMjVhMTEuNzUgMTEuNzUgMCAwMDcuNTUgMy4yNWMyLjYxIDAgNC4xNy0xIDQuMTctMi43MSAwLTUtMTItMi4yLTEyLTEwLjEzQzI0My44OSAyLjM5IDI0Ny4xNyAwIDI1MiAwYTE0LjUzIDE0LjUzIDAgMDE3LjgyIDIuMjl6Ii8+PC9nPjwvZz48L3N2Zz4=" /> SearchBuddy</h1>

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
<br>
<select on:change={(e) => adults = e.target.value}>
  <option value=empty>Select Adults (2A)</option>
  <option value=3A>3A</option>
  <option value=4A>4A</option>
  <option value=5A>5A</option>
</select>
<select on:change={(e) => children = e.target.value}>
  <option value=empty>Select Children (0C)</option>
  <option value=1C>1C</option>
  <option value=2C>2C</option>
  <option value=3C>3C</option>
</select>
<select on:change={(e) => infants = e.target.value}>
  <option value=empty>Select Infants (0I)</option>
  <option value=1I>1I</option>
  <option value=2I>2I</option>
  <option value=3I>3I</option>
</select>
<select on:change={(e) => priceRange = e.target.value}>
  <option value=empty>Select Price</option>
  <option value=500>$0 - $499</option>
  <option value=1000>$500 - $999</option>
  <option value=2000>$1000 - $1999</option>
  <option value=3000>$2000 - $2999</option>
  <option value=4000>$3000 - $3999</option>
  <option value=5000>$4000 - $4999</option>
  <option value=expensive>$5000+</option>
</select>
<select on:change={(e) => location = e.target.value}>
  <option value=empty>Select Location</option>
  {#each locations as r, i}
  <option value={r}>{r}</option>
  {/each}
</select>
<select on:change={(e) => holiday_type = e.target.value}>
  <option value=empty>Select Holiday Type</option>
  {#each holiday_types as r, i}
  <option value={r}>{r}</option>
  {/each}
</select>
<OfferTable {date} {d} {priceRange} {adults} {children} {infants} {location} {holiday_type}>
</OfferTable>
