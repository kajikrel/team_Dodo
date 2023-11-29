// ドラッグでスケジュールセルの見た目を変える機能

// DOM 取得
const scheduleTable = document.querySelector('table');
const schedules = document.querySelectorAll('tbody td');

// mousedown の状態を保持
let isMouseDown = false;
let selectingDates = [];

// 選択された日付を取得して1週間分表示する機能

// DOM 取得
const baseDateInput = document.getElementById('base-date');
const datesParent = document.querySelector('thead tr');

// 曜日名
const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
// ドラッグ操作中にクラスを追加するためのフラグ
let isDragging = false;

scheduleTable.addEventListener('mousedown', (event) => {
  if (event.target.tagName === 'TD') {
    isMouseDown = true;
    isDragging = false; // ドラッグが開始されたばかりなので、まだドラッグ状態ではない
  }
});

scheduleTable.addEventListener('mouseup', () => {
  isMouseDown = false;
});

scheduleTable.addEventListener('mousemove', (event) => {
  if (isMouseDown && event.target.tagName === 'TD') {
    isDragging = true; // マウスが動いていれば、ドラッグ状態とみなす
    event.target.classList.add('is-free');
    const dateAttr = event.target.getAttribute('data-date');
    if (!selectingDates.includes(dateAttr)) {
      selectingDates.push(dateAttr);
    }
  }
});

// clickイベントリスナーでトグル操作を実行
scheduleTable.addEventListener('click', (event) => {
  if (event.target.tagName === 'TD') {
    // もしドラッグ操作が行われていたら、クリックによるトグルは行わない
    if (isDragging) {
      isDragging = false; // ドラッグ状態をリセット
      return; // ここで処理を中断
    }

    const td = event.target;
    td.classList.toggle('is-free'); // クラスのトグル
    const dateAttr = td.getAttribute('data-date');
    if (td.classList.contains('is-free')) {
      if (!selectingDates.includes(dateAttr)) {
        selectingDates.push(dateAttr);
      }
    } else {
      selectingDates = selectingDates.filter((date) => date !== dateAttr);
    }
  }
});