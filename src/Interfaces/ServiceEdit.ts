export interface ServiceEdit {
  id: number;
  lowPrice: number | null;
  highPrice: number | null;
  minTime: number;
  namePl: string;
  descriptionPl: string;
  nameEn: string;
  descriptionEn: string;
  serviceCategoryIds: number[];
}
