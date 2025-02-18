<script>
    import { getImageURL } from "$lib/utils.ts";
    import { Button, Heading, Img, TabItem, Tabs, Card } from "flowbite-svelte";
    import { ShieldCheckSolid } from "flowbite-svelte-icons";


    let { data } = $props();

</script>

{#await data.artist}
loading
{:then artist}
<div class="flex w-min gap-2 items-center"><Heading>{artist?.name}</Heading>{#if artist?.user}<ShieldCheckSolid size="xl" class="text-green-500"/>{/if}</div>
<Tabs tabStyle="underline">
    <TabItem open title="Overview">
        <div class="flex gap-10 flex-col md:flex-row flex-wrap">
            {#if artist?.logo}
            <Img src={getImageURL(artist?.collectionId, artist?.id, artist?.logo)} size="max-w-xs" alt="Logo for {artist?.name}" class="mb-2 mt-auto mb-auto"></Img>
            {/if}
            <div class="flex flex-col flex-grow">
                <p class="text-lg">
                    {artist?.bio}
                </p>
                <p class="text-lg">
                    <a class="text-blue-600 underline dark:text-blue-500 hover:no-underline" href={artist?.link}>{artist?.link}</a>
                </p>
                {#if !artist?.user}
                <p class="pt-4 text-sm">Is this you? Contact admin@gaythings.net to verify your artist profile.</p>
                {/if}
            </div>
            {#if artist?.expand?.art_via_artist}
            <div class="flex w-min flex-grow gap-8">
            {#each artist?.expand?.art_via_artist.slice(0, 2) as art}
                <Card img={getImageURL(art?.collectionId, art?.id, art?.image)} href="/alt/{art?.id}" class="flex-grow">
                    <h5 class="mb-2 text-2xl font-bold">{art?.title}</h5>
                    <p><i>{art?.cardname}</i></p>
                </Card>
            {/each}
            </div>
        {/if}

        </div>
    </TabItem>
    <TabItem title="All Art">
        <div class="grid gap-6 mb-6 md:grid-cols-7">
            <Card img="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMyIgaGVpZ2h0PSIyMyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMS41IDBDMTcuODQ3IDAgMjMgNS4xNTMgMjMgMTEuNVMxNy44NDcgMjMgMTEuNSAyMyAwIDE3Ljg0NyAwIDExLjUgNS4xNTMgMCAxMS41IDBabTAgMUMxNy4yOTUgMSAyMiA1LjcwNSAyMiAxMS41UzE3LjI5NSAyMiAxMS41IDIyIDEgMTcuMjk1IDEgMTEuNSA1LjcwNSAxIDExLjUgMVptLjUgMTBoNnYxaC02djZoLTF2LTZINXYtMWg2VjVoMXoiIHN0eWxlPSJmaWxsOiNiM2IzYjMiLz48L3N2Zz4=" href="{artist?.id}/art/new">
                <p class="mb-2 text-xl font-bold">Upload a new alt...</p>
            </Card>
            {#each artist?.expand?.art_via_artist as art}
                <Card img={getImageURL(art?.collectionId, art?.id, art?.image)} href="/alt/{art?.id}">
                    <h5 class="mb-2 text-2xl font-bold">{art?.title}</h5>
                    <p><i>{art?.cardname}</i></p>
                </Card>
            {/each}
        </div>            
    </TabItem>
</Tabs>
{/await}
