export type userTypeProp =
  | "admin"
  | "moderator"
  | "executive"
  | "exhibit"
  | "analysis"
  | "temporary";

export interface profileProp {
  user_id: string;
  display_name: string;
  user_type: string;
  available: number;
  role: string;
  note?: string;
}

export interface exhibitProp {
  exhibit_id: string;
  exhibit_name: string;
}

export interface generalFailedProp {
  status: "error";
  message: string;
}
