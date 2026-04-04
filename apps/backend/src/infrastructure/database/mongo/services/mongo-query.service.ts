import { Model, Document, Types, SortOrder } from "mongoose";

export type FilterRequest = {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: string;
  from?: string;
  to?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type MongoQueryOptions = {
  searchableFields?: string[];
  dateField?: string;
  allowedSortFields?: string[] | null;
};

export const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildTextFilter = (q?: string, fields: string[] = []) => {
  if (!q || !q.trim() || fields.length === 0) return null;
  const regex = new RegExp(escapeRegex(q.trim()), "i");
  return { $or: fields.map((f) => ({ [f]: regex })) };
};

export const buildDateFilter = (
  from?: string,
  to?: string,
  field = "createdAt",
) => {
  const range: Record<string, any> = {};
  if (from) {
    const d = new Date(from);
    if (!isNaN(d.getTime())) range.$gte = d;
  }
  if (to) {
    const d = new Date(to);
    if (!isNaN(d.getTime())) range.$lte = d;
  }
  if (Object.keys(range).length === 0) return null;
  return { [field]: range };
};

export const parseSort = (
  sortField?: string,
  sortDirection?: string,
  allowedFields?: string[] | null,
): Record<string, SortOrder> => {
  const defaultField = "createdAt";
  const field = (sortField && String(sortField).trim()) || defaultField;
  const effectiveField =
    allowedFields && !allowedFields.includes(field) ? defaultField : field;
  const dir =
    String(sortDirection || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  return { [effectiveField]: dir as SortOrder };
};

export const getPager = (
  page?: number | string,
  pageSize?: number | string,
) => {
  const p = Math.max(1, Math.floor(Number(page) || 1));
  const s = Math.max(1, Math.floor(Number(pageSize) || 20));
  const skip = (p - 1) * s;
  return { page: p, pageSize: s, skip, limit: s };
};

export const mergeQueryParts = (parts: Record<string, any>[]) =>
  parts.length === 0 ? {} : parts.length === 1 ? parts[0] : { $and: parts };

export const createMongoQueryService = <T extends Document>(
  model: Model<T>,
) => {
  const search = async ({
    baseQuery,
    filterRequest = {},
    options = {},
  }: {
    baseQuery?: Record<string, any> | null;
    filterRequest: FilterRequest;
    options: MongoQueryOptions;
  }): Promise<PaginatedResult<T>> => {
    const {
      searchableFields = [],
      dateField = "createdAt",
      allowedSortFields = null,
    } = options;

    const { q, page, pageSize, sort, sortDirection, from, to } = filterRequest;

    const initialParts: Record<string, any>[] = baseQuery ? [baseQuery] : [];

    const textPart = buildTextFilter(q, searchableFields);
    const datePart = buildDateFilter(from, to, dateField);

    const parts: Record<string, any>[] = [
      ...initialParts,
      ...(textPart ? [textPart] : []),
      ...(datePart ? [datePart] : []),
    ];

    const finalQuery = mergeQueryParts(parts);

    const sortObj = parseSort(sort, sortDirection, allowedSortFields);

    const {
      page: pageNum,
      pageSize: size,
      skip,
      limit,
    } = getPager(page, pageSize);

    const [items, total] = await Promise.all([
      model.find(finalQuery).sort(sortObj).skip(skip).limit(limit).exec(),
      model.countDocuments(finalQuery).exec(),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      items,
      total,
      page: pageNum,
      pageSize: size,
      totalPages,
    };
  };

  return { search };
};

export function toObjectIdOrLeave(value?: string) {
  if (!value) return value;
  try {
    return new Types.ObjectId(value);
  } catch {
    return value;
  }
}
