<script lang="ts">
    // @ts-nocheck
    import { Button, Heading, Img, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { getImageURL } from '$lib/utils';

    let { data }: { data: PageData } = $props();

    let pastedInput = $state("");

    let cardEntries = $state([]);

    let selectedRow = $state({});
    let modalVisible = $state(false);

    let mainCollection = {
        name: "Owned"
    }

    let loadDecklist = async () => {
        var response = await fetch("/api/decklist/jinteki", {
            method: "POST",
            body: JSON.stringify({pastedInput}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        var jresponse = await response.json();
        cardEntries = jresponse;
    }
</script>

<div class="text-center">
    <Heading class="pb-2">Deckbuilder</Heading>
    <div class="grid grod-cols-1 md:grid-cols-4 gap-3">
        <p class="col-span-1">Paste Jinteki.net format decklist</p>
        <p class="col-span-3">Select Alt Arts</p>
        <Button type="button" class="col-span-1" on:click={loadDecklist}>
            Refresh Decklist
        </Button>
        <div class="col-span-3"></div>
        <Textarea class="h-96 col-span-1" bind:value={pastedInput}></Textarea>
        <div class="grid grid-cols-1 col-span-3">
            <Table shadow hoverable>
                <TableHead>
                    <TableHeadCell>Card</TableHeadCell>
                    <TableHeadCell>Quantity</TableHeadCell>
                    <TableHeadCell>Alts</TableHeadCell>
                </TableHead>
                <TableBody>
                    {#each cardEntries as entry}
                    <TableBodyRow on:click={() => {selectedRow = entry; modalVisible = true;}}>
                        <TableBodyCell>
                            {entry.name}
                        </TableBodyCell>
                        <TableBodyCell>
                            {entry.quantity}
                        </TableBodyCell>
                        <TableBodyCell>
                            {#if entry.selected}
                                 {entry.selected.title} ({entry.selected.expand.artist.name})
                            {:else}
                                {#if entry.alts?.main}
                                    <span class="text-green-500">{entry.alts.main || 0} {mainCollection.name}</span>{#if entry.alts?.collection || entry.alts?.other},{/if}
                                {/if}
                                {#if entry.alts?.collection}
                                    <span class="text-yellow-500">{entry.alts.collection || 0} Collections</span>{#if entry.alts?.other},{/if}
                                {/if}
                                {#if entry.alts?.other}
                                    <span>{entry.alts.other || 0} Other</span>
                                {/if}
                                {#if entry.notfound}
                                     <span class="text-red-500">Error finding card</span>
                                {:else if !(entry.alts?.main || entry.alts?.collection || entry.alts?.other)}
                                    <span class="text-gray-400">No alts found</span>
                                {/if}
                            {/if}
                        </TableBodyCell>
                    </TableBodyRow>    
                    {/each}
                </TableBody>
            </Table>    
    
        </div>
    </div>
</div>
<Modal title={selectedRow.name} bind:open={modalVisible} outsideclose size="xl">
    <Table shadow hoverable>
        <TableHead>
            <TableHeadCell></TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Artist</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each selectedRow.alts.list as alt}
            <TableBodyRow color={alt.inCollection == "main" ? "green" : alt.inCollection == "collection" ? "yellow" : "default"} on:click={() => {selectedRow.selected = alt; modalVisible = false;}} tabindex=1>
                <TableBodyCell><a href="/alt/{alt.id}" target="_blank" onclick={(e) => e.stopPropagation()}><Img src={getImageURL(alt?.collectionId, alt?.id, alt?.image)} alt={alt.title} size="max-w-xs" class="object-contain max-h-32"/></a></TableBodyCell>
                <TableBodyCell>{alt.title}</TableBodyCell>
                <TableBodyCell>{alt.expand.artist.name}</TableBodyCell>
            </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Modal>

<style>
    .col-span-3 {
        grid-column: span 3 / span 3;
    }
</style>