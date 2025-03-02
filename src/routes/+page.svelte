<script lang="ts">
    import { Alert, Card, Heading } from 'flowbite-svelte'
    import type { PageData } from './$types';
    import { getImageURL } from '$lib/utils';

    let { data }: { data: PageData } = $props();

    var featuredArtist = data.results.items?.find(x => x.name == "featuredArtist");
    var featuredCards = data.results.items?.filter(x => x.name == "featuredArt");

</script>


<div class="text-center">
    <Heading class="pb-2">
        Alt City Grid - A Netrunner Alt Art Database
    </Heading>
    <p>
        Alt City Grid is still in active development - features are subject to change!
    </p>
    {#if featuredArtist}
    <Heading class="pt-10 pb-5">
        Featured Artist
    </Heading>
    <div class="grid mb-6 sm:grid-cols-2 place-items-center">
        <img class="img-responsive h-64" src={getImageURL(featuredArtist.expand?.valueArtist.collectionId || "", featuredArtist.expand?.valueArtist.id || "", featuredArtist.expand?.valueArtist.logo)} alt={featuredArtist.expand?.valueArtist.name}/>
        <Card>
            <h1 class="text-2xl font-bold mb-2"><a class="text-blue-600 underline dark:text-blue-500 hover:no-underline" href="/artist/{featuredArtist.expand?.valueArtist.id}">{featuredArtist.expand?.valueArtist.name}</a></h1>
            <hr class="mb-2"/>
            <p>{featuredArtist.value}</p>
        </Card>
    </div>
    <div class="grid mb-6 sm:grid-cols-3 place-items-center">
        {#each featuredCards as art}
        <Card horizontal imgClass="h-64" href="/alt/{art.expand?.valueCard.id}" img={getImageURL(art.expand?.valueCard.collectionId, art.expand?.valueCard.id, art.expand?.valueCard.image)}>
            <Heading tag="h5" class="">{art.expand?.valueCard.title}</Heading>
            <p class="font-thin">{art.expand?.valueCard.cardname}</p>
        </Card>
        {/each}
        </div>

    {/if}
</div>