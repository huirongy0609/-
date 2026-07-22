'use client';

import {useState} from 'react';

type CitationPanelProps = {
  title?: string;
  items: Array<{label: string; value: string}>;
};

export function CitationPanel({title = '引用信息', items}: CitationPanelProps) {
  const [copied, setCopied] = useState(false);
  const citation = items.map((item) => `${item.label}：${item.value}`).join('\n');

  async function copyCitation() {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="citationPanel">
      <h2>{title}</h2>
      <dl>
        {items.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <button className="citationCopyButton" type="button" onClick={copyCitation}>
        {copied ? '已复制' : '复制引用'}
      </button>
    </div>
  );
}
