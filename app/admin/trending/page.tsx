import TrendingManager from "@/components/admin/trending/TrendingManager";
import { TrendingService } from "@/services/trending-service";

export default async function AdminTrendingPage() {
  const state = await TrendingService.getAdminState();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Trending Section
        </h1>
        <p className="text-sm text-brand-muted-600">
          The block of featured packages on the home page. Write its heading,
          then choose which packages appear and in what order. Only active
          packages are shown to visitors.
        </p>
      </div>

      <TrendingManager key={JSON.stringify([state.title, state.subtitle, state.selected.map((s) => s.id)])} initial={state} />
    </div>
  );
}
