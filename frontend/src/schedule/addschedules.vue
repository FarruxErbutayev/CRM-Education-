<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const teachers = ref([]);
const groups = ref([]);
const courses = ref([]);
const errorMessage = ref("");
const successMessage = ref("");

const newLesson = ref({
  group_id: "",
  subject: "",
  teacher: "",
  day: "",
  start_time: "",
  end_time: "",
  room_number: "",
});

const weekDays = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];

const fetchTeachersAndGroups = async () => {
  try {
    const [teacherRes, groupRes] = await Promise.all([
      axios.get("http://localhost:4100/teachers/getTeachers"),
      axios.get("http://localhost:4100/groups/getGroups"),
    ]);
    teachers.value = teacherRes.data ?? [];
    groups.value = groupRes.data ?? [];
  } catch (error) {
    console.error("❌ O'qituvchi yoki guruhlarni olishda xatolik:", error);
    errorMessage.value = "Ma'lumotlarni yuklashda muammo yuz berdi.";
  }
};

const fetchCourses = async () => {
  try {
    const response = await axios.get("http://localhost:4100/courses/getCourses");
    courses.value = response.data ?? [];
  } catch (error) {
    console.error("❌ Fanlarni olishda xatolik:", error);
    errorMessage.value = "Fanlarni yuklashda muammo yuz berdi.";
  }
};

const addLesson = async () => {
  try {
    await axios.post("http://localhost:4100/schedule/addSchedule", newLesson.value);
    successMessage.value = "✅ Dars muvaffaqiyatli qo‘shildi!";
    errorMessage.value = "";
    Object.assign(newLesson.value, {
      group_id: "",
      subject: "",
      teacher: "",
      day: "",
      start_time: "",
      end_time: "",
      // room_number: "",
    });
  } catch (error) {
    errorMessage.value = "❌ Darsni qo‘shishda xatolik yuz berdi.";
    successMessage.value = "";
  }
};

onMounted(() => {
  fetchTeachersAndGroups();
  fetchCourses();
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Xabarlar -->
    <div v-if="errorMessage" class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
      {{ successMessage }}
    </div>

    <!-- Form -->
    <div class="p-6 bg-white border border-gray-200 shadow rounded-lg">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">➕ Yangi Dars Qo‘shish</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">📌 Guruh</label>
          <select v-model="newLesson.group_id" class="input-style">
            <option disabled value="">Guruhni tanlang</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.group_name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">📖 Fan nomi</label>
          <select v-model="newLesson.subject" class="input-style">
            <option disabled value="">Fan nomini tanlang</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.course_name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">👨‍🏫 O‘qituvchi</label>
          <select v-model="newLesson.teacher" class="input-style">
            <option disabled value="">O‘qituvchini tanlang</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.firstname }} {{ teacher.lastname }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">📅 Hafta kuni</label>
          <select v-model="newLesson.day" class="input-style">
            <option disabled value="">Hafta kunini tanlang</option>
            <option v-for="day in weekDays" :key="day">{{ day }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">⏰ Boshlanish vaqti</label>
          <input v-model="newLesson.start_time" type="time" class="input-style" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">⏰ Tugash vaqti</label>
          <input v-model="newLesson.end_time" type="time" class="input-style" />
        </div>

        <div>
          <!-- <label class="block text-sm font-medium text-gray-600 mb-1">🏫 Xona raqami</label> -->
          <!-- <input v-model="newLesson.room_number" type="text" placeholder="Xona raqami" class="input-style" /> -->
        </div>
      </div>

      <button
        @click="addLesson"
        class="mt-6 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-semibold shadow"
      >
        ✅ Darsni qo‘shish
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-style {
  @apply w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>