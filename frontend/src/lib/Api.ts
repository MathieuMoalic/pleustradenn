/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_login_token_post */
export interface BodyLoginTokenPost {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /** Client Secret */
  client_secret?: string | null;
}

/**
 * CategoryCreate
 * Schema for creating a new Category.
 */
export interface CategoryCreate {
  /** Name */
  name: string;
}

/**
 * CategoryRead
 * Schema for reading a Category (response).
 */
export interface CategoryRead {
  /** Id */
  id: number;
  /** Name */
  name: string;
}

/**
 * CategoryUpdate
 * Schema for updating an existing Category.
 */
export interface CategoryUpdate {
  /** Name */
  name?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/**
 * ItemCreate
 * Schema for creating a new Item.
 */
export interface ItemCreate {
  /** Name */
  name: string;
  /** Category Id */
  category_id: number;
  /** Notes */
  notes?: string | null;
  /** Quantity */
  quantity?: number | null;
  /** Unit */
  unit?: string | null;
}

/**
 * ItemRead
 * Schema for reading an Item (response).
 */
export interface ItemRead {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Category Id */
  category_id: number;
  /** Is Active */
  is_active: boolean;
  /** Notes */
  notes: string | null;
  /** Quantity */
  quantity: number | null;
  /** Unit */
  unit: string | null;
}

/**
 * ItemUpdate
 * Schema for updating an existing Item.
 */
export interface ItemUpdate {
  /** Name */
  name?: string | null;
  /** Category Id */
  category_id?: number | null;
  /** Is Active */
  is_active?: boolean | null;
  /** Notes */
  notes?: string | null;
  /** Quantity */
  quantity?: number | null;
  /** Unit */
  unit?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Read all items.
     *
     * @tags items
     * @name ItemReadAll
     * @summary Read Items Endpoint
     * @request GET:/api/items
     * @secure
     */
    itemReadAll: (params: RequestParams = {}) =>
      this.request<ItemRead[], any>({
        path: `/api/items`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new item.
     *
     * @tags items
     * @name ItemCreate
     * @summary Create Item Endpoint
     * @request POST:/api/items
     * @secure
     */
    itemCreate: (data: ItemCreate, params: RequestParams = {}) =>
      this.request<ItemRead, HTTPValidationError>({
        path: `/api/items`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Read a single item by ID.
     *
     * @tags items
     * @name ItemRead
     * @summary Read Item Endpoint
     * @request GET:/api/items/{item_id}
     * @secure
     */
    itemRead: (itemId: number, params: RequestParams = {}) =>
      this.request<ItemRead, HTTPValidationError>({
        path: `/api/items/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing item by ID.
     *
     * @tags items
     * @name ItemUpdate
     * @summary Update Item Endpoint
     * @request PUT:/api/items/{item_id}
     * @secure
     */
    itemUpdate: (itemId: number, data: ItemUpdate, params: RequestParams = {}) =>
      this.request<ItemRead, HTTPValidationError>({
        path: `/api/items/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an item by ID.
     *
     * @tags items
     * @name ItemDelete
     * @summary Delete Item Endpoint
     * @request DELETE:/api/items/{item_id}
     * @secure
     */
    itemDelete: (itemId: number, params: RequestParams = {}) =>
      this.request<ItemRead, HTTPValidationError>({
        path: `/api/items/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Read all categories.
     *
     * @tags categories
     * @name CategoryreadAll
     * @summary Read Categories Endpoint
     * @request GET:/api/categories
     * @secure
     */
    categoryreadAll: (params: RequestParams = {}) =>
      this.request<CategoryRead[], any>({
        path: `/api/categories`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new category.
     *
     * @tags categories
     * @name CategoryCreate
     * @summary Create Category Endpoint
     * @request POST:/api/categories
     * @secure
     */
    categoryCreate: (data: CategoryCreate, params: RequestParams = {}) =>
      this.request<CategoryRead, HTTPValidationError>({
        path: `/api/categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing category by ID.
     *
     * @tags categories
     * @name CategoryUpdate
     * @summary Update Category Endpoint
     * @request PUT:/api/categories/{category_id}
     * @secure
     */
    categoryUpdate: (categoryId: number, data: CategoryUpdate, params: RequestParams = {}) =>
      this.request<CategoryRead, HTTPValidationError>({
        path: `/api/categories/${categoryId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an category by ID.
     *
     * @tags categories
     * @name CategoryDelete
     * @summary Delete Category Endpoint
     * @request DELETE:/api/categories/{category_id}
     * @secure
     */
    categoryDelete: (categoryId: number, params: RequestParams = {}) =>
      this.request<CategoryRead, HTTPValidationError>({
        path: `/api/categories/${categoryId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  token = {
    /**
     * No description
     *
     * @name LoginTokenPost
     * @summary Login
     * @request POST:/token
     */
    loginTokenPost: (data: BodyLoginTokenPost, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/token`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  };
}
