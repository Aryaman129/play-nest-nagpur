export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}