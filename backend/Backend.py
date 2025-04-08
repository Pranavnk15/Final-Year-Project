from flask import Flask, request, jsonify
import re
import pickle
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def load_vulnerability_fixer():
    """Load model, tokenizers, and config"""
    # Load model
    model = tf.keras.models.load_model('model/vulnerability_fixer_model.keras')

    # Load tokenizers
    with open('model/tokenizer_input.pkl', 'rb') as f:
        tokenizer_input = pickle.load(f)
    with open('model/tokenizer_output.pkl', 'rb') as f:
        tokenizer_output = pickle.load(f)

    # Load config
    with open('model/model_config.json', 'r') as f:
        config = json.load(f)

    return model, tokenizer_input, tokenizer_output, config


class VulnerabilityFixer:
    def __init__(self):
        self.model, self.tokenizer_input, self.tokenizer_output, self.config = load_vulnerability_fixer()
        self.max_input_len = self.config['max_input_len']
        self.max_target_len = self.config['max_target_len']

    def predict_fix(self, vulnerable_code, temperature=0.7):
        """Generate cleaner fixes with post-processing"""
        # Get raw prediction
        raw_fix = self._raw_predict(vulnerable_code, temperature)

        # Post-processing
        clean_fix = self._post_process(raw_fix)
        return clean_fix

    def _raw_predict(self, vulnerable_code, temperature):
        """Core prediction logic"""
        input_seq = self.tokenizer_input.texts_to_sequences([vulnerable_code])
        input_seq = pad_sequences(input_seq, maxlen=self.max_input_len, padding='post')

        target_seq = np.zeros((1, self.max_target_len))
        target_seq[0, 0] = self.tokenizer_output.word_index['<start>']

        decoded_tokens = []
        for i in range(self.max_target_len - 1):
            predictions = self.model.predict([input_seq, target_seq], verbose=0)[0, i]

            if temperature > 0:
                predictions = np.log(predictions) / temperature
                exp_preds = np.exp(predictions)
                predictions = exp_preds / np.sum(exp_preds)
                sampled_token = np.random.choice(len(predictions), p=predictions)
            else:
                sampled_token = np.argmax(predictions)

            if sampled_token == self.tokenizer_output.word_index['<end>']:
                break

            decoded_word = self.tokenizer_output.index_word.get(sampled_token, '<unk>')
            decoded_tokens.append(decoded_word)
            target_seq[0, i + 1] = sampled_token

        return ' '.join(decoded_tokens)

    def _post_process(self, raw_code):
        """Clean up model output"""
        # Remove duplicate lines and trim
        lines = [line.strip() for line in raw_code.split('\n') if line.strip()]
        unique_lines = []
        seen = set()
        for line in lines:
            if line not in seen:
                seen.add(line)
                unique_lines.append(line)

        # Remove lines with obvious hardcoded test input
        test_input_patterns = [
            r'".*DROP TABLE.*--"',  # typical SQLi payload
            r'userInput\s*=',       # custom test input variable
        ]
        cleaned_lines = [
            line for line in unique_lines
            if not any(re.search(pat, line) for pat in test_input_patterns)
        ]

        # Count '?' placeholders in query
        query_lines = [line for line in cleaned_lines if 'SELECT' in line and '?' in line]
        num_placeholders = 0
        if query_lines:
            query_line = query_lines[0]
            num_placeholders = query_line.count('?')

        # Keep only matching number of pstmt.setString lines
        setstring_lines = [line for line in cleaned_lines if 'pstmt.setString' in line]
        cleaned_setstring_lines = setstring_lines[:num_placeholders]

        # Replace old setString lines with cleaned ones
        cleaned_lines = [
            line for line in cleaned_lines if 'pstmt.setString' not in line
        ] + cleaned_setstring_lines

        # Fix common syntax issues
        code = '\n'.join(cleaned_lines)
        code = re.sub(r'\);[\s]*\)', '));', code)
        code = re.sub(r'=\s*=\s*', '==', code)
        code = re.sub(r'\(\s*\)', '()', code)

        # Ensure braces are balanced
        open_braces = code.count('{')
        close_braces = code.count('}')
        if open_braces > close_braces:
            code += '\n}' * (open_braces - close_braces)

        return code


    def analyze_code(self, code):
        """Analyze code for common vulnerabilities"""
        vulnerabilities = []

        # Check for SQL Injection
        sql_patterns = [
            r'["\']\s*\+\s*\w+\s*\+\s*["\']',  # String concatenation in SQL
            r'Statement\s*\.\s*execute(Query)?\s*\(.*\)',  # Direct statement execution
            r'createStatement\s*\(\)'  # Raw statement creation
        ]
        if any(re.search(pattern, code, re.IGNORECASE) for pattern in sql_patterns):
            vulnerabilities.append({
                'type': 'SQL Injection',
                'description': 'The code appears to concatenate user input directly into SQL queries, making it vulnerable to SQL injection attacks.',
                'severity': 'High'
            })

        # Check for XSS
        xss_patterns = [
            r'\.getParameter\s*\(.*\)\s*\+\s*["\']<',  # User input in HTML tags
            r'\.getWriter\s*\(\)\s*\.\s*println\s*\(.*\)',  # Direct output to response
            r'innerHTML\s*=\s*.*\+\s*\w+\s*\+\s*.*'  # Setting innerHTML with user input
        ]
        if any(re.search(pattern, code, re.IGNORECASE) for pattern in xss_patterns):
            vulnerabilities.append({
                'type': 'Cross-Site Scripting (XSS)',
                'description': 'The code directly outputs user input without proper escaping, making it vulnerable to XSS attacks.',
                'severity': 'High'
            })

        # Check for Command Injection
        cmd_patterns = [
            r'Runtime\s*\.\s*getRuntime\s*\(\)\s*\.\s*exec\s*\(.*\)',
            r'ProcessBuilder\s*\(.*\)\s*\.\s*start\s*\(\)'
        ]
        if any(re.search(pattern, code, re.IGNORECASE) for pattern in cmd_patterns):
            vulnerabilities.append({
                'type': 'Command Injection',
                'description': 'The code executes system commands with user input, making it vulnerable to command injection attacks.',
                'severity': 'Critical'
            })

        # If no vulnerabilities found
        if not vulnerabilities:
            return [{
                'type': 'No vulnerabilities detected',
                'description': 'The code appears to be secure against common vulnerabilities.',
                'severity': 'None'
            }]

        return vulnerabilities


