## Docker を利用した立ち上げ

# はじめに

Docker をインストールし、起動させておく

gitclone で sukemi ディレクトリを任意の場所に置く

1. ターミナルで Sukemi のディレクトリに移動し、下記コマンドを実行
   （バックグラウンドで実行する場合は、-d を末尾に追加）

```
docker-compose up
```

2. 起動できているか確認する

```
docker-compose ps
```

sukemi-app-1 　と　 sukemi-db-1 があれば OK！

http://localhost:8000/　にアクセスして表示されるか確認する。

3. DB へのアクセス。

```
docker exec -it sukemi-db-1 bash
```

bash 内で下記コマンドを実行　（パスワード:password）

```
mysql -u root -p
```

4. コンテナ停止

```
docker-compose down
```

What men???

mysql -u root -proot test --default-character-set=utf8 < hogehoge.sql
