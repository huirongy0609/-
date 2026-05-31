import Link from 'next/link';
import {CasesExplorer} from './CasesExplorer';
import {getCaseViews} from '@/lib/repositories/cases';

export default function CasesPage() {
  const cases = getCaseViews();

  return (
    <main className="pageShell">
      <section className="container pageHero withAction">
        <div>
          <p className="eyebrow">Case Library</p>
          <h1>全国社区治理案例库</h1>
          <p>沉淀信托制物业、老旧小区治理、财务公开、停车治理、业委会治理和AI社区治理等可讲述、可复盘的案例。</p>
        </div>
        <Link className="btn primary" href="/submit">
          提交案例
        </Link>
      </section>

      <CasesExplorer cases={cases} />
    </main>
  );
}
