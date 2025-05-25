<script lang="ts" setup>
import ProductCard from "@/components/products/ProductCard.vue";
</script>

<template>
  <div>
    <h1>Products page</h1>
    <div class="product-list">
      <ProductCard
        id="12345"
        title="Samsung"
        price="12345"
        image=""
        discountedprice="1234"
        description="sdfsdfsdfddfgdfgdfgdfgdf"
      />
      <ProductCard
        id="12345"
        title="Samsung"
        price="12345"
        image=""
        discountedprice="1234"
        description="sdfsdfsdfddfgdfgdfgdfgdf"
      />
      <ProductCard
        id="12345"
        title="Samsung"
        price="12345"
        image=""
        discounted-price="445"
        description="sdfsdfsdfddfgdfgdfgdfgdf"
      />
      <ProductCard
        id="12345"
        title="Samsung"
        price="12345"
        discountedprice="1234"
        description="sdfsdfsdfddfgdfgdfgdfgdf"
      />
    </div>
  </div>
</template>

<style scoped>
.product-list {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
