<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <clientOnly>
      <PwaHandler />
    </clientOnly>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>