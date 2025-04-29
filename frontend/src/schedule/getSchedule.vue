<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const schedule = ref([]);
const loading = ref(true);
const errorMessage = ref("");

// Fetch schedule data from the database
const fetchSchedule = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await axios.get("http://localhost:4100/schedule/getSchedule");
    schedule.value = response.data.schedule || response.data || [];
  } catch (error) {
    errorMessage.value = "❌ Dars jadvalini yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.";
    console.error("Error fetching schedule:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSchedule);
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-blue-700">📅 Dars jadvali</h1>

    <!-- Error Message -->
    <p v-if="errorMessage" class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
      {{ errorMessage }}
    </p>

    <!-- Loading State -->
    <p v-if="loading" class="text-gray-500">⏳ Yuklanmoqda...</p>

    <!-- Schedule Table -->
    <div v-if="!loading && schedule.length > 0" class="overflow-x-auto">
      <table class="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden text-sm">
        <thead class="bg-blue-50 text-gray-700">
          <tr>
            <th class="p-3 text-left">#</th>
            <th class="p-3 text-left">Hafta kuni</th>
            <th class="p-3 text-left">Fan</th>
            <th class="p-3 text-left">O‘qituvchi</th>
            <th class="p-3 text-left">Boshlanish</th>
            <th class="p-3 text-left">Tugash</th>
            <!-- <th class="p-3 text-left">Xona</th> -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(lesson, index) in schedule"
            :key="lesson.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ lesson.day }}</td>
            <td class="p-3 font-medium text-gray-800">{{ lesson.subject_name }}</td>
            <td class="p-3">{{ lesson.teacher_first_name }}</td>
            <td class="p-3">{{ lesson.start_time }}</td>
            <td class="p-3">{{ lesson.end_time }}</td>
            <!-- <td class="p-3">{{ lesson.room_number }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Data Message -->
    <p v-if="!loading && schedule.length === 0" class="text-center text-gray-400 mb-4">
      📭 Hozircha dars jadvali mavjud emas.
    </p>
  </div>
</template>

<style scoped>
table {
  font-size: 14px;
}
</style>