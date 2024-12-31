type CoinsType = {
  coins: number;
};


type AddUrlErrorType = {
  url?: string;
  user_id?: string;
}

type SummaryType = {
  url: string;
  user_id: number;
  title: string;
  id: string;
  response: string | null;
  created_at: Date;
}