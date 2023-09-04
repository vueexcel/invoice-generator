<script setup>
// import HelloWorld from './components/InvoiceGenerator.vue'
import HelloWorld from './components/invoice.vue'
</script>

<template>
 
    <div class="wrapper">
      <HelloWorld/>
    </div>
  
</template>

<style scoped>
 .wrapper {
    background: white;
  }

@media (min-width: 1024px) {
   .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
