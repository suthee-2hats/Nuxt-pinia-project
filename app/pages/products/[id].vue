<template>
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {{ route.params.id }}</p>
    </div>
  </template>
  
  <script setup>
  const route = useRoute()
  </script>