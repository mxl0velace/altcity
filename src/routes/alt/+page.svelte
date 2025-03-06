<script lang="ts">
    import Cardcard from '$lib/cardcard.svelte';
    import { getImageURL } from '$lib/utils';
    import type { PageData } from './$types';
    import { Card, CardPlaceholder, Gallery, Heading } from 'flowbite-svelte';

    let { data }: { data: PageData } = $props();
</script>
<div class="text-center">
    <Heading class="pb-2">Alt Art Showcase</Heading>
    {#await data.arts}
        <CardPlaceholder/>
    {:then arts}
    <div class="grid gap-6 mb-6 md:grid-cols-7">
        {#if arts}
        {#each arts.items as art}
            <Cardcard {data} {art}/>
        {/each}
        {/if}
    </div>
    {/await}
</div>