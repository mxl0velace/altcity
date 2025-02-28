<script lang="ts">
    import { Modal, Button } from "flowbite-svelte";
    let { data } = $props();
</script>
<div class="flex justify-center flex-col w-full items-center">
    <h1 class="text-center text-3xl font-bold mb-2">Invitation To Join {data.col.name}</h1>
    <p>{data.col.expand.owner.name} has invited you to edit the collection {data.col.name}!</p>    
</div>
<form method="POST">
    <div class="flex w-full justify-center mt-2">
        <Button type="submit" class="me-2">Join collection</Button>
        <Button href="/collection" color="alternative">Decline</Button>    
    </div>
</form>