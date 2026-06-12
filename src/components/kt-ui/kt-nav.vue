<script setup lang="ts">
const router = useRouter();
const routes = ref(router.getRoutes());
</script>

<template>
  <nav class="bg-white shadow-lg w-full absolute z-[2]">
    <div class="container mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex space-x-4">
          <router-link
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="text-gray-700 hover:text-gray-900 py-4 px-2 pointer-events-auto cursor-pointer"
            active-class="active-link"
            exact-active-class="exact-active-link"
          >
            {{ route.meta && route.meta.title }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.active-link {
  color: #3490dc;
  font-weight: bold;
}

.exact-active-link {
  color: #2779bd;
  font-weight: bold;
  border-bottom: 2px solid #2779bd;
}
</style>
