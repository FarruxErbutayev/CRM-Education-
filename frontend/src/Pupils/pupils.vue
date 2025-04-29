<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Jadval -->
    <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th class="px-6 py-3">ID</th>
            <th class="px-6 py-3">Ismi</th>
            <th class="px-6 py-3">Familiya</th>
            <th class="px-6 py-3">Tug'ilgan kun</th>
            <th class="px-6 py-3">Kurs nomi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pupil in pupils"
            :key="pupil.id"
            class="border-b hover:bg-gray-50 transition duration-200"
          >
            <td class="px-6 py-4">{{ pupil.id }}</td>
            <td class="px-6 py-4">{{ pupil.firstname }}</td>
            <td class="px-6 py-4">{{ pupil.lastname }}</td>
            <td class="px-6 py-4">{{ pupil.birth }}</td>
            <td class="px-6 py-4">{{ pupil.course_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginatsiya -->
    <div class="mt-6 flex items-center justify-center space-x-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        Oldingi
      </button>

      <span class="text-gray-700 text-sm">
        Sahifa <span class="font-semibold">{{ page }}</span> dan <span class="font-semibold">{{ totalPages }}</span>
      </span>

      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
      >
        Keyingi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// Ma'lumotlar va sahifalash holati
const pupils = ref([]);
const page = ref(1);
const size = ref(15); // Har sahifada 15 ta o‘quvchi ko‘rsatiladi
const totalPages = ref(1);
const total = ref(0);

// Ma'lumotlarni API dan olish
const fetchPupils = async () => {
  try {
    const response = await fetch(
      `http://localhost:4100/pupil/get?`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    pupils.value = data.data;
    total.value = data.total;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error('O‘quvchilarni olishda xatolik:', error);
  }
};

// Sahifani o‘zgartirish funksiyasi
const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
};

// Yuklanganda ma'lumotlarni olish
onMounted(fetchPupils);

// Har safar sahifa o‘zgarganda ma'lumotlarni yangilash
watch(page, fetchPupils);
</script>
