// スケジュールテーブルを生成する機能

// DOM 取得
const baseDateInput = document.getElementById('base-date');
const datesParent = document.querySelector('thead tr');

// 曜日名
const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

// 日付が選択されたら、 th の日付を更新 & td の data-date を更新
baseDateInput.addEventListener('input', () => {
  const baseDate = new Date(baseDateInput.value);
  const dates = document.querySelectorAll('.date');
  dates.forEach((date) => {
    date.remove();
  });
  renderDates(baseDate);
  renderDraggableTableData(baseDate);
});

// th に日付を1週間分表示する関数
const renderDates = (baseDate) => {
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(baseDate); // ベースの日付をコピー
    currentDay.setDate(baseDate.getDate() + i); // 日付を進める

    const month = currentDay.getMonth() + 1; // 月
    const date = currentDay.getDate(); // 日
    const day = dayOfWeek[currentDay.getDay()]; // 曜日

    const date_th = document.createElement('th');
    date_th.textContent = `${month}/${date}(${day})`;
    date_th.classList.add('date');
    datesParent.appendChild(date_th);
  }
};

// スケジュールテーブルを生成する関数
const renderDraggableTableData = (baseDate) => {
  const padToTwoDigits = (number) => number.toString().padStart(2, '0');

  // 日付をYYYY-MM-DD形式で取得する関数
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = padToTwoDigits(date.getMonth() + 1); // JavaScriptは月を0から数える
    const day = padToTwoDigits(date.getDate());
    return `${year}-${month}-${day}`;
  };

  // ES6でテーブルを生成するための関数
  const createTable = () => {
    let table = '<table>';
    for (let hour = 9; hour <= 16; hour++) {
      table += `<tr>`;
      table += `<th>${padToTwoDigits(hour)}:00</th>`; // 時間を2桁表示
      for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
        // 基点の日付からdayOffset日数だけ離れた日付を計算
        const date = new Date(baseDate); // 新しい Date オブジェクトを作成して baseDate をコピー
        date.setDate(date.getDate() + dayOffset);
        const formattedDate = getFormattedDate(date);
        // data-date属性にYYYY-MM-DD-HH形式で設定
        table += `<td data-date="${formattedDate}-${padToTwoDigits(
          hour
        )}"></td>`;
      }
      table += `</tr>`;
    }
    table += '</table>';
    document.getElementById('draggable-date-section').innerHTML = table;
  };

  createTable(baseDate);
};

export { renderDates, renderDraggableTableData };