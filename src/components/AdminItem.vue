<template>
  <li>
    <div class="flex items-center justify-between gap-1">
      <p v-if="admin.super" class="text-sm">🇸</p>
      <v-icon v-else name="hi-user" class="h-4 w-4" />
      <p class="font-medium">{{ admin.admin.address }}</p>
      <button @click="handleDelete">
        <v-icon name="hi-trash" class="h-4 w-4 text-red-400 hover:cursor-pointer" />
      </button>
    </div>
  </li>
</template>

<script setup>
import { useMutation } from '@vue/apollo-composable';
import { UPDATE_ADMIN } from '../utils/constants';

const props = defineProps({
  admin: Object
})

const { mutate: updateAdmin } = useMutation(UPDATE_ADMIN, {
  variables: {
    input: {
      id: props.admin.id,
      content: {
        inactive: true,
        metadata: {
          createdAt: props.admin.metadata.createdAt,
          updatedAt: Date.now().toString()
        }
      }
    }
  }
})

const handleDelete = async () => {
  await updateAdmin()
}
</script>