<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import { Button, Card, Heading, Img } from 'flowbite-svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

{#await data.artist}
loading
{:then artist}
<Heading>{artist?.name}!</Heading>
{#if artist?.logo}
<Img src={getImageURL(artist?.collectionId, artist?.id, artist?.logo)} size="max-w-sm" alt="Logo for {artist?.name}"></Img>
{/if}
<div class="grid gap-6 mb-6 md:grid-cols-7">
{#each artist?.expand?.art_via_artist as art}
    <Card img={getImageURL(art?.collectionId, art?.id, art?.image)} href="/alt/{art?.id}">
        <h5 class="mb-2 text-2xl font-bold">{art?.title}</h5>
        <p><i>{art?.cardname}</i></p>
    </Card>
{/each}
</div>
{/await}
