/*

валідація на сервері + наче все
отримання нормальних кодів а не счетчик
превірка на багато лінків
отримання кодів черех /id як в ютубі
перевірка на наявність силки в базі і якшо є то видати той код на який є силка а не створювати новий

(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])
(https?:\/\/[^\s]+)

*/
function check(form_data){
    if (form_data.main_input.value != ''){
        form_data.submit();
    }
}