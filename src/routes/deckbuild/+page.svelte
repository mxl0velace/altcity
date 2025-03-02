<script lang="ts">
    import { Button, Heading, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte';
import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let pastedInput = $state("");

    let cardEntries = $state([]);

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
    <div class="grid grid-cols-4 gap-3">
        <p class="col-span-1">Paste Jinteki.net format decklist</p>
        <p class="col-span-3">Select Alt Arts</p>
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
                    <TableBodyRow>
                        <TableBodyCell>
                            {entry.name}
                        </TableBodyCell>
                        <TableBodyCell>
                            {entry.quantity}
                        </TableBodyCell>
                        <TableBodyCell>
                            {#if entry.selected}
                                 {entry.selected.name} ({entry.selected.artist})
                            {:else}
                                {#if entry.alts?.main}
                                    <span class="text-green-500">{entry.alts.main || 0} {mainCollection.name}</span>, 
                                {/if}
                                {#if entry.alts?.collection}
                                    <span class="text-yellow-500">{entry.alts.collection || 0} Collections</span>,
                                {/if}
                                {#if entry.alts?.other}
                                    <span>{entry.alts.other || 0} Other</span>
                                {/if}
                                {#if !(entry.alts?.main || entry.alts?.collection || entry.alts?.other)}
                                    <span class="text-gray-400">No alts found</span>
                                {/if}
                            {/if}
                        </TableBodyCell>
                    </TableBodyRow>    
                    {/each}
                </TableBody>
            </Table>    
    
        </div>
        <Button type="button" class="col-span-1" on:click={loadDecklist}>
            Refresh Decklist
        </Button>
    </div>
</div>

<style>
    .col-span-3 {
        grid-column: span 3 / span 3;
    }
</style>