import { useMutation, useQuery } from "@tanstack/react-query";
import type { User } from "firebase/auth";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Fragment, useState } from "react";
import { AppDialog } from "../../components/ui/AppDialog";
import type { AccomplishmentResourceData } from "../../contracts/accomplishmentResource";
import { useAuth } from "../../features/auth/useAuth";
import {
  getAccomplishmentResource,
  saveAccomplishmentResource,
} from "../../services/accomplishmentResource";

type NodeType = "section" | "group" | "indicator";
type TreeNode = {
  id: string;
  parentId: string | null;
  type: NodeType;
  title: string;
};
type EntryField = "target" | "q1" | "q2" | "q3" | "q4" | "total";
type DataRowType = "results" | "rawData";
type YearEntry = Record<EntryField, string>;
type IndicatorEntry = Record<DataRowType, YearEntry>;
type EntriesByYear = Record<number, Record<string, IndicatorEntry>>;
type EditorState = {
  mode: "add" | "edit";
  type: NodeType;
  parentId: string | null;
  nodeId?: string;
  value: string;
};

const resultFields = ["q1", "q2", "q3", "q4", "total"] as const;
const dataRows = [
  { id: "results", label: "Percentage" },
  { id: "rawData", label: "Raw Data" },
] as const;
const fieldClass =
  "min-h-9 w-full border border-strong-border bg-surface px-2 py-1 text-xs outline-none placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const actionClass =
  "inline-flex min-h-9 cursor-pointer items-center gap-1 px-2 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function emptyEntry(): YearEntry {
  return { target: "", q1: "", q2: "", q3: "", q4: "", total: "" };
}

function emptyIndicatorEntry(): IndicatorEntry {
  return { results: emptyEntry(), rawData: emptyEntry() };
}

function nodeName(type: NodeType) {
  if (type === "section") return "section";
  if (type === "group") return "group";
  return "indicator";
}

function childType(type: NodeType): NodeType | null {
  if (type === "section") return "group";
  if (type === "group") return "indicator";
  return null;
}

function NodeActions({
  node,
  onAdd,
  onEdit,
  onDelete,
}: {
  node: TreeNode;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <span className="flex shrink-0 items-center">
      {childType(node.type) ? (
        <button
          type="button"
          onClick={onAdd}
          className={actionClass + " text-primary"}
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add
        </button>
      ) : null}
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${node.title}`}
        className={actionClass + " text-primary"}
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${node.title}`}
        className={actionClass + " text-danger"}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    </span>
  );
}

