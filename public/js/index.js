// index.js
import { renderDates, renderDraggableTableData } from './allSchedule.js';

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const datesParent = document.querySelector("thead tr");
  const draggableDateSectionElement = document.getElementById("draggable-date-section");

  // DOM要素が存在することを確認
  if (datesParent && draggableDateSectionElement) {
    renderDates(today, datesParent);
    renderDraggableTableData(today, draggableDateSectionElement);
  } else {
    console.error('Some required elements were not found!');
  }
});

// #フォームからなまえを保存した後のアラート
document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');

  userForm.addEventListener('submit', (event) => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    const userName = document.getElementById('user-name').value;
    const formData = new FormData();
    formData.append('user-name', userName);

    fetch('/submit', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert(data.message); // 成功した場合のメッセージをアラート表示
        if (data.user_id && data.user_name) { // データの検証
          addUserNameToButton(data.user_id, data.user_name); // 新しいユーザーをリストに追加する関数を呼び出し
        } else {
          console.error('ユーザーIDまたはユーザー名が定義されていません。');
        }
      })

      .catch(error => {
        alert('エラーが発生しました: ' + error); // エラーをアラート表示
      });
  });
});

// 新しいユーザー名をボタンに表示する関数
function addUserNameToButton(userId, userName) {
  let target;
  switch (userId) {
    case 1:
      target = document.querySelector('.user-button-1');
      break;
    case 2:
      target = document.querySelector('.user-button-2');
      break;
    case 3:
      target = document.querySelector('.user-button-3');
      break;
    case 4:
      target = document.querySelector('.user-button-4');
  }
  target.textContent = `${userName}`;
  target.href = `/user/${userId}`
}