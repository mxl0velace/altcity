<script lang="ts">
    import type { PageData } from "../../$types";
    import { enhance } from "$app/forms";
    import { Input, Label, Helper, Button, ButtonGroup, InputAddon, Fileupload, Select, Textarea, Checkbox, Popover } from "flowbite-svelte";

    let { data }: { data: PageData } = $props();
    let options = $state([]);
    let full_options = {
        items: []
    }

    let isOpen = $state(false);
    let cardName = $state("");
    let searchPopup;
    const openPopup = () => {
        isOpen = true;
    }

    const updateOptions = async () => {
        if (cardName.length < 2){
            options = []
        } else {
            var result = await fetch(`/api/card/search/${cardName}`);
            full_options = await result.json();
            options = full_options.items.map(x => x.name)
        }
    }
</script>
<h1 class="text-4xl font-bold mb-2">Uploading a new card for {#await data.artist}Loading...{:then artist}{artist?.name}{/await}</h1>
<form method="POST" enctype="multipart/form-data" use:enhance>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
            <Label for="title" class="mb-2" >Artwork Title</Label>
            <ButtonGroup class="w-full">
                <Input type="text" id="title" name="title" placeholder="My Fancy Sure Gamble Alt Art..."/>
                <InputAddon>Required</InputAddon>
            </ButtonGroup>
        </div>
        <div>
            <Label for="cardname" class="mb-2">Card Name</Label>
                <Input type="text" id="cardname" name="cardname" placeholder="Sure Gamble..." bind:value={cardName} on:input={updateOptions} autocomplete="off" on:focus={openPopup} on:focusout={() => {isOpen = false;}}/>
                <Popover bind:this={searchPopup} triggeredBy="#cardname" trigger="click" arrow={false} open={isOpen} placement="bottom-start">
                    <div class="flex flex-col gap-1">
                        {#each options as option, i}
                        {#if i != 0}
                        <hr>
                        {/if}
                            <button type="button" class="w-full hover:bg-primary-200 p-1 rounded-lg" onclick={() => {cardName = option; isOpen = false;}}>{option}</button>
                        {/each}
                    </div>
                </Popover>
        </div>
    </div>
    <Label for="description" class="pb-2">Description</Label>
    <Textarea id="description" name="description" class="mb-2" placeholder="Made for Worlds 2031 Top Cut prizing..."></Textarea>
    <Label for="image" class="pb-2">Image</Label>
    <Fileupload class="mb-2" id="image" name="image"></Fileupload>
    <Helper class="mb-2">PNG, JPG, SVG, or GIF (max. ???MB I haven't checked yet but don't be silly)</Helper>
    <Checkbox class="mb-2" name="watermark" checked>Enable Auto-Watermarking</Checkbox>
    <Button type="submit" class="w-full">Save New Alt Art</Button>
</form>