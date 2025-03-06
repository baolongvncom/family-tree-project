<template>
    <v-card>
        {{ name }}
        {{ email }}
    </v-card>
</template>

<script setup>

const { name, email } = mapWritableState(UserStore(), ['name', 'email']);

</script>
