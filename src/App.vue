<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <div class="flex min-h-svh w-full flex-col bg-neutral-950 text-neutral-100">
    <RouterView />
  </div>
  <Analytics />
</template>
