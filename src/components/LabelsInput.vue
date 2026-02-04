<script setup lang="ts">
import { computed } from "vue";

interface LabelItem {
  text: string;
}

interface Props {
  modelValue: string;
  labelItems: LabelItem[];
  placeholder?: string;
  error?: boolean;
  compact?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Введите метки через ;",
  error: false,
  compact: false,
});

const emit = defineEmits<Emits>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="labels-input">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      :class="{ error }"
      maxlength="50"
    />
    <div v-if="labelItems.length > 0 && !compact" class="label-items">
      <span v-for="(item, idx) in labelItems" :key="idx" class="label-tag">
        {{ item.text }}
      </span>
    </div>
    <div v-else-if="labelItems.length > 0 && compact" class="compact-tags">
      <span class="tag-count">{{ labelItems.length }} меток</span>
    </div>
  </div>
</template>

<style scoped>
.labels-input {
  width: 100%;
}

.labels-input input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.labels-input input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

.labels-input input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.label-items {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.label-tag {
  background-color: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #495057;
}

.compact-tags {
  margin-top: 6px;
}

.tag-count {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .labels-input input {
    padding: 10px;
    font-size: 16px;
  }

  .label-tag {
    font-size: 11px;
    padding: 3px 10px;
  }
}
</style>
