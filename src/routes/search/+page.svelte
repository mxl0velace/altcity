<script lang="ts">
    import { Card, Heading } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { getImageURL } from '$lib/utils';

    let { data }: { data: PageData } = $props();
</script>

you searched for {data.query}

{#await data.results}
    Loading...
{:then results} 
    {#each results.items as art}
    <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
        <Heading tag="h5">{art?.title}</Heading>
        <p class="font-thin">{art?.cardname}</p>
    </Card>

    {/each}
{/await}