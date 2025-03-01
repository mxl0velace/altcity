<script>
// @ts-nocheck

	import { page } from '$app/state';
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl, Button, Input, Footer, FooterLinkGroup, FooterLink, FooterCopyright, Dropdown, DropdownItem, Toast } from 'flowbite-svelte';
	import { ChevronDownOutline, MessageDotsOutline, SearchOutline } from 'flowbite-svelte-icons';
	let { children, data } = $props();
	var toast = {
		visible: false
	};
	if (data.toast || page.form?.status) {
		toast.visible = true;
		switch (data.toast || page.form?.status) {
			case "error_unknown":
				toast.type = "red";
				toast.text = "Unknown error"
				break;
			case "error_collection_closed":
				toast.type = "red";
				toast.text = "This collection is closed!"
				break;
			case "error_collection_duplicate":
				toast.type = "red";
				toast.text = "You are already in this collection!"
				break;
			case "success_collection":
				toast.type = "green";
				toast.text = "Added to collection!"
				break;
			default:
				toast.visible = false;
		}
	}

</script>

<svelte:head>
	<title>{page.data.title ? page.data.title + " - " : ""}Alt City Grid </title>
	<meta property="og:title" content="{page.data.title ? page.data.title : "Alt City Grid"}"/>
	<meta property="og:type" content="website"/>
	{#if page.data.image}
		 <meta property="og:image" content="{page.data.image}"/>
	{/if}
</svelte:head>

<div class="container mx-auto">
<Navbar>
	<NavBrand href='/'>
		<span class="self-center whitespace-nowrap text-xl font-semibold">Alt City Grid</span>
	</NavBrand>
	<div class="flex md:order-2">
		<div class="relative md:block">
		  <div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
			<SearchOutline class="w-4 h-4" />
		  </div>
		  <form action="/search"><Input id="search-navbar" class="ps-10" name="query" placeholder="Search..." /></form>
		</div>
	</div>
	<NavHamburger/>
	<NavUl>
		<NavLi href="/alt">Recent Cards</NavLi>
		<NavLi href="/artist">Recent Artists</NavLi>
		<NavLi href="/artist/new">Create New Artist</NavLi>
		{#if data.user}
			<NavLi class="cursor-pointer">{data.user.name}<ChevronDownOutline class="inline"/></NavLi>
			<Dropdown>
				<DropdownItem href="/collection">Collection</DropdownItem>
				<form action="/logout" method="POST">
				<DropdownItem type="submit">Sign Out</DropdownItem>
				</form>
			</Dropdown>
		{:else}
			<NavLi href="/login">Login</NavLi>
			<NavLi href="/register">Register</NavLi>
		{/if}
	</NavUl>
</Navbar>
	{@render children()}
	<Footer>
		<div class="mt-10 sm:flex sm:items-center sm:justify-between text-sm text-gray-500 dark:text-gray-400">
			<p>Support: l0velace (Discord)</p>
			<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
				<FooterLink href="https://github.com/mxl0velace/altcity">GitHub</FooterLink>
			</FooterLinkGroup>
		</div>
	</Footer>
	{#if toast.visible}
		 <Toast color={toast.type} position="bottom-right">
			<MessageDotsOutline slot="icon"/>
			{toast.text}
		 </Toast>
	{/if}
</div>
