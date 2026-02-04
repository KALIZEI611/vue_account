<script setup lang="ts">
interface Props {
  message: string;
  type?: "error" | "warning" | "info";
}

withDefaults(defineProps<Props>(), {
  type: "error",
});

const typeClasses = {
  error: "validation-error",
  warning: "validation-warning",
  info: "validation-info",
};
</script>

<template>
  <div :class="['validation-message', typeClasses[type]]">
    {{ message }}
  </div>
</template>

<style scoped>
.validation-message {
  margin-top: 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.validation-error {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 3px solid #dc3545;
}

.validation-warning {
  color: #ffc107;
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
}

.validation-info {
  color: #17a2b8;
  background-color: rgba(23, 162, 184, 0.1);
  border-left: 3px solid #17a2b8;
}
</style>
