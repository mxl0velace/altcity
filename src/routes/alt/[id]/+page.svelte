<script>
    import { getImageURL } from '$lib/utils';
    import { Card } from 'flowbite-svelte';

    let { data } = $props();
    let art = data?.art;
</script>


<div class="grid gap-6 mb-6 sm:grid-cols-2 place-items-center">
    <img class="img-responsive h-96" src={getImageURL(art?.collectionId || "", art?.id || "", art?.image)} alt={art?.title}/>
    <Card>
        <h1 class="text-2xl font-bold">{art?.title}</h1>
        <h2 class="text-lg font-thin">{art?.cardname}</h2>
        <h2 class="text-lg font-thin mb-2">by {art?.expand?.artist?.name}</h2>
        <hr class="mb-2"/>
        <p>{art?.description}</p>
    </Card>
</div>