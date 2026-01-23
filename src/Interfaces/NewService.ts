export interface NewService {
  id: number;
  lowPrice: number | null;
  highPrice: number | null;
  minTime: number;
  languageCode: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  categories: string[]; 
}