"use client"

import type React from "react"

export type PlayerInput = {
  name: string
  mainLane: string
  subLane: string
  tier: string
  tierLevel?: string
  power?: number
}

type PlayerFormProps = {
  index: number
  value: PlayerInput
  onChange: (index: number, updated: PlayerInput) => void
  mode: "tier" | "power"
}

const lanes = ["상관없음", "탑", "정글", "미드", "원딜", "서포터"]
const tiers = ["아이언", "브론즈", "실버", "골드", "플래티넘", "다이아", "마스터", "그랜드마스터", "챌린저"]
const tierLevels = ["1", "2", "3", "4"]

const PlayerForm: React.FC<PlayerFormProps> = ({ index, value, onChange, mode }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: newValue } = e.target
    onChange(index, { ...value, [name]: name === "power" ? Number(newValue) : newValue })
  }

  const showTierLevel = mode === "tier" && !["마스터", "그랜드마스터", "챌린저"].includes(value.tier)

  return (
    <tr className="text-center align-middle">
      <td className="w-28 text-center">
        <input
          type="text"
          name="name"
          value={value.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-2 py-1 w-full text-sm text-center"
        />
      </td>

      <td className="w-3" />

      <td className="w-24 text-center">
        <select
          name="mainLane"
          value={value.mainLane}
          onChange={handleChange}
          required
          className="w-full text-sm px-1 py-1 border rounded text-center"
        >
          {lanes.map((lane) => (
            <option key={lane} value={lane}>
              {lane}
            </option>
          ))}
        </select>
      </td>

      <td className="w-24 text-center">
        <select
          name="subLane"
          value={value.subLane}
          onChange={handleChange}
          required
          className="w-full text-sm px-1 py-1 border rounded text-center"
        >
          {lanes.map((lane) => (
            <option key={lane} value={lane}>
              {lane}
            </option>
          ))}
        </select>
      </td>

      <td className="w-52 text-center">
        {mode === "tier" ? (
          <div className="flex gap-2 justify-center items-center">
            <select
              name="tier"
              value={value.tier}
              onChange={handleChange}
              className="w-32 text-sm px-1 py-1 border rounded text-center"
            >
              {tiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
            {showTierLevel && (
              <select
                name="tierLevel"
                value={value.tierLevel || "1"}
                onChange={handleChange}
                className="w-12 text-sm px-1 py-1 border rounded text-center"
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
            name="power"
            value={value.power ?? 5}
            onChange={handleChange}
            className="w-24 text-sm px-1 py-1 border rounded text-center"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
      </td>
    </tr>
  )
}

export default PlayerForm
