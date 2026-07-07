// 원시 fetch·<img>·<a>에는 Next가 basePath를 자동 적용하지 않으므로 API 경로에 수동으로 붙인다.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const api = (path: string) => `${BASE_PATH}${path}`;
