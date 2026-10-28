import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getChallenges,
  getChallengeBySlug,
  getUserParticipationForChallenge,
} from "@/lib/data";
import { CheckinInteractiveView } from "./checkin-view";

export async function generateStaticParams() {
  const challenges = await getChallenges();
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default async function DetailProgresTantanganPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallengeBySlug(id);

  if (!challenge) {
    return notFound();
  }

  const participation = await getUserParticipationForChallenge(challenge.id);

  // If user hasn't joined this challenge yet, provide active initial container
  const activeProgress = participation || {
    id: "temp-participation",
    challenge_id: challenge.id,
    challenge_title: challenge.title,
    duration_days: challenge.duration_days,
    status: "active" as const,
    current_streak: 0,
    completed_days: [],
    checkins: [],
    started_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/tantangan"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Tantangan Saya</span>
        </Link>
      </div>

      <CheckinInteractiveView
        challenge={challenge}
        initialProgress={activeProgress}
      />
    </div>
  );
}
