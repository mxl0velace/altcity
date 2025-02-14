<script>
    import { getImageURL } from '$lib/utils';
    import { Button, Card } from 'flowbite-svelte';
    import { CirclePlusSolid, CircleMinusSolid } from 'flowbite-svelte-icons';

    let { data } = $props();
    let art = data?.art;
    let inCollection = $state(art?.expand?.cardcollection_via_cards?.length != null && art?.expand?.cardcollection_via_cards?.length != 0);

    const addToCollection = async function () {
		const response = await fetch(`/api/card/${data?.art?.id}/addToCollection`, {
			method: 'POST',
			body: JSON.stringify({
                userId: data?.user?.id,
            }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok){
            inCollection = true;
        }
    }
    const removeFromCollection = async function () {
        const response = await fetch(`/api/card/${data?.art?.id}/removeFromCollection`, {
			method: 'POST',
			body: JSON.stringify({
                userId: data?.user?.id,
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


<div class="grid gap-6 mb-6 sm:grid-cols-2 place-items-center">
    <img class="img-responsive h-96" src={getImageURL(art?.collectionId || "", art?.id || "", art?.image)} alt={art?.title}/>
    <Card>
        <h1 class="text-2xl font-bold">{art?.title}</h1>
        <h2 class="text-lg font-thin">{art?.cardname}</h2>
        <h2 class="text-lg font-thin mb-2">by <a class="text-blue-600 underline dark:text-blue-500 hover:no-underline" href="/artist/{art?.expand?.artist?.id}">{art?.expand?.artist?.name}</a></h2>
        <hr class="mb-2"/>
        <p>{art?.description}</p>
        {#if data.user}
            <hr class="mt-2 mb-3"/>
            {#if inCollection}
            <div class="grid gap-6 sm:grid-cols-2 place-items-center">
                <p>In your collection!</p>
                <Button on:click={removeFromCollection} class="bg-red-500 hover:bg-red-600"><CircleMinusSolid class="mr-1"/>Remove</Button>
            </div>
            {:else}
            <Button on:click={addToCollection} class="bg-lime-500 hover:bg-lime-600"><CirclePlusSolid class="mr-1"/> I Have This!</Button>
            {/if}
        {/if}
    </Card>
</div>