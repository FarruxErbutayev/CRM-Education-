<template>
    <div class="min-h-screen bg-blue-100 text-gray-900 p-6">
      <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-6 text-blue-700">👨‍🏫 O'qituvchi Paneli</h1>
  
        <div v-if="loading" class="text-center text-gray-500">
          Ma’lumotlar yuklanmoqda...
        </div>
  
        <div v-else>
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">👤 Shaxsiy ma’lumotlar</h2>
            <p><strong>Ism:</strong> {{ teacher.firstname }} {{ teacher.lastname }}</p>
            <p><strong>Email:</strong> {{ teacher.email }}</p>
          </div>
  
          <div>
            <h2 class="text-xl font-semibold mb-2">📚 Mening darslarim</h2>
            <div v-if="lessons.length === 0" class="text-gray-500">
              Darslar topilmadi.
            </div>
            <table v-else class="w-full text-sm border border-gray-200 shadow rounded-lg mt-2">
              <thead class="bg-blue-50 text-left text-gray-600">
                <tr>
                  <th class="p-3">Fan</th>
                  <th class="p-3">Guruh</th>
                  <th class="p-3">Kun</th>
                  <th class="p-3">Vaqt</th>
                  <th class="p-3">Xona</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="lesson in lessons"
                  :key="lesson.id"
                  class="border-t hover:bg-gray-50 transition"
                >
                  <td class="p-3">{{ lesson.subject }}</td>
                  <td class="p-3">{{ lesson.group_name }}</td>
                  <td class="p-3">{{ lesson.day }}</td>
                  <td class="p-3">{{ lesson.start_time }} - {{ lesson.end_time }}</td>
                  <td class="p-3">{{ lesson.room_number }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const teacher = ref({});
  const lessons = ref([]);
  const loading = ref(true);
  
  const fetchTeacherInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4100/teacher/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      teacher.value = res.data;
    } catch (error) {
      console.error("❌ O‘qituvchi ma’lumotlarini olishda xatolik:", error);
    }
  };
  
  const fetchTeacherLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4100/schedule/teacherLessons", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      lessons.value = res.data ?? [];
    } catch (error) {
      console.error("❌ Darslarni olishda xatolik:", error);
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(async () => {
    await fetchTeacherInfo();
    await fetchTeacherLessons();
  });
  </script>
  