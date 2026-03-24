import { notFound } from "next/navigation";

import { RoundDetailActions } from "@/components/round-detail-actions";
import { RoundDetailView } from "@/components/round-detail-view";
import { getRoundById } from "@/lib/round-repository";

type RoundDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoundDetailPage({ params }: RoundDetailPageProps) {
  const { id } = await params;
  const round = await getRoundById(id);

  if (!round) {
    notFound();
  }

  return (
    <div className="page-stack">
      <RoundDetailActions roundId={round.id} />
      <RoundDetailView round={round} />
    </div>
  );
}
