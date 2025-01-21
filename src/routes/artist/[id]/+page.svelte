<script>
    import { getImageURL } from "$lib/utils.ts";
    import { Button, Heading, Img } from "flowbite-svelte";


    let { data } = $props();

    console.log(data);
</script>

{#await data.artist}
loading
{:then artist}
{#if artist?.logo}
<Img src={getImageURL(artist?.collectionId, artist?.id, artist?.logo)} size="max-w-lg" alt="Logo for {artist?.name}"></Img>
{/if}
<Heading>{artist?.name}!</Heading>
<Button href="{artist?.id}/art">View Artist Collection</Button>
<Button href="{artist?.id}/art/new">Upload New Art for this Artist</Button>
{/await}
