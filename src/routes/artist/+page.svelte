<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import type { PageData } from './$types';
    import { Card, CardPlaceholder, Gallery, Heading } from 'flowbite-svelte';

    let { data }: { data: PageData } = $props();
</script>
<div class="text-center">
    <Heading class="pb-2">Artist Showcase</Heading>
    {#await data.artists}
        <CardPlaceholder/>
    {:then artists}
    <div class="grid gap-6 mb-6 md:grid-cols-7">
        {#each artists.items as artist}
        <Card href="/artist/{artist.id}" img={getImageURL(artist?.collectionId, artist?.id, artist?.logo)}>
            <Heading tag="h5">{artist.name}</Heading>
        </Card>

        {/each}
    </div>
    {/await}
</div>