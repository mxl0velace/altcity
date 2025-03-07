<script lang="ts">
    import Cardcard from '$lib/cardcard.svelte';
    import { getImageURL } from '$lib/utils';
    import type { PageData } from './$types';
    import { Card, CardPlaceholder, Gallery, Heading, Input, Label, MultiSelect, Pagination, Search } from 'flowbite-svelte';

    let { data }: { data: PageData } = $props();

    let filterOptions = [
        {value: 'verified', name: "Verified Artists Only"}
    ]

    let arts = $state(data.arts);

    let cardName = $state("");
    let artistName = $state("");
    let filters = $state([]);

    let currentPage = 1;
    let totalPages = arts.totalPages;
    let pages = $state(new Array(arts.totalPages).fill(1).map((e,i) => {
        return {name: i+1, active: (i+1 == arts.page)}
    }));

    let reloadSearch = async (e, page = 1) => {
        var result = await fetch(`/api/card/search?` + new URLSearchParams({
            cardName: cardName,
            artistName: artistName,
            filters: filters.join(),
            page: page.toString(),
        }).toString());
        var tarts = await result.json();
        if (cardName != tarts.cardNameTerm || artistName != tarts.artistNameTerm) {
            return;
        } else {
            arts = tarts;
        }
        pages = new Array(arts.totalPages).fill(1).map((e,i) => {
        return {name: i+1, active: (i+1 == arts.page)}
        });
        currentPage = arts.page;
        totalPages = arts.totalPages;
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
    <Heading class="pb-2">Alt Arts</Heading>
    <div class="grid gap-6 grid-cols-3 mb-2">
        <div>
            <Label for="cardName">Card/Art Name</Label>
            <Search id="cardName" size="md" placeholder="Card/Art Name" bind:value={cardName} on:input={reloadSearch}/>
        </div>
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
        {#if arts}
        {#each arts.items as art}
            <Cardcard {data} {art}/>
        {/each}
        {/if}
    </div>
</div>