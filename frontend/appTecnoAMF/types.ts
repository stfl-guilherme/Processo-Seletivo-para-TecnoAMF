export interface Video {
  id: number;
  titulo: string;
  descricao: string;
  url_video: string;
  expirado: boolean;
  data_expiracao?: string | null;
}

export interface Tema {
  id: number;
  nome: string;
  video: number;
}

export interface Trecho {
  id: number;
  descricao: string;
  inicio: number;
  fim: number;        
  video: number;
}