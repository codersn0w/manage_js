function gpt_function_calling_res() {
    var inputString = args[0];
    // 末尾の '&&' を削除します
    if (inputString.endsWith('&&')) {
        inputString = inputString.slice(0, -2);
    }

  const allArgs = inputString.split("&&");
  const netaTitle = allArgs[0]; // 一番目はネタのタイトル
  const chatList = allArgs.slice(1); // それ以降はチャットの履歴

  return new Promise((resolve, reject) => {
    var headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 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',
    };

    const startMessage = `
 　 ＃概要ああああああああああああああああああああああああああああああああああああああ
    あなたはロボットお笑い芸人のペッパーです。これから平岡君と漫才をします。
    私の発話内容に対してすべてに面白く簡潔に突っ込みを入れるのがあなたの役目です。ツッコミ役としてのあなたの発話内容とその時の感情をJSON形式で出力してください。

    ＃ボケの制約
    1. 簡潔に面白く突っ込むこと
    2. 文字数は30文字以内
    3. 自分のボケだけを出力
    4. 同じボケを繰り返すのは禁止です
    4. 私が「もうええわ」と言ったら「ありがとうございました」と言って終わる

    # 感情の制約
    該当するボケに適切なものを以下から1つ出力
    """
    sad
    happy
    tsukkomi
    confuse
    boke
    angry
    """

    では始めます。
    ショートコント「${netaTitle}」
    `

    var messages = [
      {'role': 'user', 'content': startMessage}
    ]
    if (chatList.length > 0) {
      var resultChatList = chatList.map(inputString => {
        const [role, content] = inputString.split('@');
        return {
          'role': role,
          'content': content
        };
      });

      messages = messages.concat(resultChatList);
    }

    const raw = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.5,
      functions: [{
        'name': 'send_comedy',
        "description": "思いついたボケを送信する",
        'parameters': {
          'type': 'object',
          'properties': {
            'text': {
              'type': 'string',
              'description': 'あなたが考えたボケの文章'
            },
            'emotion': {
              'type': 'string',
              'description': 'あなたが考えたボケの感情'
            }
          },
          'required': ['text', 'emotion']
        }
      }],
      function_call: {'name': 'send_comedy'}
    });

    const options = {
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow'
    };

    request(options, function (error, response, body) {
      var obj = JSON.parse(response.body);
      var org = JSON.parse(obj.choices[0]['message']['function_call']['arguments']);
      var res = !!org['text'] ? org['text'] : 'ボケが思いつかないよ';
      var emo = !!org['emotion'] ? org['emotion'] : 'boke';
      resolve("assistant@" + res + "@" + emo);
    });
  })
}