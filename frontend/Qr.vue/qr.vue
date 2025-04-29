<template>
    <div class="container">
      <h1>QR Kod orqali to'lov</h1>
      <input v-model="user" placeholder="Foydalanuvchi ismi" />
      <input v-model.number="amount" type="number" placeholder="To‘lov summasi" />
      <button @click="generateQR">QR Kod yaratish</button>
      <div v-if="qrCode">
        <img :src="qrCode" alt="QR Kod" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: '',
        amount: 0,
        qrCode: ''
      };
    },
    methods: {
      async generateQR() {
        try {
          const response = await axios.post('http://localhost:4100/generate-qr', {
            user: this.user,
            amount: this.amount
          });
          this.qrCode = response.data.qrCode;
        } catch (error) {
          console.error('QR Kod yaratishda xatolik:', error);
        }
      }
    }
  };
  </script>
  
  <style>
  .container {
    max-width: 400px;
    margin: auto;
    text-align: center;
  }
  input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
  }
  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  img {
    margin-top: 20px;
    max-width: 100%;
  }
  </style>
  