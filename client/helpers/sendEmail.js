import axios from 'axios';

export default function sendReceipt(items, price, email) {
  axios.post('/send/receipt', { items, price, email })
    .catch((error) => {
      throw error;
    });
}
