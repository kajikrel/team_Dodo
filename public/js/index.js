import { renderDates } from './renderDates.js';
import { addCellStyleByDrag, toggleCellStyleByClick } from './putSchedule.js';

// 初回アクセス時に表示するのは、アクセスしたその日から1週間分
document.addEventListener('DOMContentLoaded', () => {
  renderDates(new Date());
});

// ドラッグでスケジュールセルの見た目を変える
addCellStyleByDrag();
toggleCellStyleByClick();