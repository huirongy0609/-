import Link from 'next/link';
import {PageTitle} from '@/components/platform/PageTitle';
import {CasesExplorer} from './CasesExplorer';
import {getCaseViews} from '@/lib/repositories/cases';

export default function CasesPage() {
  const cases = getCaseViews();

  return (
    <main className="platformPage">
      <section className="platformContainer">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <PageTitle
            description="案例中心沉淀信托制物业、老旧小区治理、财务公开、停车治理和业委会治理等可复盘案例。"
            eyebrow="Case Center"
            title="案例中心"
          />
          <Link className="platformButton mb-8 inline-flex items-center" href="/submit">
            提交案例
          </Link>
        </div>
        <CasesExplorer cases={cases} />
      </section>
    </main>
  );
}
