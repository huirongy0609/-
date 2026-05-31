'use client';

import {useState} from 'react';
import categories from '@/data/categories.json';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="pageShell">
      <section className="container pageHero">
        <p className="eyebrow">Open Collaboration</p>
        <h1>共建提交入口</h1>
        <p>全国参与者可以提交案例、动态、政策线索、舆情线索，或申请加入城市共建。当前为演示版，提交后仅展示本地成功状态。</p>
      </section>

      <section className="container submitGrid">
        <form
          className="submitForm"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label>
            姓名
            <input required placeholder="请输入姓名" />
          </label>
          <label>
            手机
            <input required placeholder="请输入手机号" />
          </label>
          <label>
            机构名称
            <input required placeholder="请输入机构名称" />
          </label>
          <label>
            身份类型
            <select required>
              {categories.identities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            城市
            <input required placeholder="如：常州" />
          </label>
          <label>
            区县
            <input placeholder="如：钟楼区" />
          </label>
          <label>
            提交类型
            <select required>
              {categories.submissionTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            标题
            <input required placeholder="请输入标题" />
          </label>
          <label className="full">
            内容描述
            <textarea required placeholder="请简要描述治理案例、政策线索、城市动态或共建需求" rows={7} />
          </label>
          <label className="full">
            相关链接
            <input placeholder="可填写公开链接，演示版不校验" />
          </label>
          <div className="uploadSlot full">上传图片/附件占位</div>
          <label className="checkbox full">
            <input required type="checkbox" />
            <span>同意平台审核后公开</span>
          </label>
          <button className="btn primary full" type="submit">
            提交至平台审核
          </button>
        </form>

        <aside className="submitAside">
          <h2>提交后状态</h2>
          {submitted ? (
            <div className="successBox">
              <strong>已提交</strong>
              <p>平台审核后将进入全国协同地图/案例库。</p>
            </div>
          ) : (
            <p>提交内容会先进入平台审核池。第一版不连接数据库，用于演示全国共建入口和审核后公开的产品逻辑。</p>
          )}
        </aside>
      </section>
    </main>
  );
}
