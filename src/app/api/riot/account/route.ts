import { NextResponse } from "next/server";
import axios from "axios";

type LeagueEntry = {
  queueType: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  veteran: boolean;
  hotStreak: boolean;
};

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
    const accountData = await riotApiGet(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`
    );
    const puuid = accountData.puuid;

    const ranks = (await riotApiGet(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
    )) as LeagueEntry[];

    const soloEntry = ranks.find(
      (entry) => entry.queueType === "RANKED_SOLO_5x5"
    );
    const flexEntry = ranks.find(
      (entry) => entry.queueType === "RANKED_FLEX_SR"
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

    return NextResponse.json({ soloRank, flexRank });
  } catch (error) {
    const err = error as {
      response?: { data: unknown; status: number };
      message: string;
    };
    console.error("Riot API Error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || "Internal server error" },
      { status: err.response?.status || 500 }
    );
  }
}
