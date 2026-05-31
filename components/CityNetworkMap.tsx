'use client';

import Link from 'next/link';
import {useState} from 'react';

type City = {
  id: string;
  name: string;
  province: string;
  caseCount: number;
  policyCount: number;
  organizationCount: number;
  status: string;
  latestUpdate: string;
  tags: string[];
  x: number;
  y: number;
};

export function CityNetworkMap({cities, compact = false}: {cities: City[]; compact?: boolean}) {
  const [selectedCity, setSelectedCity] = useState<City>(cities.find((city) => city.status === 'active') || cities[0]);

  return (
    <div className={compact ? 'mapShell compactMap' : 'mapShell'}>
      <div className="mapCanvas" aria-label="全国城市协同网络示意图">
        <svg viewBox="0 0 100 86" role="img" aria-label="中国区域协同网络示意">
          <path
            className="mapShape"
            d="M19 23C27 10 45 8 60 12c11 3 19 11 23 21 5 12 2 26-8 34-10 9-25 11-39 8-14-3-25-12-29-24-4-11 4-19 12-28Z"
          />
          <path className="mapRoute" d="M63 31 72 48 66 77 57 55 42 58 48 45 63 31 69 39" />
          <path className="mapRoute faint" d="M76 15 63 31 57 55 38 71 42 58" />
          {cities.map((city) => (
            <g key={city.id}>
              <circle
                className={city.status === 'active' ? 'cityPulse' : 'cityPulse muted'}
                cx={city.x}
                cy={city.y}
                r={city.status === 'active' ? 4.8 : 3.8}
              />
              {!compact && (
                <text className="cityLabel" x={city.x + 2} y={city.y - 2}>
                  {city.name}
                </text>
              )}
            </g>
          ))}
        </svg>
        {cities.map((city) => (
          <button
            key={city.id}
            className={`cityDot ${selectedCity.id === city.id ? 'selected' : ''} ${city.status}`}
            style={{left: `${city.x}%`, top: `${city.y}%`}}
            onClick={() => setSelectedCity(city)}
            aria-label={`查看${city.name}城市卡片`}
          >
            <span />
          </button>
        ))}
      </div>

      <aside className="cityCard">
        <div className="statusLine">
          <span className={selectedCity.status === 'active' ? 'status active' : 'status pending'}>
            {selectedCity.status === 'active' ? '已点亮城市' : '待加入城市'}
          </span>
          <span>{selectedCity.province}</span>
        </div>
        <h3>{selectedCity.name}</h3>
        <div className="cityMetrics">
          <span>
            <strong>{selectedCity.caseCount}</strong>案例
          </span>
          <span>
            <strong>{selectedCity.policyCount}</strong>政策
          </span>
          <span>
            <strong>{selectedCity.organizationCount}</strong>机构
          </span>
        </div>
        <p>{selectedCity.latestUpdate}</p>
        <div className="tagRow">
          {selectedCity.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {!compact && (
          <div className="cardActions">
            <Link className="btn primary" href="/submit">
              提交本城市案例
            </Link>
            <Link className="btn secondary" href="/submit">
              加入城市共建
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
