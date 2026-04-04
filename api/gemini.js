export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { imageBase64, imagesBase64, mimeType, mimeTypes, sns } = req.body;
  if ((!imageBase64 && !imagesBase64) || !sns) {
    return res.status(400).json({ error: 'image and sns are required' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // 複数枚対応: imagesBase64配列 or 単体imageBase64を統一
  const images = imagesBase64
    ? imagesBase64.map((b64, i) => ({ data: b64, mime: (mimeTypes && mimeTypes[i]) || 'image/jpeg' }))
    : [{ data: imageBase64, mime: mimeType || 'image/jpeg' }];

  const threadsRules = `
【Threads固有ルール】
- Threadsにはハッシュタグ機能が存在しない。「次の一手」でハッシュタグを推奨しないこと。
- 主要指標: 閲覧数・いいね・返信・リポスト・引用・インタラクション合計
- エンゲージメント率の目安: 閲覧数に対していいね+返信+リポスト+引用が1〜3%で良好`;

  const instagramRules = `
【Instagram固有ルール】
- 2025年以降、全投稿形式の表示指標は「閲覧数（Views）」に統一されている
- アルゴリズムが最も重視するのは「シェア（送信）数」。シェアが多い投稿は高く評価する
- 保存数も重要指標。保存が多い投稿はノウハウ・資産性コンテンツとして評価する
- ハッシュタグは2025年12月より最大5個制限。「次の一手」で大量タグを推奨しないこと
- ハッシュタグからの流入は全体の1%以下が多い。タグより内容・シェアを重視した助言をする
- エンゲージメント率の目安: リーチに対してインタラクション合計が3〜5%で良好`;

  const xRules = `
【X固有ルール】
- 主要指標: インプレッション・いいね・リポスト・返信・ブックマーク・リンククリック
- エンゲージメント率の目安はフォロワー規模により異なる:
  小規模（1万未満）: 2〜5%が目安
  中規模（1万〜10万）: 1〜3%が目安
  大規模（10万以上）: 0.5〜2%が目安
- Xアナリティクスの詳細機能は2025年現在X Premium（有料）限定。「アナリティクスで確認を」と案内する際は無料ユーザーへの配慮を忘れないこと
- ブックマーク（保存）が多い投稿は情報価値が高い証拠として評価する`;

  const snsRule = sns === 'Threads' ? threadsRules : sns === 'Instagram' ? instagramRules : xRules;

  const imageCount = images.length;
  const prompt = `あなたはSNSインサイト画像の数値を読み取る専門家です。
${imageCount > 1 ? `今回は${imageCount}枚の画像が送られています。すべての画像をスキャンして数値を統合してください。` : ''}

【ステップ1: 数値スキャン】
画面全体をくまなくスキャンし、すべての数字を見つけてください。
数字の近くにあるラベル（日本語・英語）と紐付けて数値を特定してください。
グラフ・チャート内の数値も見落とさないようにしてください。
${imageCount > 1 ? '複数枚ある場合は同じ指標が重複していれば最大値を採用してください。' : ''}

【ステップ2: JSON出力】
以下のJSON形式のみで返答してください。他のテキストは一切含めないでください。

{
  "metrics": {
    "views": null,
    "reach": null,
    "impressions": null,
    "likes": null,
    "replies": null,
    "reposts": null,
    "quotes": null,
    "shares": null,
    "bookmarks": null,
    "interactions": null,
    "follows": null,
    "profileVisits": null,
    "linkClicks": null
  },
  "analysis": {
    "summary": "結論を1〜2文で",
    "strengths": ["良い点1", "良い点2"],
    "weaknesses": ["弱い点1", "弱い点2"],
    "actions": ["次の一手1", "次の一手2"]
  },
  "screenType": "post または account"
}

【数値変換ルール】
- 万・K・M単位を整数に変換する（例: 144.9万 → 1449000、1.2K → 1200）
- "--" や空欄はnullとして扱う
- 取得できない項目はnullのままにする

【分析ルール】
- screenTypeは投稿単体なら"post"、アカウント概要なら"account"
- 分析は日本語で、SNS初心者にもわかりやすく書く
- SNSは${sns}の文脈で分析する
- 取得できなかった指標（nullの項目）については弱い点に書かない
- 良い点・弱い点・次の一手はそれぞれ2〜3件にまとめる
- 良い点がない場合は「改善余地が大きい状態です」など前向きな表現にする
- 分析文に画像内のアカウント名・投稿文・固有名詞を引用しない

${snsRule}`;

  try {
    const parts = [{ text: prompt }];
    for (const img of images) {
      parts.push({ inline_data: { mime_type: img.mime, data: img.data } });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
        })
      }
    );
    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: 'Gemini API error', detail: err });
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: 'Parse error', detail: e.message });
  }
}
