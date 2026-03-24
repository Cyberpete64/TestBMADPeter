import { notFound } from "next/navigation";

import { RoundEditForm } from "@/components/round-edit-form";
import { getRoundById } from "@/lib/round-repository";

type RoundEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoundEditPage({ params }: RoundEditPageProps) {
  const { id } = await params;
  const round = await getRoundById(id);

  if (!round) {
    notFound();
  }

  return <RoundEditForm round={round} />;
}
