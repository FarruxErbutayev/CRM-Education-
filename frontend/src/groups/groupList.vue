<template>
  <div class="max-w-5xl mx-auto mt-10 p-6 bg-white border rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-blue-700 mb-6 flex items-center">
      📋 Guruhlar ro‘yxati
    </h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-500 text-center py-4">
      ⏳ Ma’lumotlar yuklanmoqda...
    </div>

    <!-- Error Message -->
    <div v-else-if="errorMessage" class="text-red-600 font-medium text-center py-4">
      {{ errorMessage }}
    </div>

    <!-- Groups Table -->
    <div v-if="!loading && paginatedGroups.length" class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300 shadow-md">
        <thead class="bg-blue-100">
          <tr>
            <th class="border p-4 text-left font-semibold text-gray-700">#</th>
            <th class="border p-4 text-left font-semibold text-gray-700">Guruh nomi</th>
            <th class="border p-4 text-left font-semibold text-gray-700">O‘qituvchi</th>
            <th class="border p-4 text-left font-semibold text-gray-700">Boshlanish sanasi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(group, index) in paginatedGroups"
            :key="group.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="border p-4 text-gray-700">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="border p-4 font-medium text-blue-700">{{ group.group_name }}</td>
            <td class="border p-4 text-gray-700">{{ group.group_teacher }}</td>
            <td class="border p-4 text-gray-700">{{ formatDate(group.begin_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <p v-if="!loading && groups.length === 0" class="text-gray-600 text-center py-6">
      📭 Hozircha hech qanday guruh mavjud emas.
    </p>

    <!-- Pagination -->
    <div v-if="!loading && groups.length > 0" class="flex justify-center mt-6">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Oldingi
      </button>
      <span class="px-4 py-2 mx-1 bg-blue-100 text-blue-700 rounded-lg">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Keyingi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const groups = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const currentPage = ref(1);
const itemsPerPage = 11;

const fetchGroups = async () => {
  try {
    const response = await axios.get("http://localhost:4100/groups/getGroups");
    groups.value = response.data;
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value = "Guruhlar ro‘yxatini olishda xatolik yuz berdi.";
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => Math.ceil(groups.value.length / itemsPerPage));

const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return groups.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(fetchGroups);
</script>

<style>
/* Add any additional custom styles here if needed */
</style>