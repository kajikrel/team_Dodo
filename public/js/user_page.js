// user_page.js
import { renderDates, renderDraggableTableData } from './renderDates.js';

document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  const selectedDateString = localStorage.getItem('selectedDate');
  const baseDate = selectedDateString ? new Date(selectedDateString) : new Date();

  // カレンダーの表示更新
  renderDates(baseDate);
  renderDraggableTableData(baseDate);

});

