import { FilterCondition, PaginatedResult, PaginationQuery, QueryOptions } from '../types/common.types.js';
import { NotFoundError } from '../errors/app.error.js';

export interface BaseEntity {
  id: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export class MemoryDatabase {
  private static instance: MemoryDatabase;
  private tables: Map<string, Map<string, any>> = new Map();

  private constructor() {}

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }
    return MemoryDatabase.instance;
  }

  private getTable(tableName: string): Map<string, any> {
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, new Map());
    }
    return this.tables.get(tableName)!;
  }

  public insert<T extends BaseEntity>(tableName: string, entity: T): T {
    const table = this.getTable(tableName);
    const now = new Date().toISOString();
    const item: T = {
      ...entity,
      createdAt: entity.createdAt || now,
      updatedAt: now,
      isDeleted: false
    };
    table.set(item.id, item);
    return { ...item };
  }

  public findById<T extends BaseEntity>(tableName: string, id: string): T | null {
    const table = this.getTable(tableName);
    const item = table.get(id);
    if (!item || item.isDeleted) return null;
    return { ...item };
  }

  public update<T extends BaseEntity>(tableName: string, id: string, patch: Partial<T>): T {
    const existing = this.findById<T>(tableName, id);
    if (!existing) {
      throw new NotFoundError(tableName, id);
    }
    const updated: T = {
      ...existing,
      ...patch,
      id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    this.getTable(tableName).set(id, updated);
    return { ...updated };
  }

  public delete(tableName: string, id: string, soft: boolean = true): boolean {
    const table = this.getTable(tableName);
    const item = table.get(id);
    if (!item) return false;

    if (soft) {
      item.isDeleted = true;
      item.updatedAt = new Date().toISOString();
      table.set(id, item);
    } else {
      table.delete(id);
    }
    return true;
  }

  private applyFilters<T>(items: T[], filters: FilterCondition[]): T[] {
    return items.filter((item: any) => {
      return filters.every((filter) => {
        const val = item[filter.field];
        switch (filter.operator) {
          case 'eq':
            return val === filter.value;
          case 'ne':
            return val !== filter.value;
          case 'gt':
            return val > filter.value;
          case 'gte':
            return val >= filter.value;
          case 'lt':
            return val < filter.value;
          case 'lte':
            return val <= filter.value;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(val);
          case 'contains':
            return typeof val === 'string' && val.toLowerCase().includes(String(filter.value).toLowerCase());
          case 'startsWith':
            return typeof val === 'string' && val.toLowerCase().startsWith(String(filter.value).toLowerCase());
          default:
            return true;
        }
      });
    });
  }

  public query<T extends BaseEntity>(tableName: string, options: QueryOptions = {}): PaginatedResult<T> {
    const table = this.getTable(tableName);
    let items: T[] = Array.from(table.values());

    if (!options.includeDeleted) {
      items = items.filter((i) => !i.isDeleted);
    }

    if (options.tenantId) {
      items = items.filter((i) => i.tenantId === options.tenantId);
    }

    if (options.filters && options.filters.length > 0) {
      items = this.applyFilters(items, options.filters);
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search } = options.pagination || {};

    if (search) {
      items = items.filter((i: any) =>
        Object.values(i).some((val) => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Sorting
    items.sort((a: any, b: any) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  public clear(tableName?: string): void {
    if (tableName) {
      this.tables.delete(tableName);
    } else {
      this.tables.clear();
    }
  }
}
