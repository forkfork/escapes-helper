<script context="module">
  export async function preload({ params, query }) {
    console.log("fetching", `http://127.0.0.1:3000/api/offer-assist/${params.date}?near=${query.near}`);
    const res = await this.fetch(`http://127.0.0.1:3000/api/offer-assist/${params.date}?near=${query.near}`);
    const data = await res.json();

    console.log(query);

    if (res.status === 200) {
      return { d: data, date: params.date, loadNearby: query.near || '' };
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
  export let nearby;
  export let loadNearby;
  let formattedSelected;
  let dateChosen;
	function changeUrl(url) {
	  if (typeof(document) != 'undefined') {
			document.location = url;
		}
  }
  $: if (nearby && nearby.length == 18) { changeUrl("/" + date + "?near=" + nearby); };
  $: if (dateChosen && formattedSelected) { changeUrl("/" + formattedSelected + "?near=" + nearby); };
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
</style>

<svelte:head>
  <title>Escapes Helper</title>
</svelte:head>

<h1>
<img class="logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAuMSAyMi42MiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOmN1cnJlbnRDb2xvcn08L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMiI+PGcgaWQ9IkxheWVyXzEtMiI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIuMzMgMjB2Mi40MkgwVi4xNmgyLjU1VjIwek0zMi40NyAxMy4yOWMwIDUuOC0zLjUgOS4zLTkuMzMgOS4zcy05LjQtMy41LTkuNC05LjNWLjE2aDIuNTV2MTMuMTNjMCA0LjMzIDIuNjEgNi44NSA2Ljg1IDYuODVzNi43OS0yLjUyIDYuNzktNi44NVYuMTZoMi41NXpNNTQuNjQgMjIuNDZoLTMuMDZsLTYuNzktOS4zMy02LjcyIDkuMzNoLTNMNDMuMjcgMTEgMzUuNjUuMTZoM2w2LjE1IDguNkw1MSAuMTZoM2wtNy41OCAxMC43ek03Ni4yMSAxMy4yOWMwIDUuOC0zLjUgOS4zLTkuMzMgOS4zcy05LjQtMy41LTkuNC05LjNWLjE2SDYwdjEzLjEzYzAgNC4zMyAyLjYxIDYuODUgNi44NSA2Ljg1czYuNzktMi41MiA2Ljc5LTYuODVWLjE2aDIuNTV6TTkxLjQ3IDE1LjM2Yy0uNDggMC0xIC4wNi0xLjUuMDZIODR2N2gtMi41Vi4xNkg5MGM1LjU4IDAgOC43OSAyLjc0IDguNzkgNy40OSAwIDMuNy0xLjc4IDYuMTgtNSA3LjIzTDk5IDIyLjQ2aC0yLjl6TTkwIDEzYzQgMCA2LjM0LTEuNzggNi4zNC01LjI2Uzk0IDIuNjEgOTAgMi42MWgtNlYxM3pNMTExLjE5IDIyLjQ2aC0yLjUydi03LjU1TDEwMCAuMTZoMi42NGw3LjIzIDExLjYzTDExNy4wNS4xNmgyLjYxbC04LjQ3IDE0LjY2ek0xMjUuNTYgMy41NHY2aDEwLjl2My4zOGgtMTAuOXY2LjE1aDEyLjU1djMuMzhIMTIxLjhWLjE2aDE1LjkzdjMuMzh6TTE1Ni44OCAyLjI5bC0xLjU2IDMuMzFhMTMuMzQgMTMuMzQgMCAwMC02LjUzLTIuMDdjLTIuMiAwLTMuNjMuODMtMy42MyAyLjMzIDAgNC44OCAxMiAyLjI2IDEyIDEwLjI5IDAgNC0zLjUgNi40NC04LjQxIDYuNDRhMTMuNzIgMTMuNzIgMCAwMS05LjExLTMuNTRsMS42My0zLjI1YTExLjc1IDExLjc1IDAgMDA3LjU1IDMuMjVjMi42MSAwIDQuMTctMSA0LjE3LTIuNzEgMC01LTEyLTIuMi0xMi0xMC4xMyAwLTMuODIgMy4yOC02LjIxIDguMTItNi4yMWExNC41MyAxNC41MyAwIDAxNy43NyAyLjI5ek0xNzkgMy41bC0yLjIgMi43NGE4LjcxIDguNzEgMCAwMC02LjIxLTIuODQgNy44NSA3Ljg1IDAgMTAwIDE1LjcxIDkuMjIgOS4yMiAwIDAwNi4yMS0yLjY0TDE3OSAxOWExMi42NiAxMi42NiAwIDAxLTguNjMgMy42NiAxMS4zMSAxMS4zMSAwIDAxLTExLjYtMTEuMzRjMC02LjM0IDUuMTMtMTEuMjEgMTEuNzItMTEuMjFBMTIuMzEgMTIuMzEgMCAwMTE3OSAzLjV6TTE4NC44NSAxNy40M2wtMi4xMyA1aC0zLjkyTDE4OC42NC4xNmgzLjg1bDkuNzUgMjIuM2gtNGwtMi4xMy01em01LjYxLTEzLjI1bC00LjIxIDkuOTFoOC40MXpNMjEzLjE0LjE2YzUuNjEgMCA4LjgzIDIuNzcgOC44MyA3LjYyIDAgNS0zLjIyIDgtOC44MyA4SDIwOHY2LjcyaC0zLjc2Vi4xNnpNMjA4IDEyLjM2aDVjMy40NCAwIDUuMzgtMS40NyA1LjM4LTQuNDlzLTEuOTYtNC4zMy01LjM4LTQuMzNoLTV6TTIyOC41IDMuNTR2NmgxMC45djMuMzhoLTEwLjl2Ni4xNWgxMi41NXYzLjM4aC0xNi4zMVYuMTZoMTUuOTN2My4zOHpNMjU5LjgyIDIuMjlsLTEuNTYgMy4zMWExMy4zNCAxMy4zNCAwIDAwLTYuNTMtMi4wN2MtMi4yIDAtMy42My44My0zLjYzIDIuMzMgMCA0Ljg4IDEyIDIuMjYgMTIgMTAuMjkgMCA0LTMuNSA2LjQ0LTguNDEgNi40NGExMy43MiAxMy43MiAwIDAxLTkuMTEtMy41NGwxLjYzLTMuMjVhMTEuNzUgMTEuNzUgMCAwMDcuNTUgMy4yNWMyLjYxIDAgNC4xNy0xIDQuMTctMi43MSAwLTUtMTItMi4yLTEyLTEwLjEzQzI0My44OSAyLjM5IDI0Ny4xNyAwIDI1MiAwYTE0LjUzIDE0LjUzIDAgMDE3LjgyIDIuMjl6Ii8+PC9nPjwvZz48L3N2Zz4=" /> Helper</h1>

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
<input type=text class='custom-button' placeholder='near salesforce id' bind:value={nearby} />

<OfferTable {date} {d}>
</OfferTable>
