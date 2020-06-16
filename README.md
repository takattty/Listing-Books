# Sharechat
Node.jsを使った、シェアハウス用のチャットツールです。


## 概要
- このチャットアプリを使うと、シェアハウスのメンバーとチャットをする事が出来ます。
- if you use this chat tool application, you can do communicate with sharehouse's members.


## このアプリを作ろうとした動機
- 自分でアプリを作りたいと思った時に、実際に誰かの役に立つ物を作りたいと考えました。そこで東京で住んでいたシェアハウスではオーナーと各個人が繋がっていていますが、横の繋がりが無かったので、みんなでチャットが出来るアプリを作ろうと考えたのがきっかけです。
- When I wanted to make an app myself, I really wanted to make something useful for someone.Then, in the share house that lived in Tokyo, the owner and each resident are connected, but since there was no horizontal connection, I decided to make an app that allows everyone to chat.


## 使っている技術や言語（FW）
- フロントエンド
  - HTML&CSS
  - Javascript
  - jQuery
- サーバーサイド
  - Node.js<br>
  →最初にサーバーサイドを学習したのがNode.jsでとても楽しかった事とリアルタイム性の特徴を持っている事を考慮し、今回はNode.jsを選択しました。
- DB
  - MySQL<br>
  →テーブル数3つ（account room message）
  
  
## 機能一覧
- ユーザー新規作成＋ログイン(C)
- チャットルーム新規作成＋ログイン(C)
- メッセージやユーザー情報、チャットルームの情報更新(U)
- チャットルームやメッセージの詳細ページ表示(R)
- メッセージやユーザー情報、チャットルームの情報削除(D)
- セッションによるユーザーの識別（編集や削除の判断）
- チャット機能


## 今回の開発で使用した新しい技術や特に意識した点
- Socket.io
  - Websocketを使用できるNode.jsのライブラリ「Socket.io」を使用してリアルタイムかつ双方向通信を行っています。
- issueページ
  - 今回の開発で詰まった所や解決法をissueにまとめています。理由としては再度似た様なエラーが出た際に、解決またはヒントになる様再現性を持たせる為です。
  
  
## 特に大変だった点
- 設計
  - 最初に考えていた設計から3回程度作り直しをした事が大変でした。原因は実際に作ってみないと気付かない挙動や見辛いフロントデザインがあったからです。なのでコードを書きつつ設計も考え直していました。この最初の設計が悪ければ開発に掛かる時間も増えるコードの量も増える事になると思うので、どんどんアプリを作り様々な種類の設計を考えていき最適解を見つけられる様になります。

- チャット機能の実装
  - チャットのデータとルーティングで得たデータを一緒に処理出来なかった事が大変でした。原因はルーティングで得たデータをSocket処理にどう参照させるかがわからずにいたからです。今回の解決策はベストプラクティスではないと思いますが、なんとかゴリ押しで``サーバー→フロント→サーバー``の流れで一旦フロントに渡してサーバー内のSocket処理で参照しました。<br>
  フロント：``chat.ejs 16,17,67,68行``<br>
  サーバー：``app.js 63~122行``


## 現時点での完成度(4/2時点）
- 85%
  - 基本的なCRUD機能の実装は終えて、4/2にようやくチャット機能を完成させる事が出来ました。（約半年弱この機能実装が出来ずにいました）ここからさらに機能を追加していきます。
  
  
## 知り合いのエンジニアの方に質問した事
- 2つのボタンをサーバー側でどう判別するか(https://github.com/takattty/Sharechat/issues/10)
  - フロントで片方のボタンを押した際に``onClick``の処理を実行し、引数にある値をサーバー側に渡してあげる。そしてその値をサーバー側で識別し、処理を行う。
  - ``/routes/chat.js``の140~154行目
  
### 今後の予定
- ~~「BCrypt」を使用したパスワードのハッシュ化~~
- ~~「Express-validator」によるバリデーションチェックと自作関数でのエスケープ処理~~
- 「Mocha」によるテスト機能の追加
-  ログイン失敗時のアラート機能の追加
-  ミドルウェア「Passport」による認証機能の強化
-  ユーザー削除機能の追加
- 「Vue.js」によるフロントデザインの改善
