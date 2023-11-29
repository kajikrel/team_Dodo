require 'webrick'
require 'mysql2'
require 'uri'
require 'erb'

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

    # 成功メッセージを設定
    res['Content-Type'] = 'text/html; charset=utf-8'
    res.body = "ユーザー名 #{user_name} が保存されました。"
  rescue Mysql2::Error => e
    res['Content-Type'] = 'text/html; charset=utf-8'
    res.body = "Error occurred: #{e.message}"
  ensure
    client&.close
  end
end

# ここまでが送信ボタンの処理


#ここからユーザーボタンをクリックした後の遷移
server.mount_proc '/user/' do |req, res|
  user_id = req.path_info.split('/').last

  puts "The root is: #{root}"

  begin
    client = Mysql2::Client.new(host: "localhost", username: "user", password: "password", database: "sukemi")
    
     # ユーザーIDを使用してユーザー名を取得する単一のクエリ
     user = client.query("SELECT user_name FROM users WHERE user_id = #{user_id}").first

    
    # インスタンス変数にユーザー名を格納　ユーザーが該当しなければunknownを返す
    @user_name = user ? user['user_name'] : "Unknown User"
    puts "Debug: User name is #{@user_name}"  #

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




trap 'INT' do server.shutdown end
server.start



