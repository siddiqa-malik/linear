"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

interface RowItem {
  name: string;
  free: string | boolean;
  standard: string | boolean;
  plus: string | boolean;
}

interface CategoryGroup {
  category: string;
  rows: RowItem[];
}

export function PricingComparisonTable() {
  const [hoveredCol, setHoveredCol] = useState<"free" | "standard" | "plus" | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const activeCol = hoveredCol ?? "standard";

  const categories: CategoryGroup[] = [
    {
      category: "Usage",
      rows: [
        { name: "Members", free: "Unlimited", standard: "Unlimited", plus: "Unlimited" },
        { name: "File upload size", free: "10 MB", standard: "Unlimited", plus: "Unlimited" },
        { name: "File upload volume", free: "10 GB per month", standard: "Unlimited", plus: "Unlimited" },
        { name: "Issues (active and archived)", free: "250", standard: "Unlimited", plus: "Unlimited" },
      ],
    },
    {
      category: "Features",
      rows: [
        { name: "Issues, projects and cycles", free: true, standard: true, plus: true },
        { name: "Integrations", free: true, standard: true, plus: true },
        { name: "API and webhook access", free: true, standard: true, plus: true },
        { name: "Import and export", free: true, standard: true, plus: true },
        { name: "Linear Asana", free: false, standard: true, plus: true },
        { name: "Multi-account", free: false, standard: true, plus: true },
        { name: "SLAs", free: false, standard: false, plus: true },
      ],
    },
    {
      category: "Analytics & Reporting",
      rows: [
        { name: "Progress reports", free: true, standard: true, plus: true },
        { name: "Linear Insights", free: false, standard: false, plus: true },
        { name: "Data warehouse sync", free: false, standard: false, plus: true },
      ],
    },
    {
      category: "Security",
      rows: [
        { name: "SSO", free: "G Suite", standard: "G Suite", plus: "G Suite + SAML" },
        { name: "Admin tools", free: false, standard: true, plus: true },
        { name: "Advanced history", free: false, standard: true, plus: true },
        { name: "Advanced and custom workflows", free: false, standard: false, plus: true },
        { name: "Audit log", free: false, standard: false, plus: true },
        { name: "Third party app management", free: false, standard: false, plus: true },
        { name: "Domain claiming", free: false, standard: false, plus: true },
      ],
    },
    {
      category: "Support",
      rows: [
        { name: "Priority support", free: false, standard: false, plus: true },
      ],
    },
  ];

  const isLastRow = (catIdx: number, rowIdx: number) => {
    return catIdx === categories.length - 1 && rowIdx === categories[catIdx].rows.length - 1;
  };

  const getColClasses = (colKey: "free" | "standard" | "plus", isHeader = false, isLast = false) => {
    const isActive = activeCol === colKey;

    if (!isActive) {
      return "transition-all duration-200 border-x border-transparent";
    }

    let classes = "transition-all duration-200 bg-[#141733]/85 border-x border-white/[0.08]";
    if (isHeader) {
      classes += " rounded-t-2xl border-t border-white/[0.08] shadow-[0_0_35px_rgba(120,119,198,0.15)]";
    }
    if (isLast) {
      classes += " rounded-b-2xl border-b border-white/[0.08]";
    }
    return classes;
  };

  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-4 h-4 text-[#707dfb] inline-block" />
      ) : (
        <span className="text-[#3a3d52] font-mono text-[14px]">—</span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#d0d3de]">
        {val === "Unlimited" && <Check className="w-3.5 h-3.5 text-[#707dfb] shrink-0" />}
        {val.includes("G Suite") && <Check className="w-3.5 h-3.5 text-[#707dfb] shrink-0" />}
        <span>{val}</span>
      </span>
    );
  };

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto w-full">
      <div className="overflow-x-auto">
        <table
          onMouseLeave={() => {
            setHoveredCol(null);
            setHoveredRow(null);
          }}
          className="w-full text-left border-collapse min-w-[700px]"
        >
          {/* Header Row */}
          <thead>
            <tr>
              <th className="w-[34%] pb-8 pt-4"></th>

              {/* Free Header */}
              <th
                onMouseEnter={() => setHoveredCol("free")}
                className={`w-[22%] pb-8 pt-4 px-4 text-center cursor-pointer ${getColClasses(
                  "free",
                  true,
                  false
                )}`}
              >
                <div className="text-[16px] font-semibold text-white mb-3">Free</div>
                <Link href="/signup">
                  <button className="px-5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-[12px] font-medium transition-colors cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </th>

              {/* Standard Header */}
              <th
                onMouseEnter={() => setHoveredCol("standard")}
                className={`w-[22%] pb-8 pt-4 px-4 text-center cursor-pointer ${getColClasses(
                  "standard",
                  true,
                  false
                )}`}
              >
                <div className="text-[16px] font-semibold text-white mb-3">Standard</div>
                <Link href="/signup">
                  <button className="px-5 py-1.5 rounded-full bg-[#5e6ad2] hover:bg-[#6b77df] text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-[0_2px_12px_rgba(94,106,210,0.35)]">
                    Sign Up
                  </button>
                </Link>
              </th>

              {/* Plus Header */}
              <th
                onMouseEnter={() => setHoveredCol("plus")}
                className={`w-[22%] pb-8 pt-4 px-4 text-center cursor-pointer ${getColClasses(
                  "plus",
                  true,
                  false
                )}`}
              >
                <div className="text-[16px] font-semibold text-white mb-3">Plus</div>
                <Link href="/signup">
                  <button className="px-5 py-1.5 rounded-full bg-white hover:bg-[#ededf5] text-[#080915] text-[12px] font-semibold transition-colors cursor-pointer shadow-sm">
                    Sign Up
                  </button>
                </Link>
              </th>
            </tr>
          </thead>

          {/* Table Body by Categories */}
          <tbody>
            {categories.map((catGroup, cIdx) => (
              <React.Fragment key={cIdx}>
                {/* Category Header Row with column continuity and hover */}
                <tr
                  onMouseEnter={() => setHoveredRow(catGroup.category)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`transition-colors ${
                    hoveredRow === catGroup.category ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td
                    className={`pt-8 pb-3 pr-4 text-[14px] font-semibold tracking-wide transition-colors ${
                      hoveredRow === catGroup.category ? "text-white font-bold" : "text-white/90"
                    }`}
                  >
                    {catGroup.category}
                  </td>

                  {/* Free Column Category Spacer */}
                  <td
                    onMouseEnter={() => setHoveredCol("free")}
                    className={`pt-8 pb-3 px-4 text-center cursor-pointer ${getColClasses(
                      "free",
                      false,
                      false
                    )} ${
                      hoveredRow === catGroup.category && activeCol === "free"
                        ? "bg-[#1c214c]/95"
                        : ""
                    }`}
                  ></td>

                  {/* Standard Column Category Spacer */}
                  <td
                    onMouseEnter={() => setHoveredCol("standard")}
                    className={`pt-8 pb-3 px-4 text-center cursor-pointer ${getColClasses(
                      "standard",
                      false,
                      false
                    )} ${
                      hoveredRow === catGroup.category && activeCol === "standard"
                        ? "bg-[#1c214c]/95"
                        : ""
                    }`}
                  ></td>

                  {/* Plus Column Category Spacer */}
                  <td
                    onMouseEnter={() => setHoveredCol("plus")}
                    className={`pt-8 pb-3 px-4 text-center cursor-pointer ${getColClasses(
                      "plus",
                      false,
                      false
                    )} ${
                      hoveredRow === catGroup.category && activeCol === "plus"
                        ? "bg-[#1c214c]/95"
                        : ""
                    }`}
                  ></td>
                </tr>

                {/* Feature Rows */}
                {catGroup.rows.map((row, rIdx) => {
                  const isLast = isLastRow(cIdx, rIdx);
                  const isRowHovered = hoveredRow === row.name;

                  return (
                    <tr
                      key={rIdx}
                      onMouseEnter={() => setHoveredRow(row.name)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`border-b border-white/[0.04] transition-colors ${
                        isRowHovered ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      {/* Row Feature Name */}
                      <td
                        className={`py-3.5 pr-4 text-[13px] transition-colors font-normal ${
                          isRowHovered ? "text-white font-medium" : "text-[#8a8f98]"
                        }`}
                      >
                        {row.name}
                      </td>

                      {/* Free Value */}
                      <td
                        onMouseEnter={() => setHoveredCol("free")}
                        className={`py-3.5 px-4 text-center cursor-pointer ${getColClasses(
                          "free",
                          false,
                          isLast
                        )} ${isRowHovered && activeCol === "free" ? "bg-[#1c214c]/95" : ""}`}
                      >
                        {renderCell(row.free)}
                      </td>

                      {/* Standard Value */}
                      <td
                        onMouseEnter={() => setHoveredCol("standard")}
                        className={`py-3.5 px-4 text-center cursor-pointer ${getColClasses(
                          "standard",
                          false,
                          isLast
                        )} ${
                          isRowHovered && activeCol === "standard" ? "bg-[#1c214c]/95" : ""
                        }`}
                      >
                        {renderCell(row.standard)}
                      </td>

                      {/* Plus Value */}
                      <td
                        onMouseEnter={() => setHoveredCol("plus")}
                        className={`py-3.5 px-4 text-center cursor-pointer ${getColClasses(
                          "plus",
                          false,
                          isLast
                        )} ${isRowHovered && activeCol === "plus" ? "bg-[#1c214c]/95" : ""}`}
                      >
                        {renderCell(row.plus)}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
