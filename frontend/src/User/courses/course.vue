<template>
  <div class="max-w-5xl mx-auto mt-10 p-6 bg-white border rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-blue-700 mb-6 text-center">Kurslar Ro‘yxati</h1>

    <!-- Courses Table -->
    <div v-if="courses.length" class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300 shadow-md">
        <thead class="bg-blue-100">
          <tr>
            <th class="border p-4 text-left font-semibold text-gray-700">Nomi</th>
            <th class="border p-4 text-left font-semibold text-gray-700">Davomiylik</th>
            <th class="border p-4 text-left font-semibold text-gray-700">Narxi</th>
            <th class="border p-4 text-left font-semibold text-gray-700">O‘qituvchi</th>
            <th class="border p-4 text-left font-semibold text-gray-700">Boshlanish sanasi</th>
            <th class="border p-4 text-left font-semibold text-gray-700">Tavsif</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(course, index) in paginatedCourses"
            :key="course.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="border p-4 text-gray-700">{{ course.course_name }}</td>
            <td class="border p-4 text-gray-700">{{ course.course_duration }}</td>
            <td class="border p-4 text-gray-700">{{ course.course_price }} so‘m</td>
            <td class="border p-4 text-gray-700">{{ course.course_teacher }}</td>
            <td class="border p-4 text-gray-700">{{ formatDate(course.begin_date) }}</td>
            <td class="border p-4 text-gray-700">{{ course.description || 'Tavsif mavjud emas' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <p v-else class="text-gray-600 text-center py-6">📭 Hozircha hech qanday kurs mavjud emas.</p>

    <!-- Pagination -->
    <div v-if="!loading && courses.length > 0" class="flex justify-center mt-6">
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

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const courses = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = 11;

    const fetchCourses = async () => {
      try {
        const response = await axios.get("//localhost:4100/courses/getCourses");
        courses.value = response.data;
      } catch (error) {
        console.error("Kurslarni yuklashda xatolik yuz berdi:", error);
      } finally {
        loading.value = false;
      }
    };

    const totalPages = computed(() => Math.ceil(courses.value.length / itemsPerPage));

    const paginatedCourses = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return courses.value.slice(start, end);
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

    onMounted(fetchCourses);

    return {
      courses,
      loading,
      currentPage,
      totalPages,
      paginatedCourses,
      changePage,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Tailwind CSS is used for styling */
</style>