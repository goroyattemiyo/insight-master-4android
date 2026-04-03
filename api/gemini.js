export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { imageBase64, mimeType, sns } = req.body;
  if (!imageBase64 || !sns) {
    return res.status(400).json({ error: 'imageBase64 and sns are required' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  const prompt = `あなたはSNSインサイト画像の数値を読み取る専門家です。

【ステップ1: 数値スキャン】
画面全体をくまなくスキャンし、すべての数字を見つけてください。
数字の近くにあるラベル（日本語・英語）と紐付けて数値を特定してください。
グラフ・チャート内の数値も見落とさないようにしてください。

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
- ${sns}の一般的な平均水準（エンゲージメント率1〜3%など）と比較して評価する
- 分析文に画像内のアカウント名・投稿文・固有名詞を引用しない
- 取得できなかった指標（nullの項目）については弱い点に書かない
- 良い点・弱い点・次の一手はそれぞれ2〜3件にまとめる
- 良い点がない場合は「改善余地が大きい状態です」など前向きな表現にする`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } }
            ]
          }],
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
