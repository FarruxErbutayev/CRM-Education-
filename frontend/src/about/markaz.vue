<template>
  <div class="container">
    <Card class="info-card">
      <CardHeader>
        <CardTitle>Intellect Education Pro</CardTitle>
        <CardDescription>
          Yuqori sifatli ta’lim xizmatlarini ko‘rsatadigan zamonaviy o‘quv markazi.  
          Bizning kurslarimiz o‘quvchilarning bilim va ko‘nikmalarini oshirishga qaratilgan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="details">
          <h3>📍 Joylashuv</h3>
          <p>{{ location }}</p>

          <h3>📞 Aloqa</h3>
          <p>{{ contact.phone }}</p>
          <p>{{ contact.email }}</p>

          <h3>📚 Kurslar</h3>
          <ul>
            <li v-for="course in courses" :key="course">{{ course }}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Ma'lumotlar
const location = ref("Samarqand viloyati, Tayloq tumani, Sochakibolo QFY Nurafshon mahallasi");
const contact = ref({
  phone: "+998 97141-06-91",
  email: "azizbektayloq@gmail.com"
});
const courses = ref(["Ingliz tili (IELTS, TOEFL)", "Matematika", "IT kurslari (Python, JavaScript)"]);
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #eef2f7;
}

.info-card {
  max-width: 500px;
  padding: 25px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.details h3 {
  font-size: 20px;
  margin-top: 12px;
  color: #333;
  font-weight: bold;
}

.details p, .details ul {
  font-size: 16px;
  color: #555;
}

.details ul {
  list-style: none;
  padding: 0;
}

.details li {
  padding: 6px 0;
  border-bottom: 1px solid #ddd;
}

.details li:last-child {
  border-bottom: none;
}
</style>
