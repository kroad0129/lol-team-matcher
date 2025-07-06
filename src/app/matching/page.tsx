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

  const [players, setPlayers] = useState<PlayerInput[]>(initialPlayers);
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
    } catch (error) {
      console.error(error);
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
        Created by T!b3tF0x
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header
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
              리그오브레전드 팀 매칭
            </h1>
            <p
              style={{
                color: "#6b7280",
                margin: "5px 0 0 0",
                fontSize: "14px",
              }}
            >
              주라인, 부라인, 티어&실력을 바탕으로 밸런스 있게 팀을 자동
              생성합니다.
            </p>
          </div>

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
        </header>

        <main
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "16px",
            }}
          >
            플레이어 정보 입력
          </h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={thStyle}>닉네임</th>
                <th style={thStyle}>주 라인</th>
                <th style={thStyle}>부 라인</th>
                <th style={thStyle}>{mode === "tier" ? "티어" : "전력"}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      placeholder={`플레이어 ${index + 1}`}
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerChange(index, "name", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={player.mainLane}
                      onChange={(e) =>
                        handlePlayerChange(index, "mainLane", e.target.value)
                      }
                      style={selectStyle}
                    >
                      {lanes.map((lane) => (
                        <option key={lane} value={lane}>
                          {lane}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={player.subLane}
                      onChange={(e) =>
                        handlePlayerChange(index, "subLane", e.target.value)
                      }
                      style={selectStyle}
                    >
                      {lanes.map((lane) => (
                        <option key={lane} value={lane}>
                          {lane}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    {mode === "tier" ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <select
                          value={player.tier}
                          onChange={(e) =>
                            handlePlayerChange(index, "tier", e.target.value)
                          }
                          style={{ ...selectStyle, flex: 1 }}
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
                            style={{ ...selectStyle, width: "60px" }}
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
                        style={selectStyle}
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
              style={buttonStyle(false, loading)}
            >
              초기화
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={buttonStyle(true, loading)}
            >
              {loading ? "배정 중..." : "팀 자동 배정하기"}
            </button>
          </div>
        </main>

        {result && (
          <section
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "24px",
            }}
          >
            <h2 style={{ ...thStyle, textAlign: "left" }}>✅ 팀 배정 결과</h2>
            {/* 결과 표시 생략. 기존 코드 동일하게 유지 */}
          </section>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "center" as const,
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
};

const tdStyle = {
  padding: "8px",
  textAlign: "center" as const,
  fontSize: "14px",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  maxWidth: "160px",
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
};

const selectStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  background: "white",
};

const buttonStyle = (primary: boolean, loading = false) => ({
  padding: "10px 20px",
  border: primary ? "none" : "1px solid #d1d5db",
  borderRadius: "8px",
  background: primary ? (loading ? "#9ca3af" : "#3b82f6") : "white",
  color: primary ? "white" : "#374151",
  fontSize: "14px",
  fontWeight: "500",
  cursor: loading ? "not-allowed" : "pointer",
  opacity: loading ? 0.6 : 1,
});
