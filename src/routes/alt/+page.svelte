<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import type { PageData } from './$types';
    import { Card, CardPlaceholder, Gallery, Heading } from 'flowbite-svelte';

    let { data }: { data: PageData } = $props();
</script>
<div class="text-center">
    <Heading class="pb-2">Alt Art Showcase</Heading>
    {#await data.arts}
        <CardPlaceholder/>
    {:then arts}
    <div class="grid gap-6 mb-6 md:grid-cols-7">
        {#each arts.items as art}
        <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
            <Heading tag="h5">{art?.title}</Heading>
            <p class="font-thin">{art?.cardname}, {art?.expand?.artist?.name}</p>
        </Card>

        {/each}
    </div>
    {/await}
</div>