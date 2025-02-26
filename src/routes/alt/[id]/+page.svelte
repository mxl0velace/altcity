<script>
// @ts-nocheck

    import { getImageURL } from '$lib/utils';
    import { Button, Card, Dropdown, Checkbox } from 'flowbite-svelte';
    import { CirclePlusSolid, CircleMinusSolid, ChevronDownOutline} from 'flowbite-svelte-icons';

    let { data } = $props();
    let art = data?.art;
    let mainCollection = data.userWithCollections?.main_collection;
    let otherCollections = data.userWithCollections?.expand.cardcollection_via_owner.concat(data.userWithCollections.expand.cardcollection_via_editors || []).filter(x => x.id != mainCollection) || [];
    let inCollection = $state(art?.expand?.cardcollection_via_cards?.length != null && art?.expand?.cardcollection_via_cards.some(x => x.id == mainCollection));

    const addToCollection = async function (e, collectionId = null) {
		const response = await fetch(`/api/card/${data?.art?.id}/addToCollection`, {
			method: 'POST',
			body: JSON.stringify({
                userId: data?.user?.id,
                collectionId: collectionId || mainCollection
            }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok){
            if (collectionId == null) {
                inCollection = true;
            }
            else {
                otherCollections.find(x => x.id == collectionId).cards.push(art.id);
            }
        }
    }
    const removeFromCollection = async function (e, collectionId = null) {
        const response = await fetch(`/api/card/${data?.art?.id}/removeFromCollection`, {
			method: 'POST',
			body: JSON.stringify({
                userId: data?.user?.id,
                collectionId: collectionId || mainCollection
            }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok){
            if (collectionId == null) {
                inCollection = false;
            } else {
                otherCollections.find(x => x.id == collectionId).cards.filter(x => x.id != art.id);
            }
        }
    }

    const toggleCollection = async function (collectionId, checked) {
        if (checked) {
            removeFromCollection(null, collectionId);
        } else {
            addToCollection(null, collectionId);
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
            <div class="grid gap-6 sm:grid-cols-3 place-items-center">
                <p>In your collection!</p>
                <Button on:click={removeFromCollection} class="bg-red-500 hover:bg-red-600"><CircleMinusSolid class="mr-1"/>Remove</Button>
                <Button color="alternative">Add to...<ChevronDownOutline class="text-white" /></Button>
                    <Dropdown class="w-44 p-3 space-y-3 text-sm">
                        {#each otherCollections as collection}
                            <li>
                                <Checkbox on:change={(e) => toggleCollection(collection.id, collection.cards.includes(art.id))} checked={collection.cards.includes(art.id)}>{collection.name}</Checkbox>
                            </li>
                        {/each}
                    </Dropdown>
            </div>
            {:else}
            <div class="grid gap-6 sm:grid-cols-2 place-items-center">
                <Button on:click={addToCollection} class="bg-lime-500 hover:bg-lime-600"><CirclePlusSolid class="mr-1"/> I Have This!</Button>
                <Button color="alternative">Add to...<ChevronDownOutline class="text-white" /></Button>
                <Dropdown class="w-44 p-3 space-y-3 text-sm">
                    {#each otherCollections as collection}
                        <li>
                            <Checkbox on:change={(e) => toggleCollection(collection.id, collection.cards.includes(art.id))} checked={collection.cards.includes(art.id)}>{collection.name}</Checkbox>
                        </li>
                    {/each}
                </Dropdown>

            </div>
            {/if}
        {/if}
    </Card>
</div>