export function AdminAccomplishResourcePage() {
  const { user } = useAuth();
  const resourceQuery = useQuery({
    queryKey: ["admin-accomplishment-resource"],
    queryFn: () => {
      if (!user) throw new Error("Please sign in to load this resource.");
      return getAccomplishmentResource(user);
    },
    enabled: Boolean(user),
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (!user || resourceQuery.isPending)
    return (
      <p className="mt-10 text-muted-foreground" role="status">
        Loading the accomplishment resource...
      </p>
    );
  if (resourceQuery.isError)
    return (
      <p
        className="mt-10 border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
        role="alert"
      >
        {resourceQuery.error instanceof Error
          ? resourceQuery.error.message
          : "The accomplishment resource could not be loaded."}
      </p>
    );

  return (
    <AccomplishmentResourceEditor
      user={user}
      initialData={resourceQuery.data}
    />
  );
}

function AccomplishmentResourceEditor({
  user,
  initialData,
}: {
  user: User;
  initialData: AccomplishmentResourceData;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, index) => currentYear - index);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [nodes, setNodes] = useState<TreeNode[]>(initialData.nodes);
  const [entries, setEntries] = useState<EntriesByYear>(initialData.entries);
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});
  const [chartType, setChartType] = useState(initialData.chartType);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TreeNode | null>(null);
  const saveMutation = useMutation({
    mutationFn: () => {
      return saveAccomplishmentResource(user, {
        version: 1,
        nodes,
        entries,
        chartType,
      });
    },
    onSuccess: () => setSaveStatus("saved"),
  });

  const childrenOf = (parentId: string | null) =>
    nodes.filter((node) => node.parentId === parentId);
  const isOpen = (id: string) => openNodes[id] ?? true;
  const startAdd = (type: NodeType, parentId: string | null) =>
    setEditor({ mode: "add", type, parentId, value: "" });
  const startEdit = (node: TreeNode) =>
    setEditor({
      mode: "edit",
      type: node.type,
      parentId: node.parentId,
      nodeId: node.id,
      value: node.title,
    });

  function saveEditor() {
    if (!editor?.value.trim()) return;
    if (editor.mode === "edit") {
      setNodes((items) =>
        items.map((item) =>
          item.id === editor.nodeId
            ? { ...item, title: editor.value.trim() }
            : item,
        ),
      );
    } else {
      const id = `${editor.type}-${Date.now()}`;
      setNodes((items) => [
        ...items,
        {
          id,
          parentId: editor.parentId,
          type: editor.type,
          title: editor.value.trim(),
        },
      ]);
      if (editor.parentId)
        setOpenNodes((items) => ({ ...items, [editor.parentId as string]: true }));
    }
    setSaveStatus("unsaved");
    setEditor(null);
  }

  function deleteNode(node: TreeNode) {
    const ids = new Set([node.id]);
    let foundChild = true;
    while (foundChild) {
      foundChild = false;
      nodes.forEach((item) => {
        if (item.parentId && ids.has(item.parentId) && !ids.has(item.id)) {
          ids.add(item.id);
          foundChild = true;
        }
      });
    }
    setNodes((items) => items.filter((item) => !ids.has(item.id)));
    setEntries((allEntries) => {
      const nextEntries: EntriesByYear = {};
      Object.entries(allEntries).forEach(([year, yearEntries]) => {
        nextEntries[Number(year)] = Object.fromEntries(
          Object.entries(yearEntries).filter(
            ([indicatorId]) => !ids.has(indicatorId),
          ),
        );
      });
      return nextEntries;
    });
    setSaveStatus("unsaved");
    setPendingDelete(null);
  }

  function updateEntry(
    id: string,
    rowType: DataRowType,
    field: EntryField,
    value: string,
  ) {
    setEntries((allEntries) => ({
      ...allEntries,
      [selectedYear]: {
        ...allEntries[selectedYear],
        [id]: {
          ...(allEntries[selectedYear]?.[id] ?? emptyIndicatorEntry()),
          [rowType]: {
            ...(allEntries[selectedYear]?.[id]?.[rowType] ?? emptyEntry()),
            [field]: value,
          },
        },
      },
    }));
    setSaveStatus("unsaved");
  }

  const renderActions = (node: TreeNode) => (
    <NodeActions
      node={node}
      onAdd={() => {
        const type = childType(node.type);
        if (type) startAdd(type, node.id);
      }}
      onEdit={() => startEdit(node)}
      onDelete={() => setPendingDelete(node)}
    />
  );

  return (
    <section className="mt-5" aria-labelledby="accomplishment-title">
      <p className="text-xs font-bold tracking-[0.14em] text-primary">
        ADMIN WORKSPACE
      </p>
      <div className="mt-2 flex flex-col gap-5 border-b border-strong-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            id="accomplishment-title"
            className="font-serif text-3xl tracking-tight sm:text-4xl"
          >
            Accomplishments
          </h1>
          <p className="mt-3 text-muted-foreground">
            Set targets and quarterly results.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="sm:w-44">
            <span className="block text-sm font-semibold">Year</span>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="mt-2 min-h-12 w-full cursor-pointer border border-strong-border bg-surface px-4"
            >
              {years.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => startAdd("section", null)}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add section
          </button>
          <button
            type="button"
            disabled={
              saveMutation.isPending || saveStatus === "saved"
            }
            onClick={() => saveMutation.mutate()}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden="true" />
            {saveMutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div
        className="mt-5 flex items-center gap-2 border-l-2 border-primary bg-primary-soft px-4 py-3 text-sm text-primary"
        aria-live="polite"
      >
        {saveStatus === "saved" ? (
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
        ) : null}
        <span>
          {saveStatus === "unsaved"
            ? "Unsaved changes."
            : "Saved."}
        </span>
      </div>
      {saveMutation.isError ? (
        <p
          className="mt-3 border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {saveMutation.error instanceof Error
            ? saveMutation.error.message
            : "The worksheet could not be saved."}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_10px_28px_rgba(20,83,45,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[64rem] table-fixed border-collapse text-left">
            <thead className="bg-surface-secondary text-sm">
              <tr className="border-b border-strong-border">
                <th rowSpan={2} className="w-[36%] px-5 py-4">
                  Performance area
                </th>
                <th
                  rowSpan={2}
                  className="w-[9%] border-l border-strong-border px-4 py-4"
                >
                  Data type
                </th>
                <th
                  rowSpan={2}
                  className="w-[10%] border-l border-strong-border px-4 py-4"
                >
                  Target
                </th>
                <th
                  colSpan={5}
                  className="border-l border-strong-border px-5 py-3 text-center"
                >
                  Accomplishment
                </th>
              </tr>
              <tr className="border-b border-strong-border">
                {["Q1", "Q2", "Q3", "Q4", "Total"].map((label) => (
                  <th
                    key={label}
                    className="w-[9%] border-l border-border px-3 py-3 text-center text-xs uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {childrenOf(null).map((section) => (
                <Fragment key={section.id}>
                  <tr className="border-b border-border">
                    <th className="px-5 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          aria-expanded={isOpen(section.id)}
                          onClick={() =>
                            setOpenNodes((items) => ({
                              ...items,
                              [section.id]: !isOpen(section.id),
                            }))
                          }
                          className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 text-left font-semibold"
                        >
                          {isOpen(section.id) ? (
                            <ChevronDown className="size-4 text-primary" />
                          ) : (
                            <ChevronRight className="size-4 text-primary" />
                          )}
                          <span className="whitespace-normal break-words">
                            {section.title}
                          </span>
                        </button>
                        {renderActions(section)}
                      </div>
                    </th>
                    <td colSpan={7} />
                  </tr>
                  {isOpen(section.id)
                    ? childrenOf(section.id).map((group) => (
                        <Fragment key={group.id}>
                          <tr className="border-b border-border">
                            <th className="py-2 pl-12 pr-5">
                              <div className="flex items-center justify-between gap-3">
                                <button
                                  type="button"
                                  aria-expanded={isOpen(group.id)}
                                  onClick={() =>
                                    setOpenNodes((items) => ({
                                      ...items,
                                      [group.id]: !isOpen(group.id),
                                    }))
                                  }
                                  className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 text-left font-medium"
                                >
                                  {isOpen(group.id) ? (
                                    <ChevronDown className="size-4 text-primary" />
                                  ) : (
                                    <ChevronRight className="size-4 text-primary" />
                                  )}
                                  <span className="whitespace-normal break-words">
                                    {group.title}
                                  </span>
                                </button>
                                {renderActions(group)}
                              </div>
                            </th>
                            <td colSpan={7} />
                          </tr>
                          {isOpen(group.id)
                            ? childrenOf(group.id).map((indicator) => {
                                const indicatorEntry =
                                  entries[selectedYear]?.[indicator.id] ??
                                  emptyIndicatorEntry();
                                return (
                                  <Fragment key={indicator.id}>
                                    {dataRows.map((dataRow, rowIndex) => {
                                      const entry =
                                        indicatorEntry[dataRow.id];
                                      return (
                                        <tr
                                          key={dataRow.id}
                                          className={
                                            rowIndex === 0
                                              ? "border-b border-border"
                                              : ""
                                          }
                                        >
                                          {rowIndex === 0 ? (
                                            <th
                                              rowSpan={2}
                                              className="py-4 pl-20 pr-5 text-sm font-medium"
                                            >
                                              <div className="flex items-center justify-between gap-3">
                                                <span className="whitespace-normal break-words">
                                                  {indicator.title}
                                                </span>
                                                {renderActions(indicator)}
                                              </div>
                                            </th>
                                          ) : null}
                                          <th className="border-l border-strong-border px-4 py-3 text-sm font-medium">
                                            {dataRow.label}
                                          </th>
                                          <td className="border-l border-strong-border p-3">
                                            <input
                                              aria-label={`${dataRow.label} target for ${indicator.title}`}
                                              value={entry.target}
                                              onChange={(event) =>
                                                updateEntry(
                                                  indicator.id,
                                                  dataRow.id,
                                                  "target",
                                                  event.target.value,
                                                )
                                              }
                                              placeholder="Enter"
                                              className={fieldClass}
                                            />
                                          </td>
                                          {resultFields.map((field) => (
                                            <td
                                              key={field}
                                              className="border-l border-border p-3"
                                            >
                                              <input
                                                aria-label={`${dataRow.label} ${field} accomplishment for ${indicator.title}`}
                                                value={entry[field]}
                                                onChange={(event) =>
                                                  updateEntry(
                                                    indicator.id,
                                                    dataRow.id,
                                                    field,
                                                    event.target.value,
                                                  )
                                                }
                                                placeholder="Enter"
                                                className={
                                                  fieldClass + " text-center"
                                                }
                                              />
                                            </td>
                                          ))}
                                        </tr>
                                      );
                                    })}
                                  </Fragment>
                                );
                              })
                            : null}
                        </Fragment>
                      ))
                    : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {nodes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No sections. Add one to begin.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-strong-border bg-surface-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            Targets and accomplishments use manual input.
          </span>
          <label className="flex items-center gap-2">
            <span className="text-sm font-semibold">Chart</span>
            <select
              value={chartType}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "column" || value === "line" || value === "bar")
                  setChartType(value);
                setSaveStatus("unsaved");
              }}
              className="min-h-11 border border-strong-border bg-surface px-3 text-sm"
            >
              <option value="column">Column chart</option>
              <option value="line">Line chart</option>
              <option value="bar">Bar chart</option>
            </select>
          </label>
        </div>
      </div>

      {editor ? (
        <AppDialog
          title={`${editor.mode === "add" ? "Add" : "Edit"} ${nodeName(editor.type)}`}
          description="Enter a clear name."
          onClose={() => setEditor(null)}
        >
          <form
            className="p-5 sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();
              saveEditor();
            }}
          >
            <label className="text-sm font-semibold">
              Name
              <input
                autoFocus
                required
                minLength={2}
                maxLength={120}
                value={editor.value}
                onChange={(event) =>
                  setEditor({ ...editor, value: event.target.value })
                }
                className="mt-2 min-h-12 w-full border border-strong-border px-4"
              />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="min-h-11 cursor-pointer border border-strong-border px-5 font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={editor.value.trim().length < 2}
                className="min-h-11 cursor-pointer bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {editor.mode === "add" ? "Add" : "Save changes"}
              </button>
            </div>
          </form>
        </AppDialog>
      ) : null}

      {pendingDelete ? (
        <AppDialog
          title={`Delete ${nodeName(pendingDelete.type)}`}
          description={`Delete "${pendingDelete.title}" from this draft?`}
          onClose={() => setPendingDelete(null)}
        >
          <div className="p-5 sm:p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              Nested items will also be deleted.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="min-h-11 cursor-pointer border border-strong-border px-5 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteNode(pendingDelete)}
                className="min-h-11 cursor-pointer bg-danger px-5 font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </AppDialog>
      ) : null}
    </section>
  );
}
