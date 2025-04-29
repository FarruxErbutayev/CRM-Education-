<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4 text-center">Kurslar ro‘yxati</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="course in courses" :key="course.id" class="bg-white shadow-lg rounded-lg p-4">
        <h3 class="text-lg font-semibold">{{ course.course_name }}</h3>
        <p class="text-gray-600"><strong>Davomiyligi:</strong> {{ course.course_duration }} soat</p>
        <p class="text-gray-600"><strong>Narxi:</strong> {{ course.course_price }} so'm</p>
        <p class="text-gray-600"><strong>O‘qituvchi:</strong> {{ course.course_teacher }}</p>
        <p class="text-gray-600"><strong>Boshlanish sanasi:</strong> {{ course.begin_date }}</p>
        <div class="mt-3 flex gap-2">
          <button @click="editCourse(course)" class="bg-blue-500 text-white px-3 py-1 rounded">Tahrirlash</button>
          <button @click="deleteCourse(course.id)" class="bg-red-500 text-white px-3 py-1 rounded">O‘chirish</button>
        </div>
      </div>
    </div>

    <h2 class="text-2xl font-bold mt-8 text-center">Yangi kurs qo‘shish</h2>
    <form @submit.prevent="addCourse" class="bg-gray-100 p-6 rounded-lg mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newCourse.course_name" placeholder="Kurs nomi" class="border p-2 rounded w-full" required />
        <input v-model="newCourse.course_duration" placeholder="Davomiyligi (soat)" class="border p-2 rounded w-full" required />
        <input v-model="newCourse.course_price" placeholder="Narxi" class="border p-2 rounded w-full" required />
        <input v-model="newCourse.course_teacher" placeholder="O‘qituvchi" class="border p-2 rounded w-full" required />
        <input v-model="newCourse.begin_date" type="date" class="border p-2 rounded w-full" required />
      </div>
      <button type="submit" class="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full">Qo‘shish</button>
    </form>

    <div v-if="editingCourse" class="mt-8">
      <!-- <h2 class="text-2xl font-bold text-center">Kursni tahrirlash</h2> -->
      <form @submit.prevent="updateCourse" class="bg-gray-100 p-6 rounded-lg mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="editingCourse.course_name" class="border p-2 rounded w-full" required />
          <input v-model="editingCourse.course_duration" class="border p-2 rounded w-full" required />
          <input v-model="editingCourse.course_price" class="border p-2 rounded w-full" required />
          <input v-model="editingCourse.course_teacher" class="border p-2 rounded w-full" required />
          <input v-model="editingCourse.startDate" type="date" class="border p-2 rounded w-full" required />
        </div>
        <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">Saqlash</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const courses = ref([]);
    const newCourse = ref({ course_name: '', course_duration: '', course_price: '', course_teacher: '', begin_date: '' });
    const editingCourse = ref(null);

    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4100/courses');
        courses.value = response.data;
      } catch (error) {
        console.error('Kurslarni yuklashda xatolik:', error);
      }
    };

    const addCourse = async () => {
      try {
        const response = await axios.post('http://localhost:4100/courses/addCourse', newCourse.value);
        courses.value.push(response.data);
        newCourse.value = { course_name: '', course_duration: '', course_price: '', course_teacher: '', begin_date: '' };
      } catch (error) {
        console.error('Kurs qo‘shishda xatolik:', error);
      }
    };

    const editCourse = (course) => {
      editingCourse.value = { ...course };
    };

    const updateCourse = async () => {
      try {
        await axios.put(`http://localhost:4100/courses/${editingCourse.value.id}`, editingCourse.value);
        courses.value = courses.value.map(course => 
          course.id === editingCourse.value.id ? editingCourse.value : course);
        editingCourse.value = null;
      } catch (error) {
        console.error('Kursni yangilashda xatolik:', error);
      }
    };

    const deleteCourse = async (id) => {
      try {
        await axios.delete(`http://localhost:4100/courses/${id}`);
        courses.value = courses.value.filter(course => course.id !== id);
      } catch (error) {
        console.error('Kursni o‘chirishda xatolik:', error);
      }
    };

    onMounted(fetchCourses);

    return {
      courses,
      newCourse,
      editingCourse,
      addCourse,
      editCourse,
      updateCourse,
      deleteCourse,
    };
  }
};
</script>
