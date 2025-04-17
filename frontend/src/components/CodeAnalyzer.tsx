import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench, Loader, AlertCircle } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Vulnerability {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'none' | string;
}

interface FileAnalysis {
  file: string;
  vulnerabilities: Vulnerability[];
}

interface PatchResult {
  file: string;
  patched_code: {
    code: string;
    summary: string;
  };
  vulnerabilities: Vulnerability[];
}

const CodeAnalyzer: React.FC = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FileAnalysis[] | null>(null);
  const [patchResults, setPatchResults] = useState<PatchResult[] | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const normalizeSeverity = (severity: string) => severity.toLowerCase();

  const analyzeCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: githubUrl }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON response');
      }

      const result = await response.json();
      if (result.results) {
        setAnalysisResult(result.results);
        setIsAnalyzed(true); // Show "Generate Patch" button
      } else {
        throw new Error('Invalid format from server');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setAnalysisResult(null);
      setIsAnalyzed(false); // Hide "Generate Patch" button on error
    }
    setLoading(false);
  };

  const generatePatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/generate_patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: githubUrl }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      if (result.patched_results) {
        setPatchResults(result.patched_results);
      } else {
        throw new Error('Invalid format from server');
      }
    } catch (error) {
      console.error('Patch generation failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setPatchResults(null);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (normalizeSeverity(severity)) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityEmoji = (severity: string) => {
    switch (normalizeSeverity(severity)) {
      case 'high': return '🔴';
      case 'medium': return '🟠';
      case 'low': return '🟢';
      default: return '✅';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <input
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="Paste GitHub Repository URL here..."
          className="w-full p-4 bg-gray-900 text-gray-100 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <div className="flex flex-col gap-4 mt-4">
          <motion.button
            onClick={analyzeCode}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-lg font-semibold w-fit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : <Search className="w-5 h-5" />}
            Analyze
          </motion.button>

          {isAnalyzed && (
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-300">Do you want to generate a patch?</p>
              <motion.button
                onClick={generatePatch}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold w-fit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : <Wrench className="w-5 h-5" />}
                Generate Patch
              </motion.button>
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </motion.div>
        )}
      </div>

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4">🧪 Vulnerability Report</h2>
          <div className="space-y-4">
            {analysisResult.map((fileAnalysis, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{fileAnalysis.file}</h3>
                {fileAnalysis.vulnerabilities.map((vuln, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(vuln.severity)}`}>
                        {getSeverityEmoji(vuln.severity)} {normalizeSeverity(vuln.severity).toUpperCase()}
                      </span>
                      <span className="font-semibold">{vuln.type}</span>
                    </div>
                    <p className="text-gray-300">{vuln.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {patchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4">🧾 Code & Patch Recommendation</h2>
          <div className="space-y-4">
            {patchResults.map((patch, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{patch.file}</h3>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Patched Code:</h4>
                  <SyntaxHighlighter language="java" style={atomOneDark} className="rounded-lg">
                    {patch.patched_code.code}
                  </SyntaxHighlighter>
                  <p className="text-gray-300">{patch.patched_code.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CodeAnalyzer;
