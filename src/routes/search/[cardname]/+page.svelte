<script lang="ts">
    import { Card, Heading } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { getImageURL } from '$lib/utils';
    import Cardcard from '$lib/cardcard.svelte';

    let { data }: { data: PageData } = $props();
</script>

<Heading class="text-xl">
    Card: <a href={data.card.url}>{data.card.name}</a>
</Heading>

{#await data.results}
    Loading...
{:then results} 
<div class="grid gap-6 mb-6 md:grid-cols-7">
    {#each results.items as art}
        <Cardcard {data} {art}/>
    {/each}
</div>
{/await}