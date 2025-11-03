import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CodeBlock = ({ code, language = "javascript", showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  // Simple syntax highlighting for common languages
  const highlightSyntax = (code, lang) => {
    const keywords = {
      javascript: ["function", "const", "let", "var", "if", "else", "for", "while", "return", "class", "extends", "import", "export", "async", "await"],
      python: ["def", "class", "if", "else", "elif", "for", "while", "return", "import", "from", "try", "except", "with", "as"],
      java: ["public", "private", "protected", "class", "interface", "extends", "implements", "import", "package", "return", "if", "else", "for", "while"],
    };

    let highlighted = code;
    const langKeywords = keywords[lang] || keywords.javascript;
    
    // Highlight keywords
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-blue-400 font-medium">${keyword}</span>`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>');
    
    return highlighted;
  };

  const lines = code.split("\n");
  const highlightedCode = highlightSyntax(code, language);

  return (
    <motion.div
      className="relative bg-gray-900 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-gray-400 text-sm font-mono">{language}</span>
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name={copied ? "Check" : "Copy"} size={16} />
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>

      {/* Code Content */}
      <div className="flex">
        {showLineNumbers && (
          <div className="bg-gray-800 px-3 py-4 text-gray-500 text-sm font-mono select-none">
            {lines.map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        
        <pre className="flex-1 p-4 overflow-x-auto text-sm leading-6">
          <code 
            className="text-gray-100 font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </motion.div>
  );
};

export default CodeBlock;