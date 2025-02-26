<script lang="ts">
    import { getImageURL } from '$lib/utils';
    import { Card, Heading, Tabs, TabItem } from 'flowbite-svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let allCollections = data.fulluser?.expand?.cardcollection_via_owner.concat(data.fulluser.expand.cardcollection_via_editors || [])
</script>
<div class="text-center">
<Heading class="pb-2">Your Collections</Heading>
<Tabs tabStyle="underline">
    {#each allCollections as collection}
    {#if data?.fulluser?.main_collection == collection.id}
    <TabItem title={collection.name || "Collection"} open>
        <div class="grid gap-6 mb-6 md:grid-cols-7">
            {#each collection.expand.cards as art}
            <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
                <Heading tag="h5" class="">{art?.title}</Heading>
                <p class="font-thin">{art?.cardname}, {art?.expand?.artist?.name}</p>
            </Card>
            {/each}
        </div>        
    </TabItem>
    {:else}
    <TabItem title={collection.name || "Collection"}>
        <div class="grid gap-6 mb-6 md:grid-cols-7">
            {#each collection.expand.cards as art}
            <Card href="/alt/{art?.id}" img={getImageURL(art?.collectionId, art?.id, art?.image)}>
                <Heading tag="h5" class="">{art?.title}</Heading>
                <p class="font-thin">{art?.cardname}, {art?.expand?.artist?.name}</p>
            </Card>
            {/each}
        </div>        
    </TabItem>
    {/if}
    {/each}
</Tabs>
</div>