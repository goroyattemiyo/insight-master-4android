# InsightMasterforAndroid

SNSインサイト画面のスクリーンショットを1枚選ぶだけで、主要指標を読み取り、次の一手まで整理するAndroidアプリ（Web + Capacitor構成）。

---

## コンセプト

- **API不要** — アカウント連携・設定なしで即使える
- **スクショ1枚** — インサイト画面を撮るだけで分析開始
- **修正できる安心感** — OCR誤読はその場で直せる
- **初心者向け** — 数字をそのまま出さず、意味を言葉で伝える

---

## 対応SNS

| SNS | 主な抽出指標 |
|-----|------------|
| Threads | 表示・いいね・返信・リポスト・引用 |
| Instagram | リーチ・いいね・コメント・シェア・保存 |
| X | 表示・いいね・返信・リポスト・ブックマーク |

---

## 画面構成・フロー

```
index.html         # STEP 1: スクショ選択
  ↓
sns-select.html    # STEP 2: SNS選択
  ↓
ocr-extract.html   # STEP 3: OCR実行・数値修正
  ↓
analysis-result.html  # STEP 4: 分析結果表示・履歴保存
```

履歴は `history.html` でいつでも確認できる。

---

## 技術構成

| 項目 | 内容 |
|------|------|
| フロントエンド | HTML / CSS / Vanilla JS（フレームワークなし） |
| OCR | Tesseract.js v5（jpnモード / PSM6） |
| モバイル対応 | Web + Capacitor（Android向け） |
| データ保存 | localStorage（分析履歴）/ sessionStorage（画面間の値渡し） |
| 外部API | なし（MVP時点） |

---

## ディレクトリ構成

```
InsightMasterforAndroid/
├── web/
│   ├── index.html            # ホーム・スクショ選択
│   ├── sns-select.html       # SNS選択
│   ├── ocr-extract.html      # OCR実行・数値抽出・修正
│   ├── analysis-result.html  # 分析結果・履歴保存
│   └── history.html          # 分析履歴一覧
└── docs/
    ├── RULES.md
    ├── DEVELOPMENT_PLAN.md
    ├── DECISIONS.md
    ├── BACKLOG.md
    └── ...
```

---

## ローカルでの確認方法

ブラウザのセキュリティ制限により、`file://` では動作しない場合がある。ローカルサーバーを使うこと。

```bash
# Python 3
cd web
python -m http.server 8080
# → http://localhost:8080 を開く
```

---

## 分析ロジックの概要

OCRで抽出した数値をもとに、以下の指標を算出してルールベースで評価する。

| 指標 | 計算式 |
|------|--------|
| エンゲージメント率（ER） | （いいね＋返信＋リポスト等）÷ 表示 × 100 |
| 保存率 | 保存 ÷ 表示 × 100 |
| 拡散率 | （リポスト＋シェア）÷ 表示 × 100 |
| 返信率 | 返信 ÷ 表示 × 100 |

各指標をthresholdで「good / mid / low」に分類し、結論・良い点・弱い点・次の一手を生成する。

---

## 開発ルール

- 実装前に `docs/RULES.md` の有識者議論プロセスを必ず実施する
- MVP対象外の機能は `docs/BACKLOG.md` に積む
- ブランド名は `InsightMasterforAndroid` に統一する（旧称 `The Insight Editorial` は使用しない）

詳細は [`docs/RULES.md`](docs/RULES.md) を参照。

---

## 現在のステータス

MVP実装中。次のタスクは Threads用テンプレート → OCR数値マッピング精度向上 → 分析ロジック拡充。

詳細は [`docs/DEVELOPMENT_PLAN.md`](docs/DEVELOPMENT_PLAN.md) を参照。
