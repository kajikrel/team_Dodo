// ドキュメントが読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
  // フォームの取得
  const form = document.getElementById('user-form');
  
  // フォームの送信イベントをオーバーライド
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // デフォルトの送信を阻止
    
    // XMLHttpRequestオブジェクトの生成
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/add_user', true); // 送信先の指定
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // コンテントタイプの指定
    
    // レスポンスが返ってきた時の処理
    xhr.onload = function() {
      if (xhr.status === 200) {
        // サーバーの応答をポップアップで表示
        alert(xhr.responseText);
      } else {
        // エラー時の処理
        alert('Error: ' + xhr.statusText);
      }
    };
    
    // フォームのデータを送信
    const formData = new FormData(form);
    xhr.send(new URLSearchParams(formData).toString());
  });
});
