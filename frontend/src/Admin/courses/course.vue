<template>
  <div class="container">
    <h1 class="title">Kurslar Ro‘yxati</h1>
    <div v-if="courses.length">
      <table class="course-table">
        <thead>
          <tr>
            <th>Nomi</th>
            <th>Davomiylik</th>
            <th>Narxi</th>
            <th>O‘qituvchi</th>
            <th>Boshlanish sanasi</th>
            <th>Tavsif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.course_name }}</td>
            <td>{{ course.course_duration }}</td>
            <td>{{ course.course_price }} so‘m</td>
            <td>{{ course.course_teacher }}</td>
            <td>{{ course.begin_date }}</td>
            <td>{{ course.description || 'Tavsif mavjud emas' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Kurslar mavjud emas</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const courses = ref([]);
    const fetchCourses = async () => {
      try {
        const response = await axios.get('//localhost:4100/courses/getCourses'); // Replace with your API endpoint
        courses.value = response.data;
      } catch (error) {
        console.error('Kurslarni yuklashda xatolik yuz berdi:', error);
      }
    };

    onMounted(fetchCourses);

    return {
      courses,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}
.title {
  text-align: center;
  color: #333;
}
.course-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.course-table th, .course-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.course-table th {
  background-color: #f4f4f4;
}
</style>
