# Rubyのバージョン3.2.2をベースイメージとして使用
FROM ruby:3.2.2

# 依存関係のライブラリをインストール
RUN apt-get update -qq && apt-get install -y default-libmysqlclient-dev

# 作業ディレクトリを設定
WORKDIR /app

# GemfileとGemfile.lockをコンテナ内の作業ディレクトリにコピー
COPY Gemfile Gemfile.lock /app/

# BundlerでGemをインストール
RUN bundle install

# プロジェクトのファイルをコンテナにコピー
COPY . /app

# WEBrickサーバーを起動するためのコマンド
CMD ["ruby", "bin/server.rb"]
