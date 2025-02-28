<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import { Card, Heading, Tabs, TabItem, Button, ButtonGroup, Checkbox, Input, InputAddon, Label, Textarea, Modal } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { CirclePlusSolid, CogSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';

    let { data }: { data: PageData } = $props();
    let allCollections = $state(data.fulluser?.expand?.cardcollection_via_owner.concat(data.fulluser.expand.cardcollection_via_editors || []))

    let settingsOpen = $state(false);
    let currentlyOpen = $state({name: "", id: "", addEditors: false, owner: ""});
    let deleteOpen = $state(false);

</script>
<div class="text-center">
<Heading class="pb-2">Your Collections</Heading>
<Tabs tabStyle="underline">
    {#each allCollections as collection}
    <TabItem title={collection.name || "Collection"} open={data?.fulluser?.main_collection == collection.id}>
        <div class="w-full flex justify-start mb-2 align-middle gap-2">
            <Button on:click={() => {settingsOpen=true; currentlyOpen = collection}} color="alternative"><CogSolid class="w-5 h-5 me-2"/> Edit Collection</Button>
            {#if collection.addEditors}
            <p class="align-middle">Share the link <a href="/collection/{collection.id}/join" class="text-blue-600 underline hover:no-underline">{page.url.host}{page.url.pathname}/{collection.id}/join</a> to invite editors to this collection.</p>
            {/if}
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
            <Checkbox name="addEditors" class="mt-2">Allow editors to be added?</Checkbox>
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
            allCollections = allCollections.map(x => x.id == formData.get("collectionId") ? { ...x, name: formData.get("name"), addEditors: formData.get("addEditors") == "on"} : x);
            if (formData.get("main")) {
                data.user.main_collection = formData.get("collectionId");
            }
		}; 
    }
    }>
        <Label for="name" class="mb-2" >Collection Name</Label>
        <ButtonGroup class="w-full mb-2">
            <Input type="text" id="name" name="name" placeholder="Wishlist..." value={currentlyOpen.name}/>
            <InputAddon>Required</InputAddon>
        </ButtonGroup>
        <Checkbox name="main" checked={currentlyOpen.id == data?.fulluser?.main_collection}>Is Main Collection?</Checkbox>
        <Checkbox name="addEditors" class="mt-2" checked={currentlyOpen.addEditors}>Allow editors to be added?</Checkbox>
        <input type="hidden" name="collectionId" value={currentlyOpen.id}>
        <div class="grid grid-cols-3 gap-6 mt-2 ">
            <Button type="submit" color="green" class="col-span-2">Save {currentlyOpen.name}</Button>
            <Button color="red" on:click={() => {deleteOpen = true;}}>{currentlyOpen.owner == data.user?.id ? "Delete" : "Leave"} {currentlyOpen.name}</Button>
        </div>
    </form>
</Modal>
<Modal bind:open={deleteOpen} size="sm" class="w-full" outsideclose={true}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to {currentlyOpen.owner == data.user?.id ? "delete" : "leave"} {currentlyOpen.name}?</h3>
        <form method="POST" action="?/{currentlyOpen.owner == data.user?.id ? "delete" : "leave"}" use:enhance={({ formData }) => {
            settingsOpen = false;
            deleteOpen = false;
            return async ({ update }) => {
                await update();
                allCollections = allCollections.filter(x => x.id != formData.get("collectionId"));
            }; 
        }
        }>
            <Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
            <Button on:click={() => {deleteOpen = false;}} color="alternative">No, cancel</Button>
            <input type="hidden" name="collectionId" value={currentlyOpen.id}>
        </form>
    </div>
</Modal>
