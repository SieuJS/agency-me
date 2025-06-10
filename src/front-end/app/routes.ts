// src/front-end/app/routes.ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    // Route gốc ('/') sẽ render component từ app/routes/login.tsx
    index("routes/login.tsx"), // <-- SỬA Ở ĐÂY: Thêm "routes/"

    // Route '/home' sẽ render component từ app/routes/home.tsx
    route("home", "routes/home.tsx"), // <-- SỬA Ở ĐÂY: Thêm "routes/"


    // Định nghĩa nhóm route /admin với layout chung
    {
        path: "admin/agency",
        // Đường dẫn đến file layout, tương đối với app/
        file: "routes/admin/agency/_layout.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
        children: [
            {
                path: "lookup",
                // Đường dẫn file component con, tương đối với app/
                file: "routes/admin/agency/agency-lookup.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: "add",
                file: "routes/admin/agency/agency-add.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: "detail/:agencyId",
                file: "routes/admin/agency/agency-detail.tsx", // Đảm bảo file này tồn tại
            },
            {

                path: "edit/:agencyId",
                file: "routes/admin/agency/agency-edit.tsx", // Đảm bảo file này tồn tại
            },
            {
                path: "export-slips-create",
                file: "routes/admin/agency/export-slips-create.tsx", // Đảm bảo file này tồn tại
            },
            {
                path: 'type-create',
                file: 'routes/admin/agency/agency-type-create.tsx', // Đảm bảo file này tồn tại
            },
            // (Optional) Index route cho /admin
            // {
            //   index: true,
            //   file: "routes/admin/agency-lookup.tsx" // Ví dụ
            // }
        ]
    },

    {
        path: 'admin/type-agency',
        file: 'routes/admin/type-agency/_layout.tsx', // <-- SỬA Ở ĐÂY: Thêm "routes/"
        children: [
            {
                path: "create",
                // Đường dẫn file component con, tương đối với app/
                file: "routes/admin/type-agency/agency-type-create.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            }
            ,]
    },
   /* {
        path: 'admin/change-rule',
        file: 'routes/admin/change-rule/_layout.tsx', // <-- SỬA Ở ĐÂY: Thêm "routes/"
        children: [
            {
                path: "change-rule-create",
                // Đường dẫn file component con, tương đối với app/
                file: "routes/admin/change-rule/change-rule-create.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
        ]
    },*/

    // Route cho staff
    {
        path: "staff/agency",
        file: "routes/staff/agency/_layout.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
        children: [
            {
                path: "lookup",
                file: "routes/staff/agency/agency-lookup.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: 'receipt-add',
                file: 'routes/staff/agency/agency-receipt-add.tsx', // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: 'receipt-lookup',
                file: 'routes/staff/agency/agency-receipt-lookup.tsx', // <-- SỬA Ở ĐÂY: Thêm "routes/"
            },
            {
                path: "detail/:agencyId",
                file: "routes/staff/agency/agency-detail.tsx", // Đảm bảo file này tồn tại
            },
            {
                path: "receipt-detail/:receiptId",
                file: "routes/staff/agency/agency-receipt-detail.tsx", // Đảm bảo file này tồn tại
            },
        ]
    },
    {
        path: "staff/report",
        file: "routes/staff/report/_layout.tsx", // <-- SỬA Ở ĐÂY: Thêm "routes/"
        children: [
            {
                path: "debt-report",
                file: "routes/staff/report/debt-report.tsx", // Đảm bảo file này tồn tại
            }
        ]
    },
] satisfies RouteConfig;