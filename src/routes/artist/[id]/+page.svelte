<script>
    import { enhance } from "$app/forms";
    import Cardcard from "$lib/cardcard.svelte";
    import { getImageURL } from "$lib/utils.ts";
    import { Button, Heading, Img, TabItem, Tabs, Card, ButtonGroup, Fileupload, Helper, Input, InputAddon, Label } from "flowbite-svelte";
    import { ShieldCheckSolid } from "flowbite-svelte-icons";


    let { data } = $props();
    var mainOpen = $state(true);

</script>

{#await data.artist}
loading
{:then artist}
<div class="flex w-min gap-2 items-center"><Heading>{artist?.name}</Heading>{#if artist?.user}<ShieldCheckSolid size="xl" class="text-green-500"/>{/if}</div>
<Tabs tabStyle="underline">
    <TabItem bind:open={mainOpen} title="Overview">
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
                <Cardcard {data} {art} showArtist={false}/>
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
                <Cardcard {data} {art} showArtist={false}/>
            {/each}
        </div>            
    </TabItem>
    {#if artist.user == data.user.id || data.user.role == "admin"}
    <TabItem title="Edit Artist">
        <form method="POST" enctype="multipart/form-data" use:enhance={() => {
            return async ({update}) => {
                await update();
                mainOpen = true;
            }
        }}>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <Label for="name" class="mb-2">Artist Name</Label>
                    <ButtonGroup class="w-full">
                        <Input type="text" id="name" name="name" placeholder="John Netrunner..." required value={artist.name}/>
                        <InputAddon>Required</InputAddon>
                    </ButtonGroup>
                </div>
                <div>
                    <Label for="link" class="mb-2">Website/Social Media/Etsy Link</Label>
                    <Input type="text" id="link" name="link" placeholder="https://web.site" value={artist.link}/>
                </div>
            </div>
            <Label for="logo" class="pb-2">Artist Logo</Label>
            <Fileupload class="mb-2" id="logo" name="logo"></Fileupload>
            <Helper class="mb-2">Leave blank to retain current logo. PNG, JPG, SVG, or GIF (max. ???MB I haven't checked yet but don't be silly)</Helper>
            <Button type="submit" class="w-full">Save Edits to {artist.name}</Button>
        </form>   
    </TabItem>
    {/if}
</Tabs>
{/await}
