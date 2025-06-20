/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AppController_getHello"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/daily": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AppController_createDaiLy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["HealthController_healthCheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/protected": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AuthController_getProtectedData"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agency/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AgencyController_getAgencyList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agency/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AgencyController_createAgency"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agency/detail/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AgencyController_getAgencyDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agency/update/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["AgencyController_updateAgency"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agency/delete/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["AgencyController_deleteAgency"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agencyType/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AgencyTypeController_getAgencyTypeList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agencyType/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AgencyTypeController_createAgencyType"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agencyType/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["AgencyTypeController_deleteAgencyType"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/districts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Danh sách quận */
        get: operations["DistrictController_getAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/item": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ItemController_findWithPattern"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/export-sheets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new export sheet */
        post: operations["ExportSheetsController_createExportSheet"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/export-sheets/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of export sheets */
        get: operations["ExportSheetsController_getListExportSheets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/export-sheets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an export sheet by id */
        get: operations["ExportSheetsController_getExportSheetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/regulation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Tìm tất cả quy định */
        get: operations["RegulationController_getAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/regulation/general": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Cập nhật quy định chung */
        put: operations["RegulationController_update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/regulation/max_debt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Cập nhật tiền nợ tối đa */
        put: operations["RegulationController_update_max_debt"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/receipts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Tìm phiếu thu */
        get: operations["ReceiptController_findAll"];
        put?: never;
        /** Tạo phiếu thu */
        post: operations["ReceiptController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/receipts/{phieu_thu_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Tìm phiếu thu theo id phiếu thu */
        get: operations["ReceiptController_findOne"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/report/debt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Báo cáo công nợ */
        get: operations["ReportController_calcDebt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/revenue-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Generate revenue report by agency */
        get: operations["ReportRevenueController_generateRevenueReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AuthPayloadDto: Record<string, never>;
        ProtectedResponseDto: {
            message: string;
            user: components["schemas"]["AuthPayloadDto"];
        };
        RegisterDto: {
            /** @example user@gmail.com */
            email: string;
            /** @example password */
            password: string;
            /** @example Nguyễn Văn A */
            ten: string;
            /** @example 0912345678 */
            dienThoai: string;
            /** @example admin */
            loaiNhanVienId: string;
            /** @example 123 Đường ABC, Quận 1, TP.HCM */
            diaChi: string;
        };
        RegisterResponse: {
            /**
             * @description Message indicating the result of the operation
             * @example Registered successfully
             */
            message: string;
            /** @description The registered account. */
            account: components["schemas"]["RegisterDto"];
        };
        LoginDto: {
            /** @example user@gmail.com */
            email: string;
            /** @example password */
            password: string;
        };
        AgencyDto: {
            /** @example daily001 */
            daily_id: string;
            /** @example Công ty TNHH ABC */
            ten: string;
            /** @example 0987654321 */
            dien_thoai: string;
            /** @example daily@gmail.com */
            email: string;
            /** @example 0 */
            tien_no: number;
            /** @example 12 Nguyễn Trãi, Đống Đa, Hà Nội */
            dia_chi: string;
            /** @example Đống Đa */
            quan: string;
            /** @example loaị 01 */
            loai_daily: string;
            /**
             * Format: date-time
             * @example 12/12/2023
             */
            ngay_tiep_nhan: string;
        };
        PaginationDTO: {
            /**
             * @description Page number
             * @example 1
             */
            curPage: number;
            /**
             * @description Items per page
             * @example 10
             */
            perPage: number;
            /**
             * @description Total page
             * @example 10
             */
            totalPage: number;
            /**
             * @description Previous page
             * @example 1
             */
            prevPage: Record<string, never>;
            /**
             * @description Next page
             * @example 2
             */
            nextPage: Record<string, never>;
            /**
             * @description Total items
             * @example 100
             */
            totalItems: number;
        };
        AgencyListResponse: {
            /** @description List of agencies */
            payload: components["schemas"]["AgencyDto"][];
            /** @description Pagination information */
            meta: components["schemas"]["PaginationDTO"];
        };
        AgencyInput: {
            /** @example Công ty TNHH ABC */
            ten: string;
            /** @example 0987654321 */
            dien_thoai: string;
            /** @example daily@gmail.com */
            email: string;
            /** @example 0 */
            tien_no: number;
            /** @example 12 Nguyễn Trãi, Đống Đa, Hà Nội */
            dia_chi: string;
            /** @example Đống Đa */
            quan: string;
            /** @example loaị 01 */
            loai_daily: string;
            /**
             * Format: date-time
             * @example 12/12/2023
             */
            ngay_tiep_nhan: string;
            /**
             * @description ID of the agency
             * @example loai001
             */
            loai_daily_id: string;
            /**
             * @description ID of the employee who received the agency
             * @example dongda
             */
            quan_id: string;
        };
        AgencyCreatedResponse: {
            /** @example Agency created successfully */
            message: string;
            agency: components["schemas"]["AgencyDto"];
        };
        AgencyTypeDto: {
            /** @example loai001 */
            loai_daily_id: string;
            /** @example Loại 1 */
            ten_loai: string;
            /** @example 20000 */
            tien_no_toi_da: number;
        };
        AgencyTypeListResponse: {
            /** @description List of agency types */
            payload: components["schemas"]["AgencyTypeDto"][];
            /** @description Pagination metadata */
            meta: components["schemas"]["PaginationDTO"];
        };
        AgencyTypeInput: {
            /** @example Loại 1 */
            ten_loai: string;
            /** @example 20000 */
            tien_no_toi_da: number;
        };
        CreateAgencyTypeResponse: {
            /**
             * @description Message indicating the result of the operation
             * @example Agency type created successfully
             */
            message: string;
            /** @description The created agency type */
            agencyType: components["schemas"]["AgencyTypeDto"];
        };
        DeleteAgencyTypeResponse: {
            /**
             * @description Message indicating the result of the delete operation
             * @example Agency type deleted successfully
             */
            message: string;
        };
        ItemDto: {
            /**
             * @description The ID of the item
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            mathang_id: string;
            /**
             * @description The name of the item
             * @example Item 1
             */
            ten: string;
            /**
             * @description The price of the item
             * @example 100
             */
            don_gia: number;
            /**
             * @description The quantity of the item
             * @example Cái
             */
            don_vi_tinh: string;
        };
        ExportSheetInput: {
            /**
             * Format: date-time
             * @description The date of export sheet
             * @example 2021-01-01
             */
            ngay_lap_phieu: string;
            /**
             * @description Id dai ly
             * @example 1234567890
             */
            daily_id: string;
            /**
             * @description Id nhan vien
             * @example 1234567890
             */
            nhan_vien_lap_phieu?: string;
            /**
             * @description Danh sach mat hang
             * @example [
             *       {
             *         "mathang_id": "1234567890",
             *         "so_luong": 10
             *       }
             *     ]
             */
            items: string[];
        };
        ExportSheetsDto: {
            /**
             * @description The ID of the export sheet
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            phieu_id: string;
            /**
             * @description The name of agency
             * @example Công ty TNHH Đại Lý Hàng Hóa
             */
            daily_name: string;
            /**
             * Format: date-time
             * @description The date of export sheet
             * @example 2021-01-01
             */
            ngay_lap_phieu: string;
            /**
             * @description Nhan vien lap phieu
             * @example Nguyen Van A
             */
            nhan_vien_lap_phieu: string;
        };
        ExportSheetListResponse: {
            /** @description List of export sheets */
            data: components["schemas"]["ExportSheetsDto"][];
            /** @description Pagination information */
            meta: components["schemas"]["PaginationDTO"];
        };
        UpdateGeneralRegulationInput: {
            /**
             * @description Regulation key
             * @example so_luong_cac_loai_daily
             */
            key: string;
            /**
             * @description Giá trị mới của quy định
             * @example 10
             */
            value: number;
        };
        UpdateMaxDebtInput: {
            /**
             * @description Loại đại lý id
             * @example loai001
             */
            loai_daily_id: string;
            /**
             * @description Giá trị mới của quy định
             * @example 10
             */
            value: number;
        };
        CreateReceiptInput: {
            /** @example daily001 */
            daily_id: string;
            /** @example 2024-05-20 */
            ngay_thu: string;
            /** @example 1000000 */
            so_tien_thu: number;
        };
        ReportRevenueTimeRangeDto: {
            /** Format: date-time */
            tu_ngay: string;
            /** Format: date-time */
            den_ngay: string;
        };
        AgencyRevenueDto: {
            /** @description Unique identifier for the agency */
            daily_id: string;
            /** @description Name of the agency */
            ten_daily: string;
            /** @description Total revenue for the agency */
            tong_doanh_so: number;
            /** @description Percentage of total revenue */
            ty_le_phan_tram: number;
            /** @description Time range for the revenue report */
            thoi_gian: components["schemas"]["ReportRevenueTimeRangeDto"];
        };
        ReportRevenueResponse: {
            danh_sach_doanh_so: components["schemas"]["AgencyRevenueDto"][];
            tong_doanh_so_he_thong: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AppController_getHello: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AppController_createDaiLy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    HealthController_healthCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_getProtectedData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authenticated!! */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProtectedResponseDto"];
                };
            };
        };
    };
    AuthController_register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDto"];
            };
        };
        responses: {
            /** @description Bad Request - Account with this name already exists */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example {
                     *       "statusCode": 400,
                     *       "message": "Account with this name already exists"
                     *     } */
                    "application/json": unknown;
                };
            };
            /** @description Register a new account */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterResponse"];
                };
            };
        };
    };
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDto"];
            };
        };
        responses: {
            /** @description Bad Request - Wrong email or password */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example {
                     *       "statusCode": 400,
                     *       "message": "Wrong email or password"
                     *     } */
                    "application/json": unknown;
                };
            };
            /** @description Login to an account */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AgencyController_getAgencyList: {
        parameters: {
            query?: {
                ten?: string;
                tien_no?: number;
                quan?: string;
                loai_daily?: string;
                ngay_tiep_nhan?: string;
                /** @description Page 1 */
                page?: number;
                /** @description 10 items per page */
                perPage?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgencyListResponse"];
                };
            };
        };
    };
    AgencyController_createAgency: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Agency input data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["AgencyInput"];
            };
        };
        responses: {
            /** @description Create a new agency */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgencyCreatedResponse"];
                };
            };
        };
    };
    AgencyController_getAgencyDetail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgencyDto"];
                };
            };
        };
    };
    AgencyController_updateAgency: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AgencyInput"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgencyDto"];
                };
            };
        };
    };
    AgencyController_deleteAgency: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgencyDto"];
                };
            };
        };
    };
    AgencyTypeController_getAgencyTypeList: {
        parameters: {
            query: {
                ten_loai?: string;
                tien_no_toi_da?: number;
                /** @description Page 1 */
                page: number;
                /** @description 10 items per page */
                perPage: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of agency types with pagination */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgencyTypeListResponse"];
                };
            };
        };
    };
    AgencyTypeController_createAgencyType: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Agency type input data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["AgencyTypeInput"];
            };
        };
        responses: {
            /** @description Bad Request - Agency type with this name already exists */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example {
                     *       "statusCode": 400,
                     *       "message": "Agency type with this name already exists"
                     *     } */
                    "application/json": unknown;
                };
            };
            /** @description Create a new agency type */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreateAgencyTypeResponse"];
                };
            };
        };
    };
    AgencyTypeController_deleteAgencyType: {
        parameters: {
            query: {
                /** @description ID of the agency type to delete */
                loai_daily_id: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bad Request - Agency type not found or in use */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example {
                     *       "statusCode": 400,
                     *       "message": "Agency type not found"
                     *     } */
                    "application/json": unknown;
                };
            };
            /** @description Delete an agency type by ID */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeleteAgencyTypeResponse"];
                };
            };
        };
    };
    DistrictController_getAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ItemController_findWithPattern: {
        parameters: {
            query?: {
                /** @description Search pattern for item name */
                pattern?: string;
                /** @description Unit of the item */
                unit?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The items have been successfully fetched. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ItemDto"][];
                };
            };
            /** @description The pattern is invalid. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ExportSheetsController_createExportSheet: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExportSheetInput"];
            };
        };
        responses: {
            /** @description The export sheet has been successfully created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Agency, employee, or item not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ExportSheetsController_getListExportSheets: {
        parameters: {
            query?: {
                /** @description Page number */
                page?: number;
                /** @description Number of records per page */
                limit?: number;
                /** @description Search term */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The list of export sheets has been successfully retrieved. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExportSheetListResponse"];
                };
            };
        };
    };
    ExportSheetsController_getExportSheetById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The export sheet has been successfully retrieved. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExportSheetsDto"];
                };
            };
        };
    };
    RegulationController_getAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RegulationController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateGeneralRegulationInput"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RegulationController_update_max_debt: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMaxDebtInput"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReceiptController_findAll: {
        parameters: {
            query?: {
                daily_id?: string;
                ngay_thu?: string;
                /** @description Nhân viên thu tiền */
                nhan_vien_thu_tien?: string;
                /** @description Page number */
                page?: number;
                /** @description Items per page */
                perPage?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReceiptController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReceiptInput"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReceiptController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                phieu_thu_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReportController_calcDebt: {
        parameters: {
            query: {
                /** @description Tháng */
                month: number;
                /** @description Năm */
                year: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReportRevenueController_generateRevenueReport: {
        parameters: {
            query: {
                tu_ngay: string;
                den_ngay: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The revenue report has been successfully generated. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportRevenueResponse"];
                };
            };
        };
    };
}
