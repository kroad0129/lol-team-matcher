"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        리그오브레전드 내전 관리 시스템
      </h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/lookup">
          <div
            style={{
              padding: "20px 40px",
              background: "#3b82f6",
              color: "white",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "18px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            🔍 소환사 정보 조회
          </div>
        </Link>

        <Link href="/matching">
          <div
            style={{
              padding: "20px 40px",
              background: "#22c55e",
              color: "white",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "18px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            ⚔️ 팀 밸런스 매칭
          </div>
        </Link>
      </div>

      <p
        style={{
          marginTop: "40px",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        Created by T!b3tF0x (김태희)
      </p>
    </div>
  );
}
