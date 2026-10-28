"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LiteracyTrendChartProps {
  data: { name: string; nilai: number }[];
}

export function LiteracyTrendChart({ data }: LiteracyTrendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6c727e" }}
            axisLine={{ stroke: "#e4e7ec" }}
            tickLine={false}
          />
          <YAxis
            domain={[40, 100]}
            tick={{ fontSize: 12, fill: "#6c727e" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              border: "1px solid #e4e7ec",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              fontSize: "12px",
            }}
            formatter={(value: any) => [`${value} Poin`, "Skor IKM"]}
            labelFormatter={(label) => `Tahun ${label}`}
          />
          <Line
            type="monotone"
            dataKey="nilai"
            stroke="#276749"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#276749", strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 6, fill: "#ea9a1e" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
