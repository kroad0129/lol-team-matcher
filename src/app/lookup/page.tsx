"use client";

import { useState } from "react";

type SummonerInfo = {
  name: string;
  tag: string;
  soloTier?: string;
  soloRank?: string;
  soloWinRate?: string;
  flexTier?: string;
  flexRank?: string;
  flexWinRate?: string;
  veteran?: boolean;
  hotStreak?: boolean;
  error?: string;
};

export default function TenSummonerPage() {
  const initialSummoners: SummonerInfo[] = Array.from({ length: 10 }, () => ({
    name: "",
    tag: "",
  }));

  const [summoners, setSummoners] = useState(initialSummoners);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    index: number,
    field: keyof SummonerInfo,
    value: string
  ) => {
    const newSummoners = [...summoners];
    newSummoners[index][field] = value;
    setSummoners(newSummoners);
  };

  const handleSearch = async () => {
    setLoading(true);
    const results = await Promise.all(
      summoners.map(async (s) => {
        if (!s.name || !s.tag) {
          return { ...s, error: "닉네임과 태그를 입력해주세요." };
        }
        try {
          const res = await fetch(
            `/api/riot/account?gameName=${encodeURIComponent(
              s.name
            )}&tagLine=${encodeURIComponent(s.tag)}`
          );
          const data = await res.json();
          if (res.ok) {
            return {
              ...s,
              soloTier: data.soloRank?.tier || "언랭크",
              soloRank: data.soloRank?.rank || "-",
              soloWinRate: data.soloRank?.winRate || "-",
              flexTier: data.flexRank?.tier || "언랭크",
              flexRank: data.flexRank?.rank || "-",
              flexWinRate: data.flexRank?.winRate || "-",
              veteran: data.soloRank?.veteran || false,
              hotStreak: data.soloRank?.hotStreak || false,
            };
          } else {
            return { ...s, error: data.error.status?.message || data.error };
          }
        } catch (err) {
          return { ...s, error: "API 호출 실패" };
        }
      })
    );
    setSummoners(results);
    setLoading(false);
  };

  const resetForm = () => {
    setSummoners(initialSummoners);
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
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          소환사 10명 정보 조회
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>닉네임</th>
              <th style={thStyle}>태그</th>
              <th style={thStyle}>솔로 티어</th>
              <th style={thStyle}>솔로 랭크</th>
              <th style={thStyle}>솔로 승률</th>
              <th style={thStyle}>자유 티어</th>
              <th style={thStyle}>자유 랭크</th>
              <th style={thStyle}>자유 승률</th>
              <th style={thStyle}>유지중</th>
              <th style={thStyle}>연승중</th>
              <th style={thStyle}>오류</th>
            </tr>
          </thead>
          <tbody>
            {summoners.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                    placeholder="닉네임"
                    style={{ ...inputStyle, maxWidth: "120px" }}
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={s.tag}
                    onChange={(e) => handleChange(i, "tag", e.target.value)}
                    placeholder="태그"
                    style={{ ...inputStyle, maxWidth: "80px" }}
                  />
                </td>
                <td style={tdStyle}>{s.soloTier}</td>
                <td style={tdStyle}>{s.soloRank}</td>
                <td style={tdStyle}>{s.soloWinRate}%</td>
                <td style={tdStyle}>{s.flexTier}</td>
                <td style={tdStyle}>{s.flexRank}</td>
                <td style={tdStyle}>{s.flexWinRate}%</td>
                <td style={tdStyle}>{s.veteran ? "✅ 유지중" : "❌"}</td>
                <td style={tdStyle}>{s.hotStreak ? "🔥 연승중" : "❌"}</td>
                <td style={{ ...tdStyle, color: "red" }}>{s.error || "-"}</td>
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
            style={buttonStyle(false)}
          >
            초기화
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            style={buttonStyle(true, loading)}
          >
            {loading ? "조회 중..." : "전체 조회"}
          </button>
        </div>
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
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
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
