require 'webrick'
require 'mysql2'
require 'uri'
require 'erb'
require 'json'

sleep 5

mime_types = WEBrick::HTTPUtils::DefaultMimeTypes
mime_types.store 'js', 'application/javascript'


#静的ファイルの読み込みと、serverの設定
root = File.expand_path '../public', __dir__
server = WEBrick::HTTPServer.new(
  Port: 8000,
  DocumentRoot: root,
  MimeTypes: mime_types
)

# CSS ファイルに対するリクエストの処理
server.mount('/css', WEBrick::HTTPServlet::FileHandler, File.join(root, 'css'))

# JavaScript ファイルに対するリクエストの処理
server.mount('/js', WEBrick::HTTPServlet::FileHandler, File.join(root, 'js'))

puts "JavaScript files will be served from: #{File.join(root, 'js')}"


#ここからルートのコーディング
server.mount_proc '/' do |req, res|
  begin
    client = Mysql2::Client.new(host: "db", username: "user", password: "userpassword", database: "sukemi")
    user_info = client.query("SELECT user_id, user_name FROM users")

    # ユーザー名を配列に格納
    user_ids = user_info.map { |row| row['user_id'] }
    user_names = user_info.map { |row| row['user_name'] }

  rescue Mysql2::Error => e
    puts "An error occurred: #{e.message}"
  ensure
    client&.close
  end

  template = ERB.new(File.read(File.join(__dir__, '..', 'public', 'index.erb')))
  res.body = template.result(binding)

  res['Content-Type'] = 'text/html; charset=utf-8'
end

#ここまでがルートのコーディング

# 送信ボタンを押したときの処理
server.mount_proc '/submit' do |req, res|
  begin
    # フォームからのデータを取得
    user_name = req.query['user-name'].force_encoding('UTF-8')

# MySQLデータベースへの接続を設定
client = Mysql2::Client.new(
  host: "db", # MySQLサーバーのホスト名
  username: "user", # MySQLユーザー名
  password: "userpassword", # MySQLパスワード
  database: "sukemi", # 使用するデータベース名
  encoding: 'utf8mb4' 
)

query = "INSERT INTO users (user_name) VALUES ('#{user_name}')"
client.query(query)
result = client.query("SELECT LAST_INSERT_ID() AS last_id")
user_id = result.first['last_id']


     # JSON形式でレスポンスを返す
     res['Content-Type'] = 'application/json'
     res.body = { message: "ユーザー名 #{user_name} が保存されました。", user_id: user_id, user_name: user_name }.to_json
   rescue Mysql2::Error => e
     res['Content-Type'] = 'application/json'
     res.status = 500
     res.body = { error: "Error occurred: #{e.message}" }.to_json
   ensure
     client&.close
   end
 end

# ここまでが送信ボタンの処理


#ここからユーザーボタンをクリックした後の遷移
server.mount_proc '/user/' do |req, res|
  user_id = req.path_info.split('/').last

  begin
    client = Mysql2::Client.new(host: "localhost", username: "user", password: "password", database: "sukemi")
    
     # ユーザーIDを使用してユーザー名を取得する単一のクエリ
     user = client.query("SELECT user_name FROM users WHERE user_id = #{user_id}").first

    
    

  rescue Mysql2::Error => e
    res.body = "An error occurred: #{e.message}"
  ensure
    client&.close
  end

  # user_page.erb テンプレートを読み込む
  template = ERB.new(File.read(File.join(__dir__, '..', 'public', 'user_page.erb')))
  res.body = template.result(binding)

  res['Content-Type'] = 'text/html; charset=utf-8'
end

#ここまでユーザーボタンの処理

#saveボタンのpost処理　ユーザースケジュール登録
server.mount_proc '/save' do |req, res|
  payload = JSON.parse(req.body)

  begin
    client = Mysql2::Client.new(host: "db", username: "user", password: "userpassword", database: "sukemi")

    # まずユーザーの既存スケジュールを削除する
    client.query("DELETE FROM schedules WHERE user_id = #{payload['user_id']}")
    
    payload["schedules"].each do |schedule| # ここでpayloadのキーを"schedules"に修正
      date = schedule['date']
      to_time = schedule['toTime']
      end_time = schedule['endTime']

      client.query("INSERT INTO schedules (user_id, date, to_time, end_time) VALUES (#{payload["user_id"]}, '#{date}', '#{to_time}', '#{end_time}')")
    end

    res['Content-Type'] = 'application/json'
    res.body = { message: "Schedule saved successfully" }.to_json
  rescue Mysql2::Error => e
    puts "An error occurred: #{e.message}"
    res['Content-Type'] = 'application/json'
    res.status = 500
    res.body = { error: e.message }.to_json
  ensure
    client&.close
  end
end

#mainページにスケジュールを表示させるためのエンドポイント
server.mount_proc '/schedules' do |req, res|
  begin
    client = Mysql2::Client.new(host: "db", username: "user", password: "userpassword", database: "sukemi")
    schedules = client.query("SELECT * FROM schedules")

    schedules_data = schedules.map do |schedule|
      {
        user_id: schedule['user_id'], 
        date: schedule['date'], 
        to_time: schedule['to_time'].strftime('%H:%M:%S'),
        end_time: schedule['end_time'].strftime('%H:%M:%S') 
      }
    end

    res.content_type = 'application/json'
    res.body = schedules_data.to_json
  rescue Mysql2::Error => e
    puts "An error occurred: #{e.message}"
    res.status = 500
    res.content_type = 'application/json'
    res.body = { error: e.message }.to_json
  ensure
    client&.close
  end
end









trap 'INT' do server.shutdown end
server.start



