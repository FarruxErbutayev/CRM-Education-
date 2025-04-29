<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Jadval konteyneri -->
    <div class="bg-white shadow-xl rounded-2xl overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-200 text-sm">
        <thead class="bg-gray-100 text-gray-800">
          <tr>
            <th class="text-left px-6 py-3 border-b">ID</th>
            <th class="text-left px-6 py-3 border-b">Ismi</th>
            <th class="text-left px-6 py-3 border-b">Familiyasi</th>
            <th class="text-left px-6 py-3 border-b">Tug‘ilgan sana</th>
            <th class="text-left px-6 py-3 border-b">Kurs nomi</th>
            <th class="text-left px-6 py-3 border-b">Telefon raqami</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="teacher in teachers"
            :key="teacher.id"
            class="hover:bg-gray-50 transition-colors border-t"
          >
            <td class="px-6 py-3">{{ teacher.id }}</td>
            <td class="px-6 py-3">{{ teacher.firstname }}</td>
            <td class="px-6 py-3">{{ teacher.lastname }}</td>
            <td class="px-6 py-3">{{ teacher.birth }}</td>
            <td class="px-6 py-3">{{ teacher.course }}</td>
            <td class="px-6 py-3">{{ teacher.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Yuklanmoqda -->
    <div v-if="isLoading" class="text-center text-blue-600 font-semibold text-lg mt-6">
      ⏳ Yuklanmoqda...
    </div>

    <!-- Xatolik holati -->
    <div v-if="error" class="text-center text-red-600 font-semibold text-lg mt-6">
      ❌ {{ error }}
    </div>

    <!-- Paginatsiya -->
    <div class="flex justify-center items-center gap-4 mt-10">
      <button
        class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        ⬅️ Oldingi
      </button>
      <span class="text-lg font-medium text-gray-800">
        Sahifa {{ page }} / {{ totalPages }}
      </span>
      <button
        class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
      >
        Keyingi ➡️
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const teachers = ref([]);
const page = ref(1);
const size = ref(11); // Har bir sahifada 11 ta ma'lumot
const totalPages = ref(1);
const total = ref(0);
const isLoading = ref(false);
const error = ref(null);

// O'qituvchilar ro'yxatini olish
const fetchTeachers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetch(`http://localhost:4100/teachers/getTeachers`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    teachers.value = data.teachers || data;
    total.value = data.total || teachers.value.length;
    totalPages.value = data.totalPages || Math.ceil(total.value / size.value);
  } catch (err) {
    error.value = "❗ Ma'lumotlar yuklab bo'lmadi. Iltimos, qayta urinib ko'ring.";
  } finally {
    isLoading.value = false;
  }
};

// Sahifa o'zgartirish
const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
};

// Komponent yuklanganda chaqiriladi
onMounted(fetchTeachers);

// Sahifa o'zgarsa yangilansin
watch(page, fetchTeachers);
</script>

<style scoped>
/* Tailwind bilan to‘liq stil yozilgan. Qo‘shimcha CSS kerak emas. */
</style>