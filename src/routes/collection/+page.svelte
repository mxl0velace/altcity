<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import { Card, Heading } from 'flowbite-svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let results = data.fulluser?.expand?.cardcollection_via_owner[0]?.expand?.cards;
</script>
<div class="text-center">
<Heading class="pb-2">Your Collection</Heading>
<div class="grid gap-6 mb-6 md:grid-cols-7">
    {#each results as art}
    <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
        <Heading tag="h5" class="">{art?.title}</Heading>
        <p class="font-thin">{art?.cardname}, {art?.expand?.artist?.name}</p>
    </Card>
    {/each}
</div>
</div>