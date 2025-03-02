<script lang="ts">
    import { Alert, Button, Helper, Input, Label } from "flowbite-svelte";

    let { data, form } = $props();
</script>
<h1 class="text-center text-3xl font-bold">Register</h1>
<p class="text-center text-md">or <a class="text-primary-600 font-medium hover:cursor-pointer hover:underline" href="/login">login</a> to an existing account</p>
<form method="post">
    <Label for="name">Username</Label>
    <Input type="text" id="name" name="name" placeholder="john_netrunner" required class="mb-2"/>
    <Label for="email">Email</Label>
    <Input type="text" id="email" name="email" placeholder="john@net.runner" required class="mb-2"/>
    <Label for="password">Password</Label>
    <Input type="password" id="password" name="password" placeholder="password" required/>
    <Helper class="mb-2 font-light">Minimum 8 characters</Helper>
    <Label for="passwordConfirm">Confirm Password</Label>
    <Input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="password" class="mb-5" required/>
    <Button type="submit" class="w-full">Register</Button>
</form>
{#if form}
<Alert class="mt-2" color="red">{ form.message }</Alert>
{/if}
