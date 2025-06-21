import { type NextRequest, NextResponse } from "next/server";

const LANES = ["탑", "정글", "미드", "원딜", "서포터"];
const TIERS = [
  "아이언",
  "브론즈",
  "실버",
  "골드",
  "플래티넘",
  "다이아",
  "마스터",
  "그랜드마스터",
  "챌린저",
];

export type PlayerInput = {
  name: string;
  mainLane: string;
  subLane: string;
  tier: string;
  tierLevel?: string;
  power?: number;
};

export async function POST(req: NextRequest) {
  const { players, mode }: { players: PlayerInput[]; mode: "tier" | "power" } =
    await req.json();

  if (!Array.isArray(players) || players.length !== 10) {
    return NextResponse.json(
      { error: "플레이어 수는 정확히 10명이어야 합니다." },
      { status: 400 }
    );
  }

  const { teamA, teamB } = findBestTeams(players, mode);

  // ✅ 누락 방지를 위한 보정 처리
  const sanitize = (team: PlayerInput[]) =>
    team.map((p) => ({
      name: p.name,
      mainLane: p.mainLane ?? "상관없음",
      subLane: p.subLane ?? "상관없음",
      tier: p.tier,
      tierLevel: p.tierLevel ?? "1",
      power: p.power ?? 5,
    }));

  return NextResponse.json({
    teamA: sanitize(teamA),
    teamB: sanitize(teamB),
    scoreDiff: 0,
  });
}

function findBestTeams(players: PlayerInput[], mode: "tier" | "power") {
  const combos = combinations(10, 5);
  let best = {
    score: Number.POSITIVE_INFINITY,
    teamA: [] as PlayerInput[],
    teamB: [] as PlayerInput[],
  };

  for (const pick of combos) {
    const teamA = pick.map((i) => players[i]);
    const teamB = players.filter((_, i) => !pick.includes(i));

    const skillGap = Math.abs(
      teamA.reduce((s, p) => s + power(p, mode), 0) -
        teamB.reduce((s, p) => s + power(p, mode), 0)
    );

    const laneScore = laneBalance(teamA) + laneBalance(teamB);
    const score = skillGap * 3 + (10 - laneScore) * 2;

    if (score < best.score) best = { score, teamA, teamB };
  }

  return best;
}

function power(p: PlayerInput, mode: "tier" | "power") {
  if (mode === "power") return p.power ?? 5;

  const idx = TIERS.indexOf(p.tier);
  const base = idx * 4;
  if (idx >= 6) return base + 4;

  const level = Number(p.tierLevel ?? "1");
  return base + (5 - level);
}

function laneBalance(team: PlayerInput[]) {
  const map = new Map<string, number>();
  LANES.forEach((l) => map.set(l, 0));

  team.forEach((p) => {
    if (LANES.includes(p.mainLane))
      map.set(p.mainLane, (map.get(p.mainLane) ?? 0) + 1);
  });

  team.forEach((p) => {
    if (LANES.includes(p.subLane) && (map.get(p.subLane) ?? 0) < 1) {
      map.set(p.subLane, (map.get(p.subLane) ?? 0) + 0.6);
    }
  });

  team
    .filter((p) => p.mainLane === "상관없음")
    .forEach(() => {
      const needLane = [...LANES].sort(
        (a, b) => (map.get(a) ?? 0) - (map.get(b) ?? 0)
      )[0];
      map.set(needLane, (map.get(needLane) ?? 0) + 0.4);
    });

  let sum = 0;
  LANES.forEach((l) => (sum += Math.min(map.get(l) ?? 0, 1)));
  return sum;
}

function combinations(n: number, k: number) {
  const results: number[][] = [];
  const recur = (start: number, path: number[]) => {
    if (path.length === k) return results.push([...path]);
    for (let i = start; i < n; i++) {
      path.push(i);
      recur(i + 1, path);
      path.pop();
    }
  };
  recur(0, []);
  return results;
}
