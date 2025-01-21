<script lang="ts">
    import type { PageData } from "../../$types";
    import { enhance } from "$app/forms";
    import { Input, Label, Helper, Button, ButtonGroup, InputAddon, Fileupload, Select } from "flowbite-svelte";

    let { data }: { data: PageData } = $props();
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
                <Input type="text" id="cardname" name="cardname" placeholder="Sure Gamble..."/>
        </div>
    </div>
    <Label for="image" class="pb-2">Image</Label>
    <Fileupload class="mb-2" id="image" name="image"></Fileupload>
    <Helper class="mb-2">PNG, JPG, SVG, or GIF (max. ???MB I haven't checked yet but don't be silly)</Helper>
    <Button type="submit" class="w-full">Save New Alt Art</Button>
</form>