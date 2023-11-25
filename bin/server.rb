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

# Ctrl+Cが押されたときにサーバーをシャットダウンするためのトラップを設定
trap 'INT' do server.shutdown end

# サーバーを起動
server.start
