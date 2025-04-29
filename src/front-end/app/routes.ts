import { type RouteConfig, route, index } from "@react-router/dev/routes"; // Thêm index

export default [
    // Định nghĩa route gốc ('/') sẽ render component từ 'routes/login.tsx'
    index("routes/login.tsx"),

    // Định nghĩa route '/home'
    route("home", "routes/home.tsx"),

  
] satisfies RouteConfig;