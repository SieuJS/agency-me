import type { Update } from "vite";
import apiClient from "./apiClient";

export interface RegulationOutput {
    id: string | number;
    so_luong_cac_loai_daily: number;
    so_dai_ly_toi_da_trong_quan: number;
    so_luong_mat_hang_toi_da: number;
    so_luong_don_vi_tinh: number;
}

export interface UpdateRegulationInput {
    key: string;
    value: number;
}

export interface UpdateRegulationMaxDebtInput {
    loai_daily_id: string | number;
    value: number;
}

export interface UpdateRegulationMaxDebtOutput {
    loai_daily_id: string;
    ten_loai: string ;
    tien_no_toi_da: number;
   
}

export const getRegulation = async (): Promise<RegulationOutput> => {
    try {
        const response = await apiClient.get<RegulationOutput[]>("/regulation");
        console.log("Fetched regulation:", response.data[0]);
        return response.data[0];
    } catch (error) {
        console.error("Error fetching regulation:", error);
        throw error;
    }
};

export const updateRegulation = async ( input: UpdateRegulationInput): Promise<RegulationOutput> => {
  try {
    const response = await apiClient.put<RegulationOutput>("/regulation/general", input);
    console.log("Updated regulation:", response.data);
    return response.data;
  } catch (err) {
    
    
    throw err;
  }
};

export const updateRegulationDebt = async (input: UpdateRegulationMaxDebtInput): Promise<UpdateRegulationMaxDebtOutput> => {
  try {
    const response = await apiClient.put<UpdateRegulationMaxDebtOutput>("/regulation/max_debt", input);
    console.log("Updated regulation debt:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating regulation debt:", err);
    throw err;
  }
}
