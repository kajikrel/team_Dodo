
import { renderDates, renderDraggableTableData } from './renderDates.js';
// import { addCellStyleByDrag, toggleCellStyleByClick } from "./putSchedule.js";

// 初回アクセス時に表示するのは、アクセスしたその日から1週間分
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  renderDates(today);
  renderDraggableTableData(today);

  const selectedDate = localStorage.getItem('selectedDate');

  if (selectedDate) {
    // selectedDate を使用して何かの処理を行う
    console.log('選択された日付:', selectedDate);
    // ここで選択された日付に基づいてUIを更新するなどの処理を行う
  }  

  // ドラッグでスケジュールセルの見た目を変える
  // addCellStyleByDrag();
  // toggleCellStyleByClick();
});