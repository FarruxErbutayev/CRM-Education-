<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="max-w-lg w-full p-8 border rounded-2xl shadow-lg bg-white">
      <h2 class="text-3xl font-bold mb-8 text-blue-600 flex items-center">
        📘 Guruh yaratish
      </h2>
      <form @submit.prevent="submitGroup" class="space-y-6">
        <div>
          <label class="block font-semibold text-gray-700 mb-2">Guruh nomi:</label>
          <input
            v-model="group.group_name"
            type="text"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masalan: Frontend Dasturlash"
            required
          />
        </div>
        <div>
          <label class="block font-semibold text-gray-700 mb-2">O‘qituvchi:</label>
          <input
            v-model="group.group_teacher"
            type="text"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masalan: Abdulla Qodirov"
            required
          />
        </div>
        <div>
          <label class="block font-semibold text-gray-700 mb-2">Boshlanish sanasi:</label>
          <input
            v-model="group.begin_date"
            type="date"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition duration-300"
        >
          💾 Saqlash
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const group = ref({
  group_name: "",
  group_teacher: "",
  begin_date: "",
});

const submitGroup = async () => {
  try {
    const response = await fetch("http://localhost:4100/groups/addGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(group.value),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    alert("✅ Guruh muvaffaqiyatli yaratildi!");
    group.value = { group_name: "", group_teacher: "", begin_date: "" }; // Formani tozalash
  } catch (error) {
    console.error("Guruh qo‘shishda xatolik:", error);
    alert("❌ Guruh qo‘shishda xatolik yuz berdi!");
  }
};
</script>

<style>
/* Add any additional custom styles here if needed */
</style>