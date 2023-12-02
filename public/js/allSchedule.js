// ここに記述するのは、最低限カレンダーを描画する機能
// データを取ってくる機能
// 色付けのみ

// allSchedule.js

// DOM 取得
const baseDateInput = document.getElementById("base-date");
const datesParent = document.querySelector("thead tr");
const draggableDateSectionElement = document.getElementById("draggable-date-section");

// 曜日名
const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 日付が選択されたときのイベント
baseDateInput.addEventListener("input", () => {
  const baseDate = new Date(baseDateInput.value);
  const dates = document.querySelectorAll(".date");

  // ローカルストレージに日付を保存
  const selectedDate = baseDateInput.value;
  localStorage.setItem('selectedDate', selectedDate);

  dates.forEach((date) => {
    date.remove();
  });

});

// 日付を1週間分表示する関数
const renderDates = (baseDate) => {
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(baseDate); // ベースの日付をコピー
    currentDay.setDate(baseDate.getDate() + i); // 日付を進める

    const month = currentDay.getMonth() + 1; // 月
    const date = currentDay.getDate(); // 日
    const day = dayOfWeek[currentDay.getDay()]; // 曜日

    const date_th = document.createElement("th");
    date_th.innerHTML = `<div>${month}/${date}<div><div class="day">${day}</div>`;
    date_th.classList.add("date");
    datesParent.appendChild(date_th);
  }
};

const renderDraggableTableData = (baseDate) => {
  const padToTwoDigits = (number) => number.toString().padStart(2, "0");

  // 日付をYYYY-MM-DD形式で取得する関数
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = padToTwoDigits(date.getMonth() + 1); // JavaScriptは月を0から数える
    const day = padToTwoDigits(date.getDate());
    return `${year}-${month}-${day}`;
  };

  // ES6でテーブルを生成するための関数
  const createTable = (startDate) => {
    let table = "<table>";
    for (let hour = 7; hour <= 24; hour++) {
      table += `<tr>`;
      if (hour === 24) {
        table += `<th class="time-24">${padToTwoDigits(hour)}</th>`; // 時間を2桁表示
      } else {
        table += `<th>${padToTwoDigits(hour)}</th>`; // 時間を2桁表示
      }
      for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
        // 基点の日付からdayOffset日数だけ離れた日付を計算
        const date = new Date(baseDate); // 新しい Date オブジェクトを作成して baseDate をコピー
        date.setDate(date.getDate() + dayOffset);
        const formattedDate = getFormattedDate(date);
        // data-date属性にYYYY-MM-DD-HH形式で設定
        table += `<td data-date="${formattedDate}-${padToTwoDigits(hour)}"></td>`;
      }
      table += `</tr>`;
    }
    table += "</table>";
    document.getElementById("draggable-date-section").innerHTML = table;
  };

  createTable(baseDate);
};

export { renderDates, renderDraggableTableData };

// ここまでカレンダー描画




// リロードした際にDBからデータを取ってきてserver.rbに投げる
document.addEventListener('DOMContentLoaded', () => {
  fetch('/schedules')
    .then(response => response.json())
    .then(schedulesData => {
      console.log('schedulesData:', schedulesData);
      // スケジュールデータをもとにセルに色をつける
      schedulesData.forEach(schedule => {
        const scheduleDate = schedule.date; // 形式は "YYYY-MM-DD"
        const startTime = schedule.to_time.substr(0, 2).padStart(2, '0'); // "HH:MM:SS" 形式から "HH" の部分を整数で取得
        const endTime = schedule.end_time.substr(0, 5); // 形式は "HH:MM"
        const userId = schedule.user_id;

        // 対象のセルを特定
        const cellSelector = `td[data-date="${scheduleDate}-${startTime}"]`;
        const cell = document.querySelector(cellSelector);

        // セルが存在する場合は色をつける
        if (cell) {
          cell.firstElementChild.children[userId - 1].classList.add(`user-color-${userId}`);
        }
      });
      displayFreeCell();
    });
});

// 4人とも選択しているセルをハイライト
const displayFreeCell = () => {
  const containerCells = document.querySelectorAll('.container-cell');
  containerCells.forEach((containerCell) => {
    const colors = ['user-color-1', 'user-color-2', 'user-color-3', 'user-color-4'];
    if (colors.every((color, index) => containerCell.children[index].classList.contains(color))) {
      Array.from(containerCell.children).forEach((elm) => {
        elm.style.backgroundColor = 'red';
      });
    }
  });
}

