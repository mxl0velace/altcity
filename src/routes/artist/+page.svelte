<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import type { PageData } from './$types';
    import { Card, CardPlaceholder, Gallery, Heading, Label, MultiSelect, Pagination, Search } from 'flowbite-svelte';

    let { data }: { data: PageData } = $props();

    let filterOptions = [
        {value: 'verified', name: "Verified Artists Only"}
    ]

    let artists = $state(data.artists);

    let artistName = $state("");
    let filters = $state([]);

    let currentPage = 1;
    let totalPages = artists.totalPages;
    let pages = $state(new Array(artists.totalPages).fill(1).map((e,i) => {
        return {name: i+1, active: (i+1 == artists.page)}
    }));

    let reloadSearch = async (e, page = 1) => {
        var result = await fetch(`/api/artist/search?` + new URLSearchParams({
            artistName: artistName,
            filters: filters.join(),
            page: page.toString(),
        }).toString());
        var tartists = await result.json();
        if (artistName != tartists.artistNameTerm) {
            return;
        } else {
            artists = tartists;
        }
        pages = new Array(artists.totalPages).fill(1).map((e,i) => {
        return {name: i+1, active: (i+1 == artists.page)}
        });
        currentPage = artists.page;
        totalPages = artists.totalPages;
    };

    let paginationClick = async (e) => {
        await reloadSearch(e, e.target.textContent);
    }

    let previousClick = async () => {
        if (currentPage != 1) {
            reloadSearch(0, currentPage - 1);
        }
    }

    let nextClick = async () => {
        if (currentPage != totalPages) {
            reloadSearch(0, currentPage + 1);
        }
    }

</script>
<div class="text-center">
    <Heading class="pb-2">Artists</Heading>
    <div class="grid gap-6 grid-cols-2 mb-2">
        <div>
            <Label for="artistName">Artist Name</Label>
            <Search type="text" size="md" placeholder="Artist Name" bind:value={artistName} on:input={reloadSearch}/>
        </div>
        <div>
            <Label for="filter">Filters</Label>
            <MultiSelect size="md" items={filterOptions} placeholder="Filters" bind:value={filters} on:change={reloadSearch}/>
        </div>
    </div>
    <Pagination class="pb-2" large bind:pages={pages} on:click={paginationClick} on:previous={previousClick} on:next={nextClick}/>

    <div class="grid gap-6 mb-6 grid-cols-3 md:grid-cols-7">
        {#each artists.items as artist}
        <Card href="/artist/{artist.id}" img={getImageURL(artist?.collectionId, artist?.id, artist?.logo)}>
            <Heading tag="h5">{artist.name}</Heading>
        </Card>
        {/each}
    </div>
</div>