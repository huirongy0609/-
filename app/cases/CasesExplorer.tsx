'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {Search} from 'lucide-react';
import categories from '@/data/categories.json';
import type {CaseView} from '@/lib/domain/case';

type CasesExplorerProps = {
  cases: CaseView[];
};

export function CasesExplorer({cases}: CasesExplorerProps) {
  const cities = useMemo(() => Array.from(new Set(cases.map((item) => item.city))), [cases]);
  const tags = useMemo(() => Array.from(new Set(cases.flatMap((item) => item.tags))), [cases]);
  const [category, setCategory] = useState('全部');
  const [city, setCity] = useState('全部');
  const [tag, setTag] = useState('全部');
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const key = keyword.trim();
    return cases.filter((item) => {
      const matchCategory = category === '全部' || item.tags.includes(category) || item.model.includes(category);
      const matchCity = city === '全部' || item.city === city;
      const matchTag = tag === '全部' || item.tags.includes(tag);
      const matchKeyword =
        !key ||
        [item.title, item.problem, item.model, item.result, item.city, item.district, item.submitter].some((value) =>
          value.includes(key),
        );
      return matchCategory && matchCity && matchTag && matchKeyword;
    });
  }, [cases, category, city, tag, keyword]);

  return (
    <>
      <section className="container toolBar stacked">
        <div className="searchBox">
          <Search size={18} />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索案例标题、问题、城市或提交主体" />
        </div>
        <div className="filterRow">
          {['全部', ...categories.cases].map((item) => (
            <button className={category === item ? 'filter active' : 'filter'} key={item} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="selectGrid">
          <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="城市筛选">
            {['全部', ...cities].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={tag} onChange={(event) => setTag(event.target.value)} aria-label="标签筛选">
            {['全部', ...tags].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="container caseGrid">
        {filtered.map((item) => (
          <Link className="caseCard" href={`/cases/${item.id}`} key={item.id}>
            <div className="cardMeta">
              <span>{item.city}</span>
              <span>{item.district}</span>
              <span>{item.status === 'approved' ? '已审核' : '审核中'}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.problem}</p>
            <div className="caseModel">{item.model}</div>
            <div className="tagRow">
              {item.tags.map((caseTag) => (
                <span key={caseTag}>{caseTag}</span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
