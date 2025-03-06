<script>
    import { Button, Card, Heading } from "flowbite-svelte";
    import { getImageURL } from "./utils";
    import { MinusOutline, PlusOutline } from "flowbite-svelte-icons";


    let { data, art, showArtist } = $props();

    let mainCollection = data.userWithCollections?.main_collection;
    let inCollection = $state(art?.expand?.cardcollection_via_cards?.length != null && art?.expand?.cardcollection_via_cards.some(x => x.id == mainCollection));

    const addToCollection = async function (e) {
        e.preventDefault();
		const response = await fetch(`/api/card/${art?.id}/addToCollection`, {
			method: 'POST',
			body: JSON.stringify({
                userId: data?.user?.id,
                collectionId: mainCollection
            }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok){
                inCollection = true;
        }
    }
    const removeFromCollection = async function (e) {
        e.preventDefault();
        const response = await fetch(`/api/card/${art?.id}/removeFromCollection`, {
			method: 'POST',
			body: JSON.stringify({
                userId: data?.user?.id,
                collectionId: mainCollection
            }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok){
                inCollection = false;
        }
    }
</script>

<Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)} class="relative group">
    {#if data.user}
    {#if inCollection}
        <Button color="red" class="absolute top-2 right-2 p-3 invisible group-hover:visible" on:click={removeFromCollection}><MinusOutline class="w-4 h-4"/></Button>
    {:else}
        <Button color="green" class="absolute top-2 right-2 p-3 invisible group-hover:visible" on:click={addToCollection}><PlusOutline class="w-4 h-4"/></Button>
    {/if}
    {/if}
    <Heading tag="h5" class="">{art?.title}</Heading>
    <p class="font-thin">{art?.cardname}</p>
    {#if showArtist}
        <p class="font-thin">{art?.expand?.artist?.name}</p>
    {/if}
</Card>