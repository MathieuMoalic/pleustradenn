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

/** ExerciseCategory */
export enum ExerciseCategory {
  Push = "push",
  Pull = "pull",
  Legs = "legs",
  Core = "core",
  Forearms = "forearms",
  Other = "other",
}

/** ExerciseCreate */
export interface ExerciseCreate {
  /** Name */
  name: string;
  /** Notes */
  notes: string;
  category: ExerciseCategory;
  /** Recommended Sets */
  recommended_sets: number;
  /** Recommended Reps Min */
  recommended_reps_min: number;
  /** Recommended Reps Max */
  recommended_reps_max: number;
  /** Recommended Rest Seconds */
  recommended_rest_seconds: number;
}

/** ExerciseRead */
export interface ExerciseRead {
  /** Name */
  name: string;
  /** Notes */
  notes: string;
  category: ExerciseCategory;
  /** Recommended Sets */
  recommended_sets: number;
  /** Recommended Reps Min */
  recommended_reps_min: number;
  /** Recommended Reps Max */
  recommended_reps_max: number;
  /** Recommended Rest Seconds */
  recommended_rest_seconds: number;
  /** Id */
  id: number;
}

/** ExerciseUpdate */
export interface ExerciseUpdate {
  /** Name */
  name?: string | null;
  /** Notes */
  notes?: string | null;
  category?: ExerciseCategory | null;
  /** Recommended Sets */
  recommended_sets?: number | null;
  /** Recommended Reps Min */
  recommended_reps_min?: number | null;
  /** Recommended Reps Max */
  recommended_reps_max?: number | null;
  /** Recommended Rest Seconds */
  recommended_rest_seconds?: number | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** SessionCreate */
export interface SessionCreate {
  /**
   * Date
   * @format date
   */
  date: string;
  /** Notes */
  notes: string;
}

/** SessionExerciseCreate */
export interface SessionExerciseCreate {
  /** Session Id */
  session_id: number;
  /** Exercise Id */
  exercise_id: number;
  /** Sets */
  sets: number;
  /** Reps */
  reps: number;
  /** Weight */
  weight: number;
  /** Rest Seconds */
  rest_seconds: number;
  /** Count */
  count: number;
  /** Completed */
  completed: boolean;
  /**
   * Created At
   * @format date
   */
  created_at: string;
}

/** SessionExerciseRead */
export interface SessionExerciseRead {
  /** Session Id */
  session_id: number;
  /** Exercise Id */
  exercise_id: number;
  /** Sets */
  sets: number;
  /** Reps */
  reps: number;
  /** Weight */
  weight: number;
  /** Rest Seconds */
  rest_seconds: number;
  /** Count */
  count: number;
  /** Completed */
  completed: boolean;
  /**
   * Created At
   * @format date
   */
  created_at: string;
  /** Id */
  id: number;
  /** Exercise Name */
  exercise_name: string;
}

/** SessionExerciseUpdate */
export interface SessionExerciseUpdate {
  /** Sets */
  sets?: number | null;
  /** Reps */
  reps?: number | null;
  /** Weight */
  weight?: number | null;
  /** Rest Seconds */
  rest_seconds?: number | null;
  /** Count */
  count?: number | null;
  /** Completed */
  completed?: boolean | null;
  /** Created At */
  created_at?: string | null;
}

/** SessionReadBasic */
export interface SessionReadBasic {
  /** Id */
  id: number;
  /**
   * Date
   * @format date
   */
  date: string;
  /** Notes */
  notes: string;
}

/** SessionReadDetailed */
export interface SessionReadDetailed {
  /**
   * Date
   * @format date
   */
  date: string;
  /** Notes */
  notes: string;
  /** Id */
  id: number;
  /**
   * Session Exercises
   * @default []
   */
  session_exercises?: SessionExerciseRead[];
}

/** SessionUpdate */
export interface SessionUpdate {
  /** Date */
  date?: string | null;
  /** Notes */
  notes?: string | null;
}

/** UserCreate */
export interface UserCreate {
  /** Username */
  username: string;
  /** Password */
  password: string;
}

/** UserRead */
export interface UserRead {
  /** Username */
  username: string;
  /** Id */
  id: number;
}

/** UserUpdate */
export interface UserUpdate {
  /** Username */
  username?: string | null;
  /** Password */
  password?: string | null;
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
  api = {
    /**
     * No description
     *
     * @tags exercises
     * @name ExerciseReadAll
     * @summary Read Exercises Endpoint
     * @request GET:/api/exercises
     * @secure
     */
    exerciseReadAll: (params: RequestParams = {}) =>
      this.request<ExerciseRead[], any>({
        path: `/api/exercises`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercises
     * @name ExerciseCreate
     * @summary Create Exercise Endpoint
     * @request POST:/api/exercises
     * @secure
     */
    exerciseCreate: (data: ExerciseCreate, params: RequestParams = {}) =>
      this.request<ExerciseRead, HTTPValidationError>({
        path: `/api/exercises`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercises
     * @name ExerciseRead
     * @summary Read Exercise Endpoint
     * @request GET:/api/exercises/{id}
     * @secure
     */
    exerciseRead: (id: number, params: RequestParams = {}) =>
      this.request<ExerciseRead, HTTPValidationError>({
        path: `/api/exercises/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercises
     * @name ExerciseUpdate
     * @summary Update Exercise Endpoint
     * @request PUT:/api/exercises/{id}
     * @secure
     */
    exerciseUpdate: (id: number, data: ExerciseUpdate, params: RequestParams = {}) =>
      this.request<ExerciseRead, HTTPValidationError>({
        path: `/api/exercises/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercises
     * @name ExerciseDelete
     * @summary Delete Exercise Endpoint
     * @request DELETE:/api/exercises/{id}
     * @secure
     */
    exerciseDelete: (id: number, params: RequestParams = {}) =>
      this.request<ExerciseRead, HTTPValidationError>({
        path: `/api/exercises/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserReadAll
     * @summary Read Users Endpoint
     * @request GET:/api/users
     * @secure
     */
    userReadAll: (params: RequestParams = {}) =>
      this.request<UserRead[], any>({
        path: `/api/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserCreate
     * @summary Create User Endpoint
     * @request POST:/api/users
     * @secure
     */
    userCreate: (data: UserCreate, params: RequestParams = {}) =>
      this.request<UserRead, HTTPValidationError>({
        path: `/api/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserRead
     * @summary Read User Endpoint
     * @request GET:/api/users/{id}
     * @secure
     */
    userRead: (id: number, params: RequestParams = {}) =>
      this.request<UserRead, HTTPValidationError>({
        path: `/api/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserUpdate
     * @summary Update User Endpoint
     * @request PUT:/api/users/{id}
     * @secure
     */
    userUpdate: (id: number, data: UserUpdate, params: RequestParams = {}) =>
      this.request<UserRead, HTTPValidationError>({
        path: `/api/users/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserDelete
     * @summary Delete User Endpoint
     * @request DELETE:/api/users/{id}
     * @secure
     */
    userDelete: (id: number, params: RequestParams = {}) =>
      this.request<UserRead, HTTPValidationError>({
        path: `/api/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sessions
     * @name SessionReadAll
     * @summary Read Sessions Endpoint
     * @request GET:/api/sessions
     * @secure
     */
    sessionReadAll: (params: RequestParams = {}) =>
      this.request<SessionReadBasic[], any>({
        path: `/api/sessions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sessions
     * @name SessionCreate
     * @summary Create Session Endpoint
     * @request POST:/api/sessions
     * @secure
     */
    sessionCreate: (data: SessionCreate, params: RequestParams = {}) =>
      this.request<SessionReadBasic, HTTPValidationError>({
        path: `/api/sessions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sessions
     * @name SessionClone
     * @summary Clone Session Endpoint
     * @request POST:/api/sessions/{id}
     * @secure
     */
    sessionClone: (id: number, params: RequestParams = {}) =>
      this.request<SessionReadBasic, HTTPValidationError>({
        path: `/api/sessions/${id}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sessions
     * @name SessionReadDetailed
     * @summary Read Session Endpoint
     * @request GET:/api/sessions/{id}
     * @secure
     */
    sessionReadDetailed: (id: number, params: RequestParams = {}) =>
      this.request<SessionReadDetailed, HTTPValidationError>({
        path: `/api/sessions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sessions
     * @name SessionUpdate
     * @summary Update Session Endpoint
     * @request PUT:/api/sessions/{id}
     * @secure
     */
    sessionUpdate: (id: number, data: SessionUpdate, params: RequestParams = {}) =>
      this.request<SessionReadBasic, HTTPValidationError>({
        path: `/api/sessions/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sessions
     * @name SessionDelete
     * @summary Delete Session Endpoint
     * @request DELETE:/api/sessions/{id}
     * @secure
     */
    sessionDelete: (id: number, params: RequestParams = {}) =>
      this.request<SessionReadBasic, HTTPValidationError>({
        path: `/api/sessions/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags session-exercises
     * @name SessionExerciseReadAll
     * @summary Read Session Exercises Endpoint
     * @request GET:/api/session-exercises
     * @secure
     */
    sessionExerciseReadAll: (params: RequestParams = {}) =>
      this.request<SessionExerciseRead[], any>({
        path: `/api/session-exercises`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags session-exercises
     * @name SessionExerciseCreate
     * @summary Create Session Exercise Endpoint
     * @request POST:/api/session-exercises
     * @secure
     */
    sessionExerciseCreate: (data: SessionExerciseCreate, params: RequestParams = {}) =>
      this.request<SessionExerciseRead, HTTPValidationError>({
        path: `/api/session-exercises`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags session-exercises
     * @name SessionExerciseReadDetailed
     * @summary Read Session Exercise Endpoint
     * @request GET:/api/session-exercises/{id}
     * @secure
     */
    sessionExerciseReadDetailed: (id: number, params: RequestParams = {}) =>
      this.request<SessionExerciseRead, HTTPValidationError>({
        path: `/api/session-exercises/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags session-exercises
     * @name SessionExerciseUpdate
     * @summary Update Session Exercise Endpoint
     * @request PUT:/api/session-exercises/{id}
     * @secure
     */
    sessionExerciseUpdate: (id: number, data: SessionExerciseUpdate, params: RequestParams = {}) =>
      this.request<SessionExerciseRead, HTTPValidationError>({
        path: `/api/session-exercises/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags session-exercises
     * @name SessionExerciseDelete
     * @summary Delete Session Exercise Endpoint
     * @request DELETE:/api/session-exercises/{id}
     * @secure
     */
    sessionExerciseDelete: (id: number, params: RequestParams = {}) =>
      this.request<SessionExerciseRead, HTTPValidationError>({
        path: `/api/session-exercises/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags session-exercises
     * @name SessionExerciseReadLatestByExercise
     * @summary Read Session Exercise By Exercise Endpoint
     * @request GET:/api/session-exercises/exercise/{exercise_id}
     * @secure
     */
    sessionExerciseReadLatestByExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<SessionExerciseRead | null, HTTPValidationError>({
        path: `/api/session-exercises/exercise/${exerciseId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
