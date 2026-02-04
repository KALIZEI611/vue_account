<script setup lang="ts">
interface Props {
  message: string;
  type?: "error" | "warning" | "info";
}

withDefaults(defineProps<Props>(), {
  type: "error",
});
</script>

<template>
  <div class="validation-message">
    {{ message }}
  </div>
</template>

<style scoped>
.validation-message {
  margin-top: 4px;
  font-size: 12px;
  color: #dc3545;
}

@media (max-width: 768px) {
  .validation-message {
    font-size: 13px;
  }
}
</style>
