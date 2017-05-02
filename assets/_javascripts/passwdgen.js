'use strict';

const GeneratePasswordFunction = () => {
  let stra = Math.random().toString(36).slice(-10);
  let strb = Math.random().toString(36).slice(-10);
  let concat = String(stra + strb).replace(/\./g,'a');
  return concat.split('').sort(function () {
    return 0.5 - Math.random();
  }).join('');
};
