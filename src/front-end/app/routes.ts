// src/front-end/app/routes.ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    // Route gốc ('/') sẽ render component từ app/routes/login.tsx
    index("routes/login.tsx"), // <-- SỬA Ở ĐÂY: Thêm "routes/"

    // Route '/home' sẽ render component từ app/routes/home.tsx
    route("home", "routes/home.tsx"), // <-- SỬA Ở ĐÂY: Thêm "routes/"

    // Định nghĩa nhóm route /admin với layout chung
    {
        path: "agency",
        // Đường dẫn đến file layout, tương đối với app/
        file: "routes/agency/_layout.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
        children: [
            {
                path: "lookup",
                // Đường dẫn file component con, tương đối với app/
                file: "routes/agency/agency-lookup.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: "add",
                file: "routes/agency/agency-add.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: "detail/:agencyId",
                file: "routes/agency/agency-detail.tsx", // Đảm bảo file này tồn tại
            },
            {

                path: "edit/:agencyId",
                file: "routes/agency/agency-edit.tsx", // Đảm bảo file này tồn tại
            },
            {
                path: "export-slips-create",
                file: "routes/agency/export-slips-create.tsx", // Đảm bảo file này tồn tại
            },
            {
                path: 'type-create',
                file: 'routes/agency/agency-type-create.tsx', // Đảm bảo file này tồn tại
            },
            // (Optional) Index route cho /admin
            // {
            //   index: true,
            //   file: "routes/admin/agency-lookup.tsx" // Ví dụ
            // }
        ]
    }
] satisfies RouteConfig;