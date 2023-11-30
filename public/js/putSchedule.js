// ドラッグでスケジュールセルの見た目を変える機能

// DOM 取得
const scheduleTable = document.querySelector("table");
const schedules = document.querySelectorAll("tbody td");

// mousedown の状態を保持
let isMouseDown = false;
let selectingDates = [];

// 選択された日付を取得して1週間分表示する機能

// DOM 取得
const baseDateInput = document.getElementById("base-date");
const datesParent = document.querySelector("thead tr");

// 曜日名
const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
// ドラッグ操作中にクラスを追加するためのフラグ
let isDragging = false;

scheduleTable.addEventListener("mousedown", (event) => {
	if (event.target.tagName === "TD") {
		isMouseDown = true;
		isDragging = false; // ドラッグが開始されたばかりなので、まだドラッグ状態ではない
	}
});

scheduleTable.addEventListener("mouseup", () => {
	isMouseDown = false;
});

scheduleTable.addEventListener("mousemove", (event) => {
	if (isMouseDown && event.target.tagName === "TD") {
		isDragging = true; // マウスが動いていれば、ドラッグ状態とみなす
		event.target.classList.add("is-free");
		const dateAttr = event.target.getAttribute("data-date");
		if (!selectingDates.includes(dateAttr)) {
			selectingDates.push(dateAttr);
		}
	}
});

// clickイベントリスナーでトグル操作を実行
scheduleTable.addEventListener("click", (event) => {
	if (event.target.tagName === "TD") {
		// もしドラッグ操作が行われていたら、クリックによるトグルは行わない
		if (isDragging) {
			isDragging = false; // ドラッグ状態をリセット
			return; // ここで処理を中断
		}

		const td = event.target;
		td.classList.toggle("is-free"); // クラスのトグル
		const dateAttr = td.getAttribute("data-date");
		if (td.classList.contains("is-free")) {
			if (!selectingDates.includes(dateAttr)) {
				selectingDates.push(dateAttr);
			}
		} else {
			selectingDates = selectingDates.filter((date) => date !== dateAttr);
		}
	}
});

//saveするとデータをポスト

const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", (event) => {
  event.preventDefault(); // フォームの自動送信を防ぐ

  // selectingDates からスケジュールデータを生成する
  const schedulesData = selectingDates.map((dateTimeString) => {
    // "-" で分割
    const parts = dateTimeString.split("-");
    
    // 日付と時間を取り出す
    const date = `${parts[0]}-${parts[1]}-${parts[2]}`; // "YYYY-MM-DD"
    const toTime = `${parts[3]}:00:00`; // "HH:00:00"
    
    // end_timeの設定（ここでは1時間後と仮定）
    const endTimeHour = parseInt(parts[3], 10) + 1; // 時間に1を足す
    const endTime = `${endTimeHour}:00:00`; // "HH+1:00:00"
    
    return {
      date: date,
      toTime: toTime,
      endTime: endTime
    };
  });



  // AJAXリクエストを作成して送信
  const userId = window.location.pathname.split('/').pop();

  fetch("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId, // ユーザーID
      schedules: schedulesData // 生成したスケジュールデータ
    })
  }).then(response => {
    if(response.ok) {
      return response.json(); // ここでJSONとしてレスポンスをパースする
    } else {
      throw new Error('Server responded with an error.'); // ここでエラーを投げる
    }
  }).then(data => {
    console.log("スケジュールが保存されました", data); // 保存成功のメッセージと共にサーバーからのレスポンスを出力
    window.location.href = '/'; // ここでルートURLにリダイレクトする
  }).catch(error => {
    console.error("エラーが発生しました", error);
  });
});
