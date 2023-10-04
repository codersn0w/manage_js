import json
import os

def js_to_json(src_dir, json_path):
    # 既存のJSONデータを読み込む
    with open(json_path, 'r') as json_file:
        json_data = json.load(json_file)

    updated_codes = []
    for filename in os.listdir(src_dir):
        if filename.endswith(".js"):
            with open(os.path.join(src_dir, filename), 'r') as js_file:
                js_content = js_file.read()
                # 改行を\nに置き換える
                js_content = js_content.replace("\n", "\\n")

                # 既存のcodeデータを探す
                existing_code = next((code for code in json_data["targets"][0]["codes"] if code["name"] == filename.replace(".js", "")), None)
                
                if existing_code:
                    existing_code["data"] = js_content
                    updated_codes.append(existing_code)
                else:
                    # 新しいcodeデータを作成する場合の処理（必要に応じて調整）
                    code_data = {
                        "name": filename.replace(".js", ""),
                        "data": js_content,
                        # 他のデフォルトフィールドをここに追加
                    }
                    updated_codes.append(code_data)

    # codes部分のみを更新
    json_data["targets"][0]["codes"] = updated_codes

    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file)  # ここでindentを指定しない

def json_to_js(json_path, src_dir):
    with open(json_path, 'r') as json_file:
        json_data = json.load(json_file)
        for code_data in json_data["targets"][1]["codes"]:
            js_content = code_data["data"]
            # \nを実際の改行に置き換える
            js_content = js_content.replace("\\n", "\n")
            filename = code_data["name"] + ".js"
            with open(os.path.join(src_dir, filename), 'w') as js_file:
                js_file.write(js_content)

# 使用例
json_to_js('../data/project.json', '../src')