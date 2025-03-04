<script lang="ts">
    import { enhance } from "$app/forms";
    import { Input, Label, Helper, Button, ButtonGroup, InputAddon, Fileupload, Select, Textarea, Checkbox, Popover, Dropdown, Search } from "flowbite-svelte";
    import { QuestionCircleSolid } from "flowbite-svelte-icons";

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

    let artists = data.artists;

    const updateOptions = async () => {
        if (cardName.length < 2){
            options = []
        } else {
            var result = await fetch(`/api/card/search/${cardName}`);
            full_options = await result.json();
            options = full_options.items.map(x => x.name)
        }
    }

    const updateArtists = async () => {
        if (cardName.length < 2){
            
        } else {
            var result = await fetch(`/api/artist/search/${cardName}`);
            artists = await result.json();
        }
    }

    let artist = $state({
        name: "",
        id: ""
    })
    let dropdownOpen = $state(false);
    let artistSearch = $state("");
</script>
<h1 class="text-4xl font-bold mb-2">Uploading a new card</h1>
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
        <div>
            <Label for="description" class="pb-2">Description</Label>
            <Textarea id="description" name="description" class="mb-2" placeholder="Made for Worlds 2031 Top Cut prizing..."></Textarea>
        </div>
        <div>
            <Label class="pb-2">Artist</Label>
            <div class="grid grid-cols-5 h-">
                <Button type="button" class="col-span-1 rounded-e-none">Select Artist</Button>
                <Dropdown class="overflow-y-auto px-3 pb-3 text-sm w-96 max-h-96" bind:open={dropdownOpen}>
                    <div slot="header" class="p-3">
                        <Search size="md" bind:value={artistSearch}/>
                    </div>
                    {#each artists.filter(x => x.name.includes(artistSearch)) as at}
                    <li tabindex="1" class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600" onclick={() => {artist = at; dropdownOpen = false;}}>
                        {at.name}
                    </li>
                    {/each}
                </Dropdown>
                <Input type="text" id="artist_name" name="artist_name" disabled class="col-span-4 rounded-l-none disabled:opacity-100 disabled:cursor-default" value={artist.name}/>
            </div>
        </div>
    </div>
    <Label for="image" class="pb-2">Image</Label>
    <Fileupload class="mb-2" id="image" name="image"></Fileupload>
    <Helper class="mb-2">PNG, JPG, SVG, or GIF (max. ???MB I haven't checked yet but don't be silly)</Helper>
    <div class="grid gap-6 mb-6 md:grid-cols-6">
        <div class="flex flex-row">
            <Checkbox name="watermark">Enable Auto-Watermarking</Checkbox>
            <button type="button" id="bwatermark">
                <QuestionCircleSolid class="w-5 h-5 ms-1.5" />
                <span class="sr-only">Show information</span>
            </button>
            <Popover triggeredBy="#bwatermark" class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400" placement="bottom-start">
                <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Auto-Watermarking</h3>
                    Adds an alt-city-grid themed pattern over your art upon upload.
                </div>
            </Popover>
        </div>
        <div class="flex flex-row">
            <Checkbox name="bleed">Enable MPC Bleed Crop</Checkbox>
            <button type="button" id="bbleed">
                <QuestionCircleSolid class="w-5 h-5 ms-1.5" />
                <span class="sr-only">Show information</span>
            </button>
            <Popover triggeredBy="#bbleed" class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400" placement="bottom-start">
                <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">MPC Bleed Crop</h3>
                    Crops the image according to the MPC "Poker Size" bleed template.
                </div>
            </Popover>
        </div>
        <div class="flex flex-row">
            <Checkbox name="resize">Enable Auto-Resizing</Checkbox>
            <button type="button" id="bresize">
                <QuestionCircleSolid class="w-5 h-5 ms-1.5" />
                <span class="sr-only">Show information</span>
            </button>
            <Popover triggeredBy="#bresize" class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400" placement="bottom-start">
                <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Auto-Resize</h3>
                    Resizes the uploaded image to NetrunnerDB image resolution.
                </div>
            </Popover>

        </div>
        <div class="flex flex-row">
            <Checkbox name="rounded">Enable Rounded Corners</Checkbox>
            <button type="button" id="bround">
                <QuestionCircleSolid class="w-5 h-5 ms-1.5" />
                <span class="sr-only">Show information</span>
            </button>
            <Popover triggeredBy="#bround" class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400" placement="bottom-start">
                <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Rounded Corners</h3>
                    Makes the corners of the uploaded image transparent.
                </div>
            </Popover>

        </div>
    </div>
    <Button type="submit" class="w-full">Save New Alt Art</Button>
    <Input type="hidden" value={artist.id} name="artist"/>
</form>