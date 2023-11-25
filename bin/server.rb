require 'webrick'
require 'mysql2'
require 'erb'

# sleep 10

# MySQLデータベースへの接続を設定
client = Mysql2::Client.new(
  host: "db", # MySQLサーバーのホスト名
  username: "user", # MySQLユーザー名
  password: "userpassword", # MySQLパスワード
  database: "sukemi" # 使用するデータベース名
  encoding: "utf8mb4"#接続文字セット
)
puts "Connected to the MySQL database successfully."

# publicディレクトリのパスを取得
root = File.expand_path '../public', __dir__

# WEBrickサーバーの設定
server = WEBrick::HTTPServer.new(
  Port: 8000,
  DocumentRoot: root,
  DirectoryIndex: ['index.erb'] # デフォルトのディレクトリインデックスファイルを指定
)

# CSS ファイルに対するリクエストを処理するためにFileHandlerをマウント
server.mount('/css', WEBrick::HTTPServlet::FileHandler, File.join(root, 'css'))

# JavaScript ファイルに対するリクエストを処理するためにFileHandlerをマウント
server.mount('/js', WEBrick::HTTPServlet::FileHandler, File.join(root, 'js'))

# ERB ファイルの処理
server.mount_proc '/' do |req, res|
  template_path = File.join(root, 'index.erb') # 正しいERBファイルのパスを指定
  erb = ERB.new(File.read(template_path))
  res.content_type = 'text/html; charset=UTF-8' # コンテントタイプを指定
  res.body = erb.result(binding) # ERBテンプレートをレンダリングしてレスポンスのボディに設定
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
    
    # 成功メッセージを設定（またはリダイレクトなどを実行）
    res.body = "User name '#{user_name}' has been saved successfully!"
    res.content_type = 'text/html; charset=UTF-8'
  else
    # GETリクエストの場合は、フォームを表示
    res.set_redirect(WEBrick::HTTPStatus::TemporaryRedirect, '/')
  end
end




# Ctrl+Cが押されたときにサーバーをシャットダウンするためのトラップを設定
trap 'INT' do server.shutdown end

# サーバーを起動
server.start
