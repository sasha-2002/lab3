/* eslint-disable no-unused-vars */
/* eslint space-before-blocks: ["error", "never"]*/
/*
отримання нормальних кодів а не счетчик
превірка на багато лінків
перевірка на наявність силки в базі і якшо є то видати той код на який \
є силка а не створювати новий

(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])
(https?:\/\/[^\s]+)
*/
/**
 *
 * @param {form} form_data
 */
function check(form_data){
  if (form_data.main_input.value != ''){
    form_data.submit();
  }
}

