<script lang="ts">
    import { Alert, Button, Input, Label } from "flowbite-svelte";
    let { data, form } = $props();
</script>
<h1 class="text-center text-3xl font-bold">Login</h1>
<p class="text-center text-md">or <a class="text-primary-600 font-medium hover:cursor-pointer hover:underline" href="/register">register</a> for an account</p>
<form method="post">
    <Label for="email">Email</Label>
    <Input type="text" id="email" name="email" placeholder="john@net.runner" required class="mb-2"/>
    <Label for="password">Password</Label>
    <Input type="password" id="password" name="password" placeholder="password" required class="mb-5"/>
    <Button type="submit" class="w-full">Login</Button>
    {#if form}
        <Alert class="mt-2" color="red">{ form.message }</Alert>
    {/if}
</form>