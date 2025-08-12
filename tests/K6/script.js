import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // 10 users for 10 seconds
    { duration: '10s', target: 200 }, // add 10 more users for next 10 seconds
    { duration: '60s', target: 500 }, // add 30 more users for next 60 seconds
  ],
};

//export default function() {
//  let res = http.get('https://quickpizza.grafana.com');
//  check(res, { "status is 200": (res) => res.status === 200 });
//  sleep(1);
//}

export default function() { // --- IGNORE ---
  let res = http.get('https://petstore.swagger.io/v2/store/order');