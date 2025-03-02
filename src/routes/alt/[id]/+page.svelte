<script>
// @ts-nocheck

    import { getImageURL } from '$lib/utils';
    import { Button, Card, Dropdown, Checkbox, Modal } from 'flowbite-svelte';
    import { CirclePlusSolid, CircleMinusSolid, ChevronDownOutline, ExclamationCircleOutline} from 'flowbite-svelte-icons';
    import { page } from '$app/stores';

    let { data } = $props();
    let art = data?.art;
    let mainCollection = data.userWithCollections?.main_collection;
    let otherCollections = data.userWithCollections?.expand.cardcollection_via_owner?.concat(data.userWithCollections.expand.cardcollection_via_editors || []).filter(x => x.id != mainCollection) || [];
    let inCollection = $state(art?.expand?.cardcollection_via_cards?.length != null && art?.expand?.cardcollection_via_cards.some(x => x.id == mainCollection));
    let deleteModal = $state(false);

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
        <h2 class="text-lg font-thin">{#if art?.cardlink}
            <a class="text-blue-600 underline dark:text-blue-500 hover:no-underline" href="/search/{art?.cardlink}">{art?.cardname}</a>
        {:else}
            {art?.cardname}
        {/if}</h2>
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
                        {:else}
                            <li class="text-gray-500">Add additional collections through your profile page!</li>
                        {/each}
                    </Dropdown>
            </div>
            {:else}
            <div class="grid gap-6 sm:grid-cols-3 place-items-center">
                <Button on:click={addToCollection} class="bg-lime-500 hover:bg-lime-600 col-span-2"><CirclePlusSolid class="mr-1"/> I Have This!</Button>
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
            {#if data.user.role == "admin" || data.user.id == art.expand.artist.user}
            <div class="grid gap-6 sm:grid-cols-3 place-items-center">
                 <Button color="blue" class="mt-2 col-span-2 w-full" href="{$page.params.id}/edit">Edit</Button>
                 <Button color="red" class="mt-2 col-span-1 w-full" on:click={() => {deleteModal=true;}}>Delete</Button>
            </div>
            {/if}
        {/if}
    </Card>
    <Modal bind:open={deleteModal} size="xs" outsideclose>
        <div class="text-center">
            <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete {art.title}?</h3>
            <form method="POST">
                <Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
                <Button color="alternative" on:click={() => {deleteModal=false;}}>No, cancel</Button>
            </form>

        </div>
    </Modal>
</div>
