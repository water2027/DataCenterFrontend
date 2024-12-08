import { ref, type Ref, type UnwrapRef } from "vue";

const apiBaseUrl = import.meta.env.API_BASE_URL;

interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}

interface RequestResult<T> {
  data: Ref<UnwrapRef<T> | null>;
  isLoading: Ref<boolean>;
  err: Ref<string>;
}

function useRequest<T>(
  url: string,
  requestInit: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  tokenIsNeeded: boolean = true
): RequestResult<T> {
  const data = ref<UnwrapRef<T> | null>(null) as Ref<UnwrapRef<T> | null>;
  const isLoading = ref(true);
  const err = ref('');
  if (tokenIsNeeded) {
    // 可能从别的地方获取token
    const token = localStorage.getItem('token');
    const headers = new Headers(requestInit.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    requestInit.headers = headers;
  }
  try {
    fetch(apiBaseUrl + url, { ...requestInit })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((jsonData: ResponseData<T>)=>{
      // 可能需要根据实际情况修改
      if (jsonData.code >= 200 && jsonData.code < 300) {
        data.value = jsonData.data as UnwrapRef<T>;
        isLoading.value = false;
      } else {
        throw new Error(jsonData.message);
      }
    })
  } catch (e) {
    if (e instanceof Error) {
      isLoading.value = false;
      err.value = e.message;
    } else {
      isLoading.value = false;
      err.value = '未知错误';
    }
  }
  return { data, isLoading, err };
}

export { useRequest };
