from flask import Flask, render_template, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return render_template('index.html')

# API端点示例
@app.route('/api/message', methods=['POST'])
def handle_message():
    data = request.get_json()
    client = OpenAI(
        api_key="sk-78297acc8edd4bfca05177c2e2dcdda1",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
    )
    
    completion = client.chat.completions.create(
        model="deepseek-r1",
        messages=[
            {'role': 'user', 'content': data['message']}
        ]
    )
    
    return jsonify({
        'reply': completion.choices[0].message.content,
        'reasoning': completion.choices[0].message.reasoning_content
    })

# 静态文件路由
@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

if __name__ == '__main__':
    app.run(debug=True)