# Initialize the fixer once when the app starts
fixer = VulnerabilityFixer()


@app.route('/analyze', methods=['POST'])
def analyze():
    """Endpoint to analyze code for vulnerabilities"""
    try:
        data = request.get_json()
        code_snippet = data.get('code', '')

        if not code_snippet:
            return jsonify({'error': 'No code provided'}), 400

        vulnerabilities = fixer.analyze_code(code_snippet)

        return jsonify({
            'status': 'success',
            'vulnerabilities': vulnerabilities,
            'original_code': code_snippet
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/generate-patch', methods=['POST'])
def generate_patch():
    """Endpoint to generate a patch for vulnerable code"""
    try:
        data = request.get_json()
        code_snippet = data.get('code', '')

        if not code_snippet:
            return jsonify({'error': 'No code provided'}), 400

        # First analyze the code
        vulnerabilities = fixer.analyze_code(code_snippet)

        # If no vulnerabilities found, return early
        if vulnerabilities[0]['type'] == 'No vulnerabilities detected':
            return jsonify({
                'status': 'success',
                'message': 'No vulnerabilities detected - no patch needed',
                'original_code': code_snippet,
                'patch': code_snippet,
                'vulnerabilities': vulnerabilities
            })

        # Generate the patch
        patch = fixer.predict_fix(code_snippet)

        return jsonify({
            'status': 'success',
            'original_code': code_snippet,
            'patch': patch,
            'vulnerabilities': vulnerabilities
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)