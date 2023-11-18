// 選択された日付を取得して1週間分表示する機能

// DOM 取得
const baseDateInput = document.getElementById('base-date');
const datesParent = document.querySelector('thead tr');

// 曜日名
const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

// 日付が選択されたときのイベント
baseDateInput.addEventListener('input', () => {
  const baseDate = new Date(baseDateInput.value);
  const dates = document.querySelectorAll('.date');
  dates.forEach(date => {
    date.remove();
  });
  renderDates(baseDate);
});

// 日付を1週間分表示する関数
const renderDates = (baseDate) => {
  for (let i = 0; i < 7; i++) {
    const month = baseDate.getMonth() + 1; // month は 0 が 1 月なので、表示するときには 1 を足す ※月をまたぐ場合の処理が未実装
    const date = baseDate.getDate() + i; // ※月をまたぐ場合の処理が未実装
    const day = dayOfWeek[(baseDate.getDay() + i) % 7];

    const date_th = document.createElement('th');
    date_th.textContent = `${month}/${date}(${day})`;
    date_th.classList.add('date');
    datesParent.appendChild(date_th);
  }
}

export { renderDates };
