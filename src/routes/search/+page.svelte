<script lang="ts">
    import { Card, Heading } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { getImageURL } from '$lib/utils';

    let { data }: { data: PageData } = $props();
</script>

<Heading class="text-xl">
    Search: {data.query}
</Heading>

{#await data.results}
    Loading...
{:then results} 
<div class="grid gap-6 mb-6 md:grid-cols-7">
    {#each results.items as art}
    <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
        <Heading tag="h5" class="">{art?.title}</Heading>
        <p class="font-thin">{art?.cardname}</p>
        <p class="font-thin">{art?.expand?.artist?.name}</p>
    </Card>
    {/each}
</div>
{/await}