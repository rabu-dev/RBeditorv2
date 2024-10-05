import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
];

const CodeEditor = ({ code, onCodeChange, language, onLanguageChange }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false},
        scrollBeyondLastLine: false,
        fontSize: 13,
        fontFamily: 'Fira Code, monospace',
        fontLigatures: true,
        lineHeight: 20,
        renderLineHighlight: 'all',
        wordWrap: 'on',
        padding: { top: 10, bottom: 10 },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        snippetSuggestions: 'inline',
      });

      editorRef.current.onDidChangeModelContent(() => {
        onCodeChange(editorRef.current.getValue());
      });

      // Configurar el tema personalizado
      monaco.editor.defineTheme('softDarkTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '#c792ea' },
          { token: 'string', foreground: '#c3e88d' },
          { token: 'number', foreground: '#f78c6c' },
          { token: 'comment', foreground: '#546e7a', fontStyle: 'italic' },
          { token: 'function', foreground: '#82aaff' },
          { token: 'variable', foreground: '#eeffff' },
          { token: 'type', foreground: '#89ddff' },
        ],
        colors: {
          'editor.background': '#2f3542',
          'editor.foreground': '#eeffff',
          'editor.lineHighlightBackground': '#3a3f4b',
          'editorCursor.foreground': '#eeffff',
          'editorWhitespace.foreground': '#546e7a',
          'editorIndentGuide.background': '#3a3f4b',
          'editor.selectionBackground': '#3a3f4b',
          'editor.inactiveSelectionBackground': '#3a3f4b80',
          'editorLineNumber.foreground': '#616e88',
          'editorLineNumber.activeForeground': '#a6accd',
        }
      });

      monaco.editor.setTheme('softDarkTheme');

      // Añadir snippet personalizado para HTML5
      monaco.languages.registerCompletionItemProvider('html', {
        triggerCharacters: ['!'],
        provideCompletionItems: (model, position) => {
          const linePrefix = model.getLineContent(position.lineNumber).substr(0, position.column);
          if (linePrefix.endsWith('!')) {
            return {
              suggestions: [
                {
                  label: '!html:5',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: [
                    '<!DOCTYPE html>',
                    '<html lang="en">',
                    '<head>',
                    '\t<meta charset="UTF-8">',
                    '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                    '\t<title>${1:Document}</title>',
                    '</head>',
                    '<body>',
                    '\t${0}',
                    '</body>',
                    '</html>'
                  ].join('\n'),
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'HTML5 template'
                }
              ]
            };
          }
          return { suggestions: [] };
        }
      });

      // Autocompletado mejorado para JavaScript
      monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'console.log(${1:value});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Log to the console'
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'function ${1:functionName}(${2:params}) {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Function declaration'
            },
            {
              label: 'arrow function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '(${1:params}) => ${2:expression}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Arrow function'
            },
            {
              label: 'if statement',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'if (${1:condition}) {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'If statement'
            },
            // Puedes añadir más sugerencias aquí
          ];
          return { suggestions };
        }
      });

      // Nuevas sugerencias para CSS
      monaco.languages.registerCompletionItemProvider('css', {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: 'flex',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'display: flex;',
              documentation: 'Set display to flex'
            },
            {
              label: 'grid',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'display: grid;',
              documentation: 'Set display to grid'
            },
            {
              label: 'media query',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                '@media screen and (min-width: ${1:768px}) {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Add a media query'
            }
          ]
        })
      });

      // Sugerencias para Python
      monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: 'def',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'def ${1:function_name}(${2:parameters}):',
                '\t${0:pass}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Define a new function'
            },
            {
              label: 'for',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'for ${1:item} in ${2:iterable}:',
                '\t${0:pass}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'For loop'
            },
            {
              label: 'if',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'if ${1:condition}:',
                '\t${0:pass}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'If statement'
            }
          ]
        })
      });

      // Sugerencias para Java
      monaco.languages.registerCompletionItemProvider('java', {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: 'sysout',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'System.out.println(${1:});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Print to console'
            },
            {
              label: 'for',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'For loop'
            },
            {
              label: 'public class',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'public class ${1:ClassName} {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Public class declaration'
            }
          ]
        })
      });

      // Sugerencias para Rust
      monaco.languages.registerCompletionItemProvider('rust', {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: 'fn',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'fn ${1:function_name}(${2:parameters}) -> ${3:ReturnType} {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Function declaration'
            },
            {
              label: 'if',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'if ${1:condition} {',
                '\t${2}',
                '} else {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'If-else statement'
            },
            {
              label: 'loop',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'loop {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Infinite loop'
            },
            {
              label: 'while',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'while ${1:condition} {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'While loop'
            },
            {
              label: 'for',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'for ${1:item} in ${2:iterator} {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'For loop'
            },
            {
              label: 'match',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'match ${1:expression} {',
                '\t${2:pattern} => ${3:result},',
                '\t_ => ${0},',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Match expression'
            },
            {
              label: 'let',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'let ${1:variable_name}: ${2:Type} = ${3:value};',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Variable declaration'
            },
            {
              label: 'println!',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'println!("${1:{}}", ${2:expression});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Print to console'
            },
            {
              label: 'vec!',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'vec![${1:values}]',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Create a vector'
            },
            {
              label: 'struct',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'struct ${1:StructName} {',
                '\t${2:field}: ${3:Type},',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Define a struct'
            },
            {
              label: 'impl',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'impl ${1:StructName} {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Implement methods for a struct'
            },
            {
              label: 'enum',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'enum ${1:EnumName} {',
                '\t${2:Variant1},',
                '\t${3:Variant2},',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Define an enum'
            },
            {
                label: 'main',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'fn main() {',
                '\t${0}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Define an main'
            },
            
            {
              label: 'loop',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'loop {',
                '\t${0}',
                '}',
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Infinite loop'
            },
            {
              label: 'if',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'if ${1:condition} {',
                '\t${2:expression}',
                '} ${3:else}',
                '${0}',
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Conditional expression'
            },
            {
              label: 'while',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'while ${1:condition} {',
                '\t${2:expression}',
                '}',
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'While loop'
            },
            {
              label: 'pt!',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'println!("${0}");',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Print to console'
            },
          ]
        })
      });
    }

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <select 
          onChange={(e) => onLanguageChange(e.target.value)} 
          value={language}
          className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <div 
        ref={containerRef} 
        className="border border-gray-600 rounded-md overflow-hidden" 
        style={{ height: '400px' }}
      />
    </div>
  );
};

export default CodeEditor;