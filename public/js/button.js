// モジュールスコープの変数
let currentUserId;
let userColor;
let isMouseDown = false;

// ユーザーボタンのクリックイベントを設定
const userButtons = document.querySelectorAll('.user-button');
userButtons.forEach((userButton) => {
  userButton.addEventListener('click', () => {
    currentUserId = userButton.dataset.userid;
    userColor = currentUserId === "1" ? "yellow" : "skyblue";
    // 色が変更されたことを示すためのログ
    console.log(`User ID: ${currentUserId}, Color: ${userColor}`);
  });
});

// 保存フォームの送信イベントを設定
const saveForm = document.getElementById('save-form');
saveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert(`Saving for User ID: ${currentUserId}`);
});

// スケジュールテーブルを取得
const scheduleTable = document.querySelector('table');

// ドラッグとクリックのスタイル変更機能を追加
const addCellStyleByDragAndClick = () => {
  scheduleTable.addEventListener('mousedown', (event) => {
    if (event.target.tagName === 'TD') {
      isMouseDown = true;
      // mousedown時の色を適用
      event.target.style.backgroundColor = userColor;
    }
  });

  scheduleTable.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  scheduleTable.addEventListener('mousemove', (event) => {
    if (isMouseDown && event.target.tagName === 'TD') {
      event.target.style.backgroundColor = userColor;
    }
  });

  scheduleTable.addEventListener('click', (event) => {
    if (event.target.tagName === 'TD') {
      // クリックしたセルの背景色をトグル
      event.target.style.backgroundColor = 
        event.target.style.backgroundColor === userColor ? '' : userColor;
    }
  });

  scheduleTable.addEventListener('mouseleave', () => {
    isMouseDown = false;
  });

  // ドラッグ開始時のデフォルト動作をキャンセル
  scheduleTable.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
};

// ページロード後にスタイル変更機能を有効化
document.addEventListener('DOMContentLoaded', () => {
  addCellStyleByDragAndClick();
});
