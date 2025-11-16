"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import {
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";
import { countryCodes, indonesianCities } from "@/lib/constant";
import { Button } from "@/components/button";
import { useJobApplications } from "@/queries/job";

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

interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface QueryParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  phoneFilter: string;
  genderFilter: string;
  domicileFilter: string;
  dateFilter: string;
}

interface Column {
  id: keyof Application;
  label: string;
  width: number;
  filterable?: boolean;
}

interface CountryCode {
  value: string;
  label: string;
  country: string;
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
    columnId?: keyof Application
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

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingColumn) return;
    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(100, startWidthRef.current + delta);
    setColumns((prev) =>
      prev.map((c) => (c.id === resizingColumn ? { ...c, width: newWidth } : c))
    );
  };

  const handleResizeEnd = () => setResizingColumn(null);

  useEffect(() => {
    if (!resizingColumn) return;
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [resizingColumn]);

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

  const FilterDropdown = ({ columnId }: { columnId: string }) => {
    if (activeFilter !== columnId) return null;

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
    }, []);

    return (
      <div
        ref={dropdownRef}
        className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]"
      >
        {columnId === "phone_number" && (
          <div className="p-2">
            <button
              onClick={() => {
                setPhoneFilter("all");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
          <div className="p-2 max-h-[300px] overflow-y-auto">
            <button
              onClick={() => {
                setDomicileFilter("all");
                setPage(1);
                setActiveFilter(null);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-4 px-6 max-w-container flex-1 flex flex-col">
      <div className="flex flex-1 flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <p className="text-xl-bold text-neutral-100">Candidate Management</p>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearAllFilters}
              size="medium"
              className="w-fit flex gap-x-2"
            >
              Clear {activeFilterCount} Filter{activeFilterCount > 1 ? "s" : ""}
              <XMarkIcon className="w-4 h-4" strokeWidth={2} />
            </Button>
          )}
        </div>

        {data && data.applications.length > 0 ? (
          <div className="w-full flex-1 flex flex-col rounded-lg border p-6 bg-neutral-10 border-neutral-40">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto flex-1 shadow-modal">
                  <table className="w-full">
                    <thead className="border-b border-neutral-30">
                      <tr className="bg-[#FCFCFC]">
                        <th className="pl-4 py-4 flex items-center w-fit">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="size-5 rounded-lg accent-primary-main border-primary-main text-primary-main cursor-pointer translate-y-[3px]"
                          />
                        </th>
                        {columns.map((column) => (
                          <th
                            key={column.id}
                            style={{ width: `${column.width}px` }}
                            className="relative select-none bg-[#FCFCFC]"
                            draggable
                            onDragStart={(e) => handleDragStart(e, column.id)}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex items-center gap-x-2 justify-between p-4 cursor-move">
                              <div className="flex items-center gap-x-2">
                                <span className="text-s-bold uppercase text-nowrap text-neutral-100">
                                  {column.label}
                                </span>
                                {column.id === "applied_at" && (
                                  <button
                                    onClick={toggleSort}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title={`Sort ${
                                      sortOrder === "asc"
                                        ? "descending"
                                        : "ascending"
                                    }`}
                                  >
                                    {sortOrder === "asc" ? (
                                      <BarsArrowUpIcon className="size-4 text-neutral-90" />
                                    ) : (
                                      <BarsArrowDownIcon className="size-4 text-neutral-90" />
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
                                          : column.id
                                      )
                                    }
                                    className={`p-1 rounded transition-colors ${
                                      (column.id === "phone_number" &&
                                        phoneFilter !== "all") ||
                                      (column.id === "gender" &&
                                        genderFilter !== "all") ||
                                      (column.id === "domicile" &&
                                        domicileFilter !== "all") ||
                                      (column.id === "applied_at" &&
                                        dateFilter !== "all")
                                        ? "bg-blue-100 text-primary-main"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <Bars3BottomLeftIcon className="size-4 text-neutral-90" />
                                  </button>
                                  <FilterDropdown columnId={column.id} />
                                </div>
                              )}

                              {/* resize handle */}
                              <div
                                onMouseDown={(e) =>
                                  handleResizeStart(e, column.id)
                                }
                                className="absolute right-0 top-0 bottom-0 w-1 h-full border-r border-neutral-30 cursor-col-resize hover:bg-primary-main transition-colors"
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
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="flex items-center justify-left p-4">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(app.id)}
                                onChange={(e) =>
                                  handleSelectRow(app.id, e.target.checked)
                                }
                                className="size-5 rounded-lg accent-primary-main border-primary-main text-primary-main cursor-pointer"
                              />
                            </td>
                            {columns.map((column) => (
                              <td
                                key={column.id}
                                className="p-4 text-m text-neutral-90 truncate text-nowrap"
                                style={{ width: `${column.width}px` }}
                              >
                                {formatValue(
                                  app[column.id] as string,
                                  column.id
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
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {(page - 1) * pageSize + 1} to{" "}
                      {Math.min(page * pageSize, data?.total || 0)} of{" "}
                      {data?.total || 0} candidates
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (pageNum) =>
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              Math.abs(pageNum - page) <= 1
                          )
                          .map((pageNum, idx, arr) => (
                            <div key={pageNum} className="flex items-center">
                              {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => setPage(pageNum)}
                                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
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
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="flex w-full h-full items-center justify-center flex-col flex-1 gap-y-6">
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
