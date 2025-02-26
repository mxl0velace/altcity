<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import { Card, Heading, Tabs, TabItem, Button, ButtonGroup, Checkbox, Input, InputAddon, Label, Textarea, Modal } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { CirclePlusSolid, CogSolid } from 'flowbite-svelte-icons';
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();
    let allCollections = $state(data.fulluser?.expand?.cardcollection_via_owner.concat(data.fulluser.expand.cardcollection_via_editors || []))

    let settingsOpen = $state(false);
    let currentlyOpen = $state({name: "", id: ""});

</script>
<div class="text-center">
<Heading class="pb-2">Your Collections</Heading>
<Tabs tabStyle="underline">
    {#each allCollections as collection}
    <TabItem title={collection.name || "Collection"} open={data?.fulluser?.main_collection == collection.id}>
        <div class="w-full flex justify-start mb-2">
            <Button on:click={() => {settingsOpen=true; currentlyOpen = collection}} color="alternative"><CogSolid class="w-5 h-5 me-2"/> Edit Collection</Button>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-7">
            {#each collection.expand.cards as art}
            <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
                <Heading tag="h5" class="">{art?.title}</Heading>
                <p class="font-thin">{art?.cardname}, {art?.expand?.artist?.name}</p>
            </Card>
            {/each}
        </div>        
    </TabItem>
    {/each}
    <TabItem>
        <div slot="title">
            <CirclePlusSolid/>
        </div>
        <h1 class="text-4xl font-bold mb-2">New Collection</h1>
        <form method="POST" enctype="multipart/form-data" action="?/new">
            <Label for="name" class="mb-2" >Collection Name</Label>
            <ButtonGroup class="w-full">
                <Input type="text" id="name" name="name" placeholder="Wishlist..."/>
                <InputAddon>Required</InputAddon>
            </ButtonGroup>
            <Button type="submit" class="w-full mt-2">Save New Collection</Button>
        </form>
    </TabItem>
</Tabs>
</div>
<Modal bind:open={settingsOpen} size="lg" autoclose={false} class="w-full" outsideclose={true}>
    <h1 class="text-2xl font-bold mb-2">Editing Collection {currentlyOpen.name}</h1>
    <form method="POST" enctype="multipart/form-data" action="?/settings" use:enhance={({ formData }) => {
        settingsOpen = false;
        return async ({ update }) => {
			await update();
            allCollections = allCollections.map(x => x.id == formData.get("collectionId") ? { ...x, name: formData.get("name")} : x);
		}; 
    }
    }>
        <Label for="name" class="mb-2" >Collection Name</Label>
        <ButtonGroup class="w-full">
            <Input type="text" id="name" name="name" placeholder="Wishlist..." value={currentlyOpen.name}/>
            <InputAddon>Required</InputAddon>
        </ButtonGroup>
        <input type="hidden" name="collectionId" value={currentlyOpen.id}>
        <Button type="submit" class="w-full mt-2">Save {currentlyOpen.name}</Button>
    </form>
</Modal>