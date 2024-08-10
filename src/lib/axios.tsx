import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
    withCredentials: true,
});

// 요청 인터셉터를 사용하여 모든 요청에 JWT를 포함
apiClient.interceptors.request.use(
    (config) => {
        if (config.headers) {
            config.headers['Authorization'] = `${process.env.NEXT_PUBLIC_API_TOKEN}`; // 헤더에 JWT 추가
        }
        return config;
    },
    (error: Error) => {
        return Promise.reject(new Error(`Request interceptor error: ${error.message}`));
    }
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
            console.error('Response error:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // 요청이 전송되었지만 응답을 받지 못한 경우
            console.error('Request error:', error.request);
        } else {
            // 요청 설정 중 오류가 발생한 경우
            console.error('Error:', error.message);
        }
        return Promise.reject(new Error(`Response interceptor error: ${error.message}`));
    }
);

export default apiClient;