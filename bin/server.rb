require 'webrick'
require 'mysql2'
require 'erb'

sleep 10

# MySQLデータベースへの接続を設定
client = Mysql2::Client.new(
  host: "db", # MySQLサーバーのホスト名
  username: "user", # MySQLユーザー名
  password: "userpassword", # MySQLパスワード
  database: "sukemi" # 使用するデータベース名
)
puts "Connected to the MySQL database successfully."

root = File.expand_path '../public', __dir__
server = WEBrick::HTTPServer.new(
  Port: 8000,
  DocumentRoot: root
)

# CSS ファイルに対するリクエストの処理
server.mount('/css', WEBrick::HTTPServlet::FileHandler, File.join(root, 'css'))

# JavaScript ファイルに対するリクエストの処理
server.mount('/js', WEBrick::HTTPServlet::FileHandler, File.join(root, 'js'))

# ERB ファイルの処理
server.mount_proc '/' do |req, res|
  template_path = File.join(root, 'index.erb')
  erb = ERB.new(File.read(template_path))
  res.content_type = 'text/html; charset=UTF-8'
  res.body = erb.result(binding)
end

# ユーザー名をデータベースに保存するメソッド
def add_user(client, user_name)
  statement = client.prepare("INSERT INTO users (user_name) VALUES (?)")
  statement.execute(user_name)
end

# ユーザー名を受け取り、データベースに保存するためのエンドポイント
server.mount_proc '/add_user' do |req, res|
  if req.request_method == 'POST'
    # フォームデータからユーザー名を取得
    user_name = req.query['user_name']
    
    # データベースにユーザー名を保存
    add_user(client, user_name)
    
    # 単純なテキストメッセージを返す
    res.body = "User name '#{user_name}' has been saved successfully!"
    res.content_type = 'text/plain; charset=UTF-8' # MIMEタイプをtext/plainに変更
  else
    # GETリクエストの場合は、フォームを表示
    res.set_redirect(WEBrick::HTTPStatus::TemporaryRedirect, '/')
  end
end

# ユーザー情報を取得（ユーザーIDが1）
user_id_1 = 1
user_1 = client.query("SELECT user_name FROM users WHERE id = #{user_id_1}").first

# ユーザー情報を取得（ユーザーIDが2）
user_id_2 = 2
user_2 = client.query("SELECT user_name FROM users WHERE id = #{user_id_2}").first
trap 'INT' do server.shutdown end

server.start
