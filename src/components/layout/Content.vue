<template>
  <div>
    <router-view v-slot="{ route }">
      <transition name="fade-transform" mode="out-in">
        <component :is="route.path == '/' ? AVue : BVue" :key="route.path"> </component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import A from '@/views/HomePage/index.vue'
import B from '@/views/TypePage/index.vue'

const AVue = markRaw(A)
const BVue = markRaw(B)
</script>
