<script>
    import { enhance } from "$app/forms";
    import { Input, Label, Helper, Button, ButtonGroup, InputAddon, Fileupload } from "flowbite-svelte";
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
            <Label for="name" class="mb-2">Artist Name</Label>
            <ButtonGroup class="w-full">
                <Input type="text" id="name" name="name" placeholder="John Netrunner..." required/>
                <InputAddon>Required</InputAddon>
            </ButtonGroup>
        </div>
        <div>
            <Label for="link" class="mb-2">Website/Social Media/Etsy Link</Label>
            <Input type="text" id="link" name="link" placeholder="https://web.site"/>
        </div>
    </div>
    <Label for="logo" class="pb-2">Artist Logo</Label>
    <Fileupload class="mb-2" id="logo" name="logo"></Fileupload>
    <Helper class="mb-2">PNG, JPG, SVG, or GIF (max. ???MB I haven't checked yet but don't be silly)</Helper>
    <Button type="submit" class="w-full">Create a new Artist Profile</Button>
</form>