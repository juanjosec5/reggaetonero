<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <div class="flex min-h-svh w-full flex-col">
    <RouterView />
  </div>
  <Analytics />
</template>
