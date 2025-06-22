"use client";

import { useState } from "react";

type PlayerInput = {
  name: string;
  mainLane: string;
  subLane: string;
  tier: string;
  tierLevel?: string;
  power?: number;
};

type TeamResult = {
  teamA: PlayerInput[];
  teamB: PlayerInput[];
  scoreDiff: number;
};

const lanes = ["상관없음", "탑", "정글", "미드", "원딜", "서포터"];
const tiers = [
  "아이언",
  "브론즈",
  "실버",
  "골드",
  "플래티넘",
  "에메랄드",
  "다이아",
  "마스터",
  "그랜드마스터",
  "챌린저",
];
const tierLevels = ["1", "2", "3", "4"];

const laneColors: { [key: string]: string } = {
  탑: "#ef4444",
  정글: "#22c55e",
  미드: "#3b82f6",
  원딜: "#a855f7",
  서포터: "#eab308",
  상관없음: "#6b7280",
};

export default function Page() {
  const initialPlayers: PlayerInput[] = Array.from({ length: 10 }, () => ({
    name: "",
    mainLane: "상관없음",
    subLane: "상관없음",
    tier: "실버",
    tierLevel: "1",
    power: 5,
  }));

  const [players, setPlayers] = useState(initialPlayers);
  const [result, setResult] = useState<TeamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"tier" | "power">("tier");

  const handlePlayerChange = (
    index: number,
    field: keyof PlayerInput,
    value: string | number
  ) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const playersWithNames = players.map((player, index) => ({
      ...player,
      name: player.name.trim() || `플레이어 ${index + 1}`,
    }));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: playersWithNames, mode }),
      });

      if (!res.ok) throw new Error("매칭 실패");

      const data = await res.json();
      setResult(data);
      alert("팀 배정이 완료되었습니다!");
    } catch {
      alert("팀 자동 배정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlayers(initialPlayers);
    setResult(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Created by T!b3tF0x (김태희)
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
                margin: "0",
              }}
            >
              리그오브레전드 팀 매칭 (테스트버전)
            </h1>
            <p
              style={{
                color: "#6b7280",
                margin: "5px 0 0 0",
                fontSize: "14px",
              }}
            >
              주라인, 부라인, 티어&실력을 바탕으로 밸런스 있게 팀을 자동으로
              생성합니다.
            </p>
          </div>

          {/* 모드 선택 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
            >
              매칭 모드:
            </span>
            <div
              style={{
                display: "flex",
                background: "#f3f4f6",
                borderRadius: "8px",
                padding: "4px",
              }}
            >
              <button
                onClick={() => setMode("tier")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: mode === "tier" ? "#3b82f6" : "transparent",
                  color: mode === "tier" ? "white" : "#6b7280",
                }}
              >
                티어 기반
              </button>
              <button
                onClick={() => setMode("power")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: mode === "power" ? "#22c55e" : "transparent",
                  color: mode === "power" ? "white" : "#6b7280",
                }}
              >
                전력 기반
              </button>
            </div>
          </div>
        </div>

        {/* 플레이어 입력 */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                margin: "0",
              }}
            >
              플레이어 정보 입력
            </h2>
          </div>
          <div style={{ padding: "24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      width: "200px",
                    }}
                  >
                    닉네임
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      width: "150px",
                    }}
                  >
                    주 라인
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      width: "150px",
                    }}
                  >
                    부 라인
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      width: "200px",
                    }}
                  >
                    {mode === "tier" ? "티어" : "전력"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td
                      style={{
                        padding: "8px 6px",
                        width: "180px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder={`플레이어 ${index + 1}`}
                        value={player.name}
                        onChange={(e) =>
                          handlePlayerChange(index, "name", e.target.value)
                        }
                        style={{
                          width: "100%",
                          maxWidth: "160px",
                          padding: "6px 10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        value={player.mainLane}
                        onChange={(e) =>
                          handlePlayerChange(index, "mainLane", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          background: "white",
                        }}
                      >
                        {lanes.map((lane) => (
                          <option key={lane} value={lane}>
                            {lane}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        value={player.subLane}
                        onChange={(e) =>
                          handlePlayerChange(index, "subLane", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          background: "white",
                        }}
                      >
                        {lanes.map((lane) => (
                          <option key={lane} value={lane}>
                            {lane}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      {mode === "tier" ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <select
                            value={player.tier}
                            onChange={(e) =>
                              handlePlayerChange(index, "tier", e.target.value)
                            }
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "14px",
                              outline: "none",
                              background: "white",
                            }}
                          >
                            {tiers.map((tier) => (
                              <option key={tier} value={tier}>
                                {tier}
                              </option>
                            ))}
                          </select>
                          {!["마스터", "그랜드마스터", "챌린저"].includes(
                            player.tier
                          ) && (
                            <select
                              value={player.tierLevel || "1"}
                              onChange={(e) =>
                                handlePlayerChange(
                                  index,
                                  "tierLevel",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "60px",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                                outline: "none",
                                background: "white",
                              }}
                            >
                              {tierLevels.map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ) : (
                        <select
                          value={String(player.power ?? 5)}
                          onChange={(e) =>
                            handlePlayerChange(
                              index,
                              "power",
                              Number(e.target.value)
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            background: "white",
                          }}
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (n) => (
                              <option key={n} value={String(n)}>
                                {n}
                              </option>
                            )
                          )}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button
                onClick={resetForm}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  background: "white",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                초기화
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background: loading ? "#9ca3af" : "#3b82f6",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "배정 중..." : "팀 자동 배정하기"}
              </button>
            </div>
          </div>
        </div>

        {/* 결과 표시 */}
        {result && (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                ✅ 팀 배정 결과
              </h2>
            </div>
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                {/* 팀 A */}
                <div
                  style={{
                    border: "2px solid #3b82f6",
                    background: "#eff6ff",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1e40af",
                      textAlign: "center",
                      margin: "0 0 16px 0",
                    }}
                  >
                    팀 A
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {result.teamA.map((player, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "white",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <span style={{ fontWeight: "500", fontSize: "14px" }}>
                          {player.name}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              background: laneColors[player.mainLane],
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {player.mainLane} / {player.subLane}
                          </span>
                          <span
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "white",
                            }}
                          >
                            {mode === "tier"
                              ? `${player.tier}${
                                  player.tierLevel ? ` ${player.tierLevel}` : ""
                                }`
                              : `${player.power}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 팀 B */}
                <div
                  style={{
                    border: "2px solid #ef4444",
                    background: "#fef2f2",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#dc2626",
                      textAlign: "center",
                      margin: "0 0 16px 0",
                    }}
                  >
                    팀 B
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {result.teamB.map((player, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "white",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <span style={{ fontWeight: "500", fontSize: "14px" }}>
                          {player.name}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              background: laneColors[player.mainLane],
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {player.mainLane} / {player.subLane}
                          </span>
                          <span
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "white",
                            }}
                          >
                            {mode === "tier"
                              ? `${player.tier}${
                                  player.tierLevel ? ` ${player.tierLevel}` : ""
                                }`
                              : `${player.power}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
