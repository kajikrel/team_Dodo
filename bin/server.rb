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

# ERB ファイルの処理
server.mount_proc '/' do |req, res|
  template_path = File.join(root, 'index.erb')
  erb = ERB.new(File.read(template_path))
  res.content_type = 'text/html; charset=UTF-8'
  res.body = erb.result(binding)
end

trap 'INT' do server.shutdown end

server.start
