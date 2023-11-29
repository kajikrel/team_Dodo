import { renderDates, renderDraggableTableData } from "./renderDates.js";
// import { addCellStyleByDrag, toggleCellStyleByClick } from "./putSchedule.js";

// 初回アクセス時に表示するのは、アクセスしたその日から1週間分
document.addEventListener("DOMContentLoaded", () => {
	const today = new Date();
	renderDates(today);
	renderDraggableTableData(today);

	// ドラッグでスケジュールセルの見た目を変える
	// addCellStyleByDrag();
	// toggleCellStyleByClick();
});
