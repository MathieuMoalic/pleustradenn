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

/** ExerciseCreate */
export interface ExerciseCreate {
  /** Name */
  name: string;
  /** Description */
  description?: string | null;
  /** Category */
  category?: string | null;
  /** Muscle Group */
  muscle_group?: string | null;
  /** Equipment */
  equipment?: string | null;
}

/** ExerciseRead */
export interface ExerciseRead {
  /** Name */
  name: string;
  /** Description */
  description?: string | null;
  /** Category */
  category?: string | null;
  /** Muscle Group */
  muscle_group?: string | null;
  /** Equipment */
  equipment?: string | null;
  /** Id */
  id: number;
}

/** ExerciseUpdate */
export interface ExerciseUpdate {
  /** Name */
  name?: string | null;
  /** Description */
  description?: string | null;
  /** Category */
  category?: string | null;
  /** Muscle Group */
  muscle_group?: string | null;
  /** Equipment */
  equipment?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
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

/** WorkoutCreate */
export interface WorkoutCreate {
  /** User Id */
  user_id: number;
  /** Date */
  date?: string | null;
  /** Notes */
  notes?: string | null;
}

/** WorkoutExerciseCreate */
export interface WorkoutExerciseCreate {
  /** Workout Id */
  workout_id: number;
  /** Exercise Id */
  exercise_id: number;
  /** Sets */
  sets?: number | null;
  /** Reps */
  reps?: number | null;
  /** Weight */
  weight?: number | null;
  /** Rest Time */
  rest_time?: number | null;
}

/** WorkoutExerciseRead */
export interface WorkoutExerciseRead {
  /** Workout Id */
  workout_id: number;
  /** Exercise Id */
  exercise_id: number;
  /** Sets */
  sets?: number | null;
  /** Reps */
  reps?: number | null;
  /** Weight */
  weight?: number | null;
  /** Rest Time */
  rest_time?: number | null;
  /** Id */
  id: number;
}

/** WorkoutExerciseUpdate */
export interface WorkoutExerciseUpdate {
  /** Workout Id */
  workout_id?: number | null;
  /** Exercise Id */
  exercise_id?: number | null;
  /** Sets */
  sets?: number | null;
  /** Reps */
  reps?: number | null;
  /** Weight */
  weight?: number | null;
  /** Rest Time */
  rest_time?: number | null;
}

/** WorkoutRead */
export interface WorkoutRead {
  /** User Id */
  user_id: number;
  /** Date */
  date?: string | null;
  /** Notes */
  notes?: string | null;
  /** Id */
  id: number;
}

/** WorkoutUpdate */
export interface WorkoutUpdate {
  /** User Id */
  user_id?: number | null;
  /** Date */
  date?: string | null;
  /** Notes */
  notes?: string | null;
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
     * @description Read all exercises.
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
     * @description Create a new exercise.
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
     * @description Update an existing exercise by ID.
     *
     * @tags exercises
     * @name ExerciseUpdate
     * @summary Update Exercise Endpoint
     * @request PUT:/api/exercises/{exercise_id}
     * @secure
     */
    exerciseUpdate: (exerciseId: number, data: ExerciseUpdate, params: RequestParams = {}) =>
      this.request<ExerciseRead, HTTPValidationError>({
        path: `/api/exercises/${exerciseId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an exercise by ID.
     *
     * @tags exercises
     * @name ExerciseDelete
     * @summary Delete Exercise Endpoint
     * @request DELETE:/api/exercises/{exercise_id}
     * @secure
     */
    exerciseDelete: (exerciseId: number, params: RequestParams = {}) =>
      this.request<ExerciseRead, HTTPValidationError>({
        path: `/api/exercises/${exerciseId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Read all users.
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
     * @description Create a new user.
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
     * @description Update an existing user by ID.
     *
     * @tags users
     * @name UserUpdate
     * @summary Update User Endpoint
     * @request PUT:/api/users/{user_id}
     * @secure
     */
    userUpdate: (userId: number, data: UserUpdate, params: RequestParams = {}) =>
      this.request<UserRead, HTTPValidationError>({
        path: `/api/users/${userId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a user by ID.
     *
     * @tags users
     * @name UserDelete
     * @summary Delete User Endpoint
     * @request DELETE:/api/users/{user_id}
     * @secure
     */
    userDelete: (userId: number, params: RequestParams = {}) =>
      this.request<UserRead, HTTPValidationError>({
        path: `/api/users/${userId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Read all workouts.
     *
     * @tags workouts
     * @name WorkoutReadAll
     * @summary Read Workouts Endpoint
     * @request GET:/api/workouts
     * @secure
     */
    workoutReadAll: (params: RequestParams = {}) =>
      this.request<WorkoutRead[], any>({
        path: `/api/workouts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new workout.
     *
     * @tags workouts
     * @name WorkoutCreate
     * @summary Create Workout Endpoint
     * @request POST:/api/workouts
     * @secure
     */
    workoutCreate: (data: WorkoutCreate, params: RequestParams = {}) =>
      this.request<WorkoutRead, HTTPValidationError>({
        path: `/api/workouts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Read one workout.
     *
     * @tags workouts
     * @name WorkoutRead
     * @summary Read Workout Endpoint
     * @request GET:/api/workouts/{workout_id}
     * @secure
     */
    workoutRead: (workoutId: number, params: RequestParams = {}) =>
      this.request<WorkoutRead, HTTPValidationError>({
        path: `/api/workouts/${workoutId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing workout by ID.
     *
     * @tags workouts
     * @name WorkoutUpdate
     * @summary Update Workout Endpoint
     * @request PUT:/api/workouts/{workout_id}
     * @secure
     */
    workoutUpdate: (workoutId: number, data: WorkoutUpdate, params: RequestParams = {}) =>
      this.request<WorkoutRead, HTTPValidationError>({
        path: `/api/workouts/${workoutId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a workout by ID.
     *
     * @tags workouts
     * @name WorkoutDelete
     * @summary Delete Workout Endpoint
     * @request DELETE:/api/workouts/{workout_id}
     * @secure
     */
    workoutDelete: (workoutId: number, params: RequestParams = {}) =>
      this.request<WorkoutRead, HTTPValidationError>({
        path: `/api/workouts/${workoutId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Read all workout exercises.
     *
     * @tags workout-exercises
     * @name WorkoutExerciseReadAll
     * @summary Read Workout Exercises Endpoint
     * @request GET:/api/workout-exercises
     * @secure
     */
    workoutExerciseReadAll: (params: RequestParams = {}) =>
      this.request<WorkoutExerciseRead[], any>({
        path: `/api/workout-exercises`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new workout exercise.
     *
     * @tags workout-exercises
     * @name WorkoutExerciseCreate
     * @summary Create Workout Exercise Endpoint
     * @request POST:/api/workout-exercises
     * @secure
     */
    workoutExerciseCreate: (data: WorkoutExerciseCreate, params: RequestParams = {}) =>
      this.request<WorkoutExerciseRead, HTTPValidationError>({
        path: `/api/workout-exercises`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing workout exercise by ID.
     *
     * @tags workout-exercises
     * @name WorkoutExerciseUpdate
     * @summary Update Workout Exercise Endpoint
     * @request PUT:/api/workout-exercises/{workout_exercise_id}
     * @secure
     */
    workoutExerciseUpdate: (workoutExerciseId: number, data: WorkoutExerciseUpdate, params: RequestParams = {}) =>
      this.request<WorkoutExerciseRead, HTTPValidationError>({
        path: `/api/workout-exercises/${workoutExerciseId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a workout exercise by ID.
     *
     * @tags workout-exercises
     * @name WorkoutExerciseDelete
     * @summary Delete Workout Exercise Endpoint
     * @request DELETE:/api/workout-exercises/{workout_exercise_id}
     * @secure
     */
    workoutExerciseDelete: (workoutExerciseId: number, params: RequestParams = {}) =>
      this.request<WorkoutExerciseRead, HTTPValidationError>({
        path: `/api/workout-exercises/${workoutExerciseId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
