// モジュールスコープの変数
let currentUserId;
let userColor;
let isMouseDown = false;

// ユーザーボタンのクリックイベントを設定
const userButtons = document.querySelectorAll(".user-button");
userButtons.forEach((userButton) => {
  userButton.addEventListener("click", () => {
    currentUserId = userButton.dataset.userid;
    userColor = currentUserId === "1" ? "yellow" : "skyblue";
    // 色が変更されたことを示すためのログ
    console.log(`User ID: ${currentUserId}, Color: ${userColor}`);
  });
});

// 保存フォームの送信イベントを設定
const saveForm = document.getElementById("save-form");
saveForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`Saving for User ID: ${currentUserId}`);
});

// スケジュールテーブルを取得
const scheduleTable = document.querySelector("table");

// ドラッグとクリックのスタイル変更機能を追加
const addCellStyleByDragAndClick = () => {
  scheduleTable.addEventListener("mousedown", (event) => {
    if (event.target.tagName === "TD") {
      isMouseDown = true;

      // すでにセルに色がついている場合は、divideCell を呼び出す
      // currentUserId が 1 で、セルの色は skyblue (user 2 の色) の場合
      if (
        currentUserId === "1" &&
        event.target.style.backgroundColor === "skyblue"
      ) {
        event.target.appendChild(divideCell());
        // currentUserId が 2 で、セルの色は yellow (user 1 の色) の場合
      } else if (
        currentUserId === "2" &&
        event.target.style.backgroundColor === "yellow"
      ) {
        event.target.appendChild(divideCell());
      }

      // mousedown時の色を適用
      event.target.style.backgroundColor = userColor;
    }
  });

  scheduleTable.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  scheduleTable.addEventListener("mousemove", (event) => {
    if (isMouseDown && event.target.tagName === "TD") {
      event.target.style.backgroundColor = userColor;
    }
  });

  scheduleTable.addEventListener("click", (event) => {
    if (event.target.tagName === "TD") {
      // クリックしたセルの背景色をトグル
      event.target.style.backgroundColor =
        event.target.style.backgroundColor === userColor ? "" : userColor;
    }
  });

  scheduleTable.addEventListener("mouseleave", () => {
    isMouseDown = false;
  });

  // ドラッグ開始時のデフォルト動作をキャンセル
  scheduleTable.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
};

// セルを分割するための dom を返す関数
const divideCell = () => {
  // div を生成
  const containerCell = document.createElement("div");
  const user1Cell = document.createElement("div");
  const user2Cell = document.createElement("div");
  // div にクラス名をつける
  containerCell.classList.add("container-cell");
  user1Cell.classList.add("user1-cell");
  user2Cell.classList.add("user2-cell");
  // 完成した dom を呼び出しもとに返す
  containerCell.appendChild(user1Cell);
  containerCell.appendChild(user2Cell);
  return containerCell;
};

// ページロード後にスタイル変更機能を有効化
document.addEventListener("DOMContentLoaded", () => {
  addCellStyleByDragAndClick();
});
