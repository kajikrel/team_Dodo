// 選択された日付を取得して1週間分表示する機能

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
  dates.forEach((date) => {
    date.remove();
  });
  renderDates(baseDate);
  renderDraggableTableData(baseDate);
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
    // 土日の場合に文字色を変えるための分岐処理
    if (day === "Sun") {
      date_th.innerHTML = `<div class="th-date sunday">${month}/${date}<div><div class="th-day">${day}</div>`;
    } else if (day === "Sat") {
      date_th.innerHTML = `<div class="th-date saturday">${month}/${date}<div><div class="th-day">${day}</div>`;
    } else {
      date_th.innerHTML = `<div class="th-date">${month}/${date}<div><div class="th-day">${day}</div>`;
    }
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