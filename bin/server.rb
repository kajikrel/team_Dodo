require 'webrick'
require 'mysql2'

# MySQLデータベースへの接続を設定
client = Mysql2::Client.new(
  host: "team_dodo-db-1", # MySQLサーバーのホスト名
  username: "user", # MySQLユーザー名
  password: "userpassword", # MySQLパスワード
  database: "sukemi" # 使用するデータベース名
)
puts "Connected to the MySQL database successfully."

root = File.expand_path '../public', __dir__
server = WEBrick::HTTPServer.new Port: 8000, DocumentRoot: root

trap 'INT' do server.shutdown end

server.start
