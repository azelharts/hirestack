"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/button";
import { countryCodes, indonesianCities } from "@/lib/constant";
import { useJobApplications } from "@/queries/job";
import {
  Bars3BottomLeftIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Types
interface Application {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female";
  linkedin_url: string;
  domicile: string;
  applied_at: string;
}

interface Column {
  id: keyof Application;
  label: string;
  width: number;
  filterable?: boolean;
}

const initialColumns: Column[] = [
  { id: "full_name", label: "Full Name", width: 200 },
  { id: "email", label: "Email Address", width: 250 },
  { id: "phone_number", label: "Phone Numbers", width: 150, filterable: true },
  { id: "gender", label: "Gender", width: 120, filterable: true },
  { id: "linkedin_url", label: "LinkedIn Link", width: 200 },
  { id: "domicile", label: "Domicile", width: 150, filterable: true },
  { id: "applied_at", label: "Applied Date", width: 180, filterable: true },
];

export default function CandidateManagement({ jobId }: { jobId: string }) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [draggingColumn, setDraggingColumn] = useState<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [phoneFilter, setPhoneFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [domicileFilter, setDomicileFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useJobApplications(jobId, {
    page,
    pageSize,
    sortBy: "applied_at",
    sortOrder,
    phoneFilter,
    genderFilter,
    domicileFilter,
    dateFilter,
  });

  const applications = data?.applications || [];
  const totalPages = data?.totalPages || 1;

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatValue = (
    value?: string,
    columnId?: keyof Application,
  ): React.ReactNode => {
    if (value) {
      if (columnId === "applied_at") return formatDate(value);
      if (columnId === "gender")
        return value.charAt(0).toUpperCase() + value.slice(1);
      if (columnId === "linkedin_url") {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-main hover:underline"
          >
            {value}
          </a>
        );
      }
      return value || "-";
    } else return "-";
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (phoneFilter !== "all") count++;
    if (genderFilter !== "all") count++;
    if (domicileFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    return count;
  };

  const clearAllFilters = () => {
    setPhoneFilter("all");
    setGenderFilter("all");
    setDomicileFilter("all");
    setDateFilter("all");
    setPage(1);
  };

  /* ----------  resize handlers ---------- */
  const handleResizeStart = (e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    setResizingColumn(colId);
    startXRef.current = e.clientX;
    startWidthRef.current = columns.find((c) => c.id === colId)!.width;
  };

  // FIX 1: Wrap handleResizeMove in useCallback to stabilize the dependency
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return;
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(100, startWidthRef.current + delta);
      setColumns((prev) =>
        prev.map((c) =>
          c.id === resizingColumn ? { ...c, width: newWidth } : c,
        ),
      );
    },
    [resizingColumn],
  );

  const handleResizeEnd = () => setResizingColumn(null);

  useEffect(() => {
    if (!resizingColumn) return;
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [resizingColumn, handleResizeMove]);

  /* ----------  reorder handlers ---------- */
  const handleDragStart = (e: React.DragEvent, colId: string) => {
    setDraggingColumn(colId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingColumn || draggingColumn === targetId) return;
    setColumns((prev) => {
      const dragIdx = prev.findIndex((c) => c.id === draggingColumn);
      const targetIdx = prev.findIndex((c) => c.id === targetId);
      if (dragIdx === targetIdx) return prev;
      const newCols = [...prev];
      const [dragged] = newCols.splice(dragIdx, 1);
      newCols.splice(targetIdx, 0, dragged);
      return newCols;
    });
  };

  const handleDragEnd = () => setDraggingColumn(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(applications.map((app) => app.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected =
    applications.length > 0 &&
    applications.every((app) => selectedIds.has(app.id));

  // FIX 2: Move hooks to the top level of the component (before the early return)
  const FilterDropdown = ({ columnId }: { columnId: string }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (activeFilter !== columnId) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setActiveFilter(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [activeFilter, columnId]);

    if (activeFilter !== columnId) return null;

    return (
      <div
        ref={dropdownRef}
        className="absolute top-full right-0 z-50 mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg"
      >
        {columnId === "phone_number" && (
          <div className="p-2">
            <button
              onClick={() => {
                setPhoneFilter("all");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                phoneFilter === "all"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              All Countries
            </button>
            {countryCodes.map((code) => (
              <button
                key={code.value}
                onClick={() => {
                  setPhoneFilter(code.value);
                  setPage(1);
                  setActiveFilter(null);
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  phoneFilter === code.value
                    ? "bg-primary-surface text-primary-main"
                    : ""
                }`}
              >
                {code.label}
              </button>
            ))}
          </div>
        )}

        {columnId === "gender" && (
          <div className="p-2">
            <button
              onClick={() => {
                setGenderFilter("all");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                genderFilter === "all"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              All Genders
            </button>
            <button
              onClick={() => {
                setGenderFilter("male");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                genderFilter === "male"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              Male
            </button>
            <button
              onClick={() => {
                setGenderFilter("female");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                genderFilter === "female"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              Female
            </button>
          </div>
        )}

        {columnId === "domicile" && (
          <div className="max-h-[300px] overflow-y-auto p-2">
            <button
              onClick={() => {
                setDomicileFilter("all");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                domicileFilter === "all"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              All Locations
            </button>
            {indonesianCities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setDomicileFilter(city);
                  setPage(1);
                  setActiveFilter(null);
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  domicileFilter === city
                    ? "bg-primary-surface text-primary-main"
                    : ""
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {columnId === "applied_at" && (
          <div className="p-2">
            <button
              onClick={() => {
                setDateFilter("all");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                dateFilter === "all"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => {
                setDateFilter("24h");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                dateFilter === "24h"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              Past 24 Hours
            </button>
            <button
              onClick={() => {
                setDateFilter("1w");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                dateFilter === "1w"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              Past 1 Week
            </button>
            <button
              onClick={() => {
                setDateFilter("1m");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                dateFilter === "1m"
                  ? "bg-primary-surface text-primary-main"
                  : ""
              }`}
            >
              Past 1 Month
            </button>
          </div>
        )}
      </div>
    );
  };

  const activeFilterCount = getActiveFilterCount();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-primary-main h-12 w-12 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div className="max-w-container flex flex-1 flex-col px-6 pt-20 pb-4">
      <div className="flex flex-1 flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xl-bold text-neutral-100">Candidate Management</p>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearAllFilters}
              size="medium"
              className="flex w-fit gap-x-2"
            >
              Clear {activeFilterCount} Filter{activeFilterCount > 1 ? "s" : ""}
              <XMarkIcon className="h-4 w-4" strokeWidth={2} />
            </Button>
          )}
        </div>

        {data && data.applications.length > 0 ? (
          <div className="bg-neutral-10 border-neutral-40 flex w-full flex-1 flex-col rounded-lg border p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="border-primary-main h-12 w-12 animate-spin rounded-full border-b-2" />
              </div>
            ) : (
              <>
                <div className="shadow-modal flex-1 overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-neutral-30 border-b">
                      <tr className="bg-[#FCFCFC]">
                        <th className="flex w-fit items-center py-4 pl-4">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="accent-primary-main border-primary-main text-primary-main size-5 translate-y-[3px] cursor-pointer rounded-lg"
                          />
                        </th>
                        {columns.map((column) => (
                          <th
                            key={column.id}
                            style={{ width: `${column.width}px` }}
                            className="relative bg-[#FCFCFC] select-none"
                            draggable
                            onDragStart={(e) => handleDragStart(e, column.id)}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex cursor-move items-center justify-between gap-x-2 p-4">
                              <div className="flex items-center gap-x-2">
                                <span className="text-s-bold text-nowrap text-neutral-100 uppercase">
                                  {column.label}
                                </span>
                                {column.id === "applied_at" && (
                                  <button
                                    onClick={toggleSort}
                                    className="rounded p-1 transition-colors hover:bg-gray-100"
                                    title={`Sort ${
                                      sortOrder === "asc"
                                        ? "descending"
                                        : "ascending"
                                    }`}
                                  >
                                    {sortOrder === "asc" ? (
                                      <BarsArrowUpIcon className="text-neutral-90 size-4" />
                                    ) : (
                                      <BarsArrowDownIcon className="text-neutral-90 size-4" />
                                    )}
                                  </button>
                                )}
                              </div>

                              {column.filterable && (
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setActiveFilter(
                                        activeFilter === column.id
                                          ? null
                                          : column.id,
                                      )
                                    }
                                    className={`rounded p-1 transition-colors ${
                                      (column.id === "phone_number" &&
                                        phoneFilter !== "all") ||
                                      (column.id === "gender" &&
                                        genderFilter !== "all") ||
                                      (column.id === "domicile" &&
                                        domicileFilter !== "all") ||
                                      (column.id === "applied_at" &&
                                        dateFilter !== "all")
                                        ? "text-primary-main bg-blue-100"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <Bars3BottomLeftIcon className="text-neutral-90 size-4" />
                                  </button>
                                  <FilterDropdown columnId={column.id} />
                                </div>
                              )}

                              {/* resize handle */}
                              <div
                                onMouseDown={(e) =>
                                  handleResizeStart(e, column.id)
                                }
                                className="border-neutral-30 hover:bg-primary-main absolute top-0 right-0 bottom-0 h-full w-1 cursor-col-resize border-r transition-colors"
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {applications.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length + 1}
                            className="px-4 py-12 text-center text-neutral-100"
                          >
                            No candidates found
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr
                            key={app.id}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="justify-left flex items-center p-4">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(app.id)}
                                onChange={(e) =>
                                  handleSelectRow(app.id, e.target.checked)
                                }
                                className="accent-primary-main border-primary-main text-primary-main size-5 cursor-pointer rounded-lg"
                              />
                            </td>
                            {columns.map((column) => (
                              <td
                                key={column.id}
                                className="text-m text-neutral-90 truncate p-4 text-nowrap"
                                style={{ width: `${column.width}px` }}
                              >
                                {formatValue(
                                  app[column.id] as string,
                                  column.id,
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {applications.length > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600">
                      Showing {(page - 1) * pageSize + 1} to{" "}
                      {Math.min(page * pageSize, data?.total || 0)} of{" "}
                      {data?.total || 0} candidates
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (pageNum) =>
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              Math.abs(pageNum - page) <= 1,
                          )
                          .map((pageNum, idx, arr) => (
                            <div key={pageNum} className="flex items-center">
                              {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => setPage(pageNum)}
                                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                                  page === pageNum
                                    ? "bg-primary-main text-white"
                                    : "border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            </div>
                          ))}
                      </div>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-6">
            <Image
              src="/assets/images/empty-applicants.svg"
              alt=""
              width={276}
              height={260}
            />
            <div className="flex flex-col items-center gap-y-1">
              <p className="text-l-bold">No candidates found</p>
              <span className="text-m text-neutral-70">
                Share your job vacancies so that more candidates will apply.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
