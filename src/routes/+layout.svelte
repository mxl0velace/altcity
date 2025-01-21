<script>
	import { page } from '$app/state';
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl, Button, Input, Footer, FooterLinkGroup, FooterLink, FooterCopyright } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	let { children } = $props();
</script>

<svelte:head>
	<title>{page.data.title ? page.data.title + " - " : ""}Alt City Grid </title>
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
	</NavUl>
</Navbar>
	{@render children()}
	<Footer>
		<div class="mt-10 sm:flex sm:items-center sm:justify-between text-sm text-gray-500 dark:text-gray-400">
			<p>Contact l0velace on Discord for support and information.</p>
			<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
				<FooterLink href="https://github.com/mxl0velace/altcity">GitHub</FooterLink>
			</FooterLinkGroup>
		</div>
	</Footer>
</div>
