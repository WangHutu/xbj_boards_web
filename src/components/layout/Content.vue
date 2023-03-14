<template>
  <div>
    <router-view v-slot="{ route }">
      <transition name="fade-transform" mode="out-in">
        <component
          :is="route.path == '/' ? AVue : route.path == '/logs' ? CVue : BVue"
          :key="route.path"
        >
        </component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import A from '@/views/HomePage/index.vue'
import B from '@/views/TypePage/index.vue'
import C from '@/views/log.vue'
const AVue = markRaw(A)
const BVue = markRaw(B)
const CVue = markRaw(C)
</script>
