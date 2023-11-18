// ドラッグでスケジュールセルの見た目を変える機能

// DOM 取得
const scheduleTable = document.querySelector('table');
const schedules = document.querySelectorAll('tbody td');

// mousedown の状態を保持
let isMouseDown = false;

// ドラッグでセルの見た目を変える(追加のみ)関数
const addCellStyleByDrag = () => {
  schedules.forEach(schedule => {
    schedule.addEventListener('mousedown', () => {
      isMouseDown = true;
    });
    schedule.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    schedule.addEventListener('mousemove', () => {
      if (isMouseDown) {
        schedule.classList.add('is-free');
      }
    });
  });
};

// クリックでセルの見た目を変える(追加 & 除去)関数
const toggleCellStyleByClick = () => {
  schedules.forEach(schedule => {
    schedule.addEventListener('click', () => {
      schedule.classList.toggle('is-free');
    });
  });
}

// テーブルからマウスポインタが出た時は isMouseDown を false にする
scheduleTable.addEventListener('mouseleave', () => {
  isMouseDown = false;
});

// ドラッグしたときのデフォルトの挙動をキャンセル
schedules.forEach(schedule => {
  schedule.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
});

export { addCellStyleByDrag, toggleCellStyleByClick };