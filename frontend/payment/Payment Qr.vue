<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-6 mx-auto">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">To'lov qilish</h2>
      
      <form @submit.prevent="generateQRCode" class="space-y-4">
        <div>
          <label class="block text-gray-600 font-medium">To'lov summasi:</label>
          <input 
            type="number" 
            v-model="amount" 
            placeholder="Summani kiriting"
            required 
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <label class="block text-gray-600 font-medium">To'lov usuli:</label>
          <select 
            v-model="paymentMethod" 
            required 
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="click">Click</option>
            <option value="payme">Payme</option>
          </select>
        </div>
  
        <div v-if="savedCards.length">
          <label class="block text-gray-600 font-medium">Karta tanlang:</label>
          <select v-model="selectedCard" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="card in savedCards" :key="card.id" :value="card.number">
              {{ maskCardNumber(card.number) }} ({{ card.expiry }})
            </option>
          </select>
        </div>
  
        <div>
          <label class="block text-gray-600 font-medium">Yangi karta qo'shish:</label>
          <div class="flex space-x-2">
            <input 
              type="text" 
              v-model="newCard" 
              placeholder="Karta raqami (16 raqam)" 
              class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              v-model="newExpiry" 
              placeholder="MM/YY" 
              class="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" @click="addCard" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
              Qo'shish
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          QR Kod yaratish
        </button>
      </form>
  
      <div v-if="qrCodeUrl" class="mt-6 text-center">
        <h3 class="text-lg font-semibold text-gray-700">QR Kod orqali to'lov</h3>
        <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="mt-4 mx-auto w-40 h-40 shadow-md rounded-lg" />
        <div class="flex justify-center mt-4">
          <button 
            @click="processPayment" 
            class="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            To'lash
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: '',
      paymentMethod: 'click',
      selectedCard: '',
      savedCards: [
        { id: 1, number: '1234567812345678', expiry: '12/26' },
        { id: 2, number: '8765432187654321', expiry: '11/25' }
      ],
      newCard: '',
      newExpiry: '',
      qrCodeUrl: ''
    };
  },
  methods: {
    generateQRCode() {
      if (!this.amount || !this.selectedCard) {
        alert('Iltimos, to‘lov summasi va karta tanlang!');
        return;
      }
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this.amount}-${this.paymentMethod}-${this.selectedCard}`;
    },
    processPayment() {
      alert('To‘lov amalga oshirildi!');
    },
    addCard() {
      if (this.newCard.length !== 16 || !this.newExpiry) {
        alert('To‘g‘ri karta raqamini va amal qilish muddatini kiriting!');
        return;
      }
      this.savedCards.push({
        id: this.savedCards.length + 1,
        number: this.newCard,
        expiry: this.newExpiry
      });
      this.newCard = '';
      this.newExpiry = '';
    },
    maskCardNumber(cardNumber) {
      return '**** **** **** ' + cardNumber.slice(-4);
    }
  }
};
</script>
