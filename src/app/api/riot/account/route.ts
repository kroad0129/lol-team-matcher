import { NextResponse } from "next/server";
import axios from "axios";

async function riotApiGet(url: string) {
  const res = await axios.get(url, {
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY as string,
    },
  });
  return res.data;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "gameName and tagLine are required" },
      { status: 400 }
    );
  }

  try {
    // ✅ Step 1. puuid 조회
    const accountData = await riotApiGet(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`
    );
    const puuid = accountData.puuid;

    // ✅ Step 2. 랭크 정보 조회 (League-V4 by-puuid)
    const ranks = await riotApiGet(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
    );

    // ✅ Step 3. 개인랭크, 자유랭크만 필터링 및 필요한 필드만 반환
    const soloEntry = ranks.find(
      (entry: any) => entry.queueType === "RANKED_SOLO_5x5"
    );
    const flexEntry = ranks.find(
      (entry: any) => entry.queueType === "RANKED_FLEX_SR"
    );

    const soloRank = soloEntry
      ? {
          tier: soloEntry.tier,
          rank: soloEntry.rank,
          winRate: (
            (soloEntry.wins / (soloEntry.wins + soloEntry.losses)) *
            100
          ).toFixed(1),
          veteran: soloEntry.veteran,
          hotStreak: soloEntry.hotStreak,
        }
      : null;

    const flexRank = flexEntry
      ? {
          tier: flexEntry.tier,
          rank: flexEntry.rank,
          winRate: (
            (flexEntry.wins / (flexEntry.wins + flexEntry.losses)) *
            100
          ).toFixed(1),
          veteran: flexEntry.veteran,
          hotStreak: flexEntry.hotStreak,
        }
      : null;

    // ✅ 최종 반환
    return NextResponse.json({ soloRank, flexRank });
  } catch (error: any) {
    console.error("Riot API